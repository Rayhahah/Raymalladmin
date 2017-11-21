/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/17
 * @fuction
 */


require('./index.css');
require('page/common/nav/index.js');
var _rm = require('util/rm.js');
var _product = require('service/product-service.js');
var _category = require('service/category-service.js');
var navSide = require('page/common/nav-side/index.js');
var Simditor = require('simditor');
require('node_modules/simditor/styles/simditor.scss');

var _productSave = {
    data: {
        productId: _rm.getUrlParam('productId') || '',
        name: '',
        subtitle: '',
        categoryId: '',
        parentCategoryId: '',
        mainImage: '',
        subImages: [],
        detail: '这里输入商品详细信息......',
        stock: '',
        status: '1',
        price: '',
        imageHost: ''
    },
    init: function () {
        navSide.init({
            name: 'manage-product'
        });
        this.loadProductDetail();
        this.initSimditor();
        this.bindEvent();
    },
    //绑定点击事件
    bindEvent: function () {
        var _this = this;
        //提交修改或新增货品
        $('.btn-submit').click(function () {
            _this.data.name = $.trim($('.input-product-name').val());
            _this.data.subtitle = $.trim($('.input-product-desc').val());
            _this.data.price = parseInt($.trim($('.input-product-price').val()));
            _this.data.stock = parseInt($.trim($('.input-product-stock').val()));
            _this.data.detail = $.trim(_this.editor.getValue());
            var result = _this.validateData();
            if (result.status) {
                var subImagesStr = _this.data.subImages.join(',');
                if (_rm.validate(_this.data.productId, 'require')) {
                    _product.saveProduct({
                        id: _this.data.productId,
                        name: _this.data.name,
                        categoryId: _this.data.categoryId,
                        subtitle: _this.data.subtitle,
                        subImages: subImagesStr,
                        detail: _this.data.detail,
                        stock: _this.data.stock,
                        status: _this.data.status,
                        price: _this.data.price,
                    }, function (res) {
                        _rm.successTips(res, function () {
                            window.location.href = './manage-product.html';
                        });
                    }, function (errMsg) {
                        _rm.successTips(errMsg);
                    });
                } else {
                    _product.saveProduct({
                        name: _this.data.name,
                        categoryId: _this.data.categoryId,
                        subtitle: _this.data.subtitle,
                        subImages: subImagesStr,
                        detail: _this.data.detail,
                        stock: _this.data.stock,
                        status: _this.data.status,
                        price: _this.data.price,
                    }, function (res) {
                        _rm.successTips(res, function () {
                            window.location.href = './manage-product.html';
                        });
                    }, function (errMsg) {
                        _rm.successTips(errMsg);
                    });
                }
            } else {
                _rm.errorTips(result.msg);
            }
        });

        //事件委托上传点击，否则ajaxFileUpload会删除原来的input
        $(document).on('change', '#upload_file', function () {
            console.log('change' + $(this));
            _product.uploadFileAjax('upload_file', function (res) {
                _this.data.imageHost = res.url.substring(0, res.url.lastIndexOf('/') + 1);
                _this.data.subImages.push(res.uri);
                if (!_rm.validate(_this.data.mainImage, 'require')) {
                    _this.data.mainImage = res.uri;
                }
                _this.renderSubImage();
            }, function (errMsg) {
                _rm.errorTips(errMsg);
            });
        });
        //点击删除需要上传的图片
        $(document).on('click', '.close-img', function () {
            var $this = $(this),
                _id = $this.data('id');
            _this.data.subImages.remove(_id);
            console.log(_this.data.subImages);
            _this.renderSubImage();
        });
        //事件委托选择品类父节点
        $(document).on('change', '.select-category-parent', function () {
            _this.data.parentCategoryId = $(this).val();
            _this.getCategoryHtml(_this.data.parentCategoryId, '.select-category-child', _this.data.categoryId)
        });
        //事件委托选择品类子节点
        $(document).on('change', '.select-category-child', function () {
            _this.data.categoryId = $(this).val();
        });

    },
    //判断搜索信息是否合法
    validateData: function () {
        var result = {
            status: false,
            msg: ''
        };
        if (!_rm.validate(this.data.name, 'require')) {
            result.msg = '商品名称不能为空';
            return result;
        }
        if (!_rm.validate(this.data.subtitle, 'require')) {
            result.msg = '商品标题不能为空';
            return result;
        }
        if (!_rm.validate(this.data.categoryId, 'require')) {
            result.msg = '商品品类不能为空';
            return result;
        }
        if (!_rm.validate(this.data.price, 'require')) {
            result.msg = '商品价格不能为空';
            return result;
        }
        if (!_rm.validate(this.data.price, 'number')) {
            result.msg = '商品价格应为数字';
            return result;
        }
        if (!_rm.validate(this.data.stock, 'require')) {
            result.msg = '商品库存不能为空';
            return result;
        }
        if (!_rm.validate(this.data.stock, 'number')) {
            result.msg = '商品库存应为数字';
            return result;
        }

        if (this.data.subImages.length <= 0) {
            result.msg = '商品图片不能为空';
            return result;
        }
        if (!_rm.validate(this.data.detail, 'require')) {
            result.msg = '商品详情不能为空';
            return result;
        }
        result.status = true;
        result.msg = '搜索信息合法';
        return result;
    },
    // 加载订单详情
    loadProductDetail: function () {
        var _this = this;
        if (_rm.validate(this.data.productId, 'require')) {
            _product.getProductDetail({
                productId: parseInt(this.data.productId)
            }, function (res) {
                _this.filterData(res);
                $('.input-product-name').val(_this.data.name);
                $('.input-product-desc').val(_this.data.subtitle);
                $('.input-product-price').val(_this.data.price);
                $('.input-product-stock').val(_this.data.stock);

                //渲染回填品类信息
                _this.getProductCategoryInfo(_this.data.parentCategoryId, _this.data.categoryId);
                //渲染回填图片信息
                _this.renderSubImage();
                // 渲染回填富文本信息
                _this.editor.setValue(_this.data.detail);
            }, function (errMsg) {
                _rm.errorTips(errMsg);
            });
        } else {
            _this.getProductCategoryInfo(_this.data.parentCategoryId, _this.data.categoryId);
            _this.renderSubImage();
        }
    },    //拦截数据做二次封装处理
    filterData: function (res) {
        this.data.name = res.name;
        this.data.subtitle = res.subtitle;
        this.data.categoryId = res.categoryId;
        this.data.parentCategoryId = res.parentCategoryId;
        this.data.imageHost = res.imageHost;
        this.data.subImages = res.subImages.split(',');
        if (this.data.subImages.length > 0) {
            this.data.mainImage = this.data.subImages[0];
        }
        this.data.detail = res.detail;
        this.data.price = res.price;
        this.data.stock = res.stock;
    },
    //获取商品所属分类信息
    getProductCategoryInfo: function (parentCategoryId, categoryId) {
        this.getCategoryHtml('0', '.select-category-parent', parentCategoryId);
        if (_rm.validate(categoryId, 'require')) {
            this.getCategoryHtml(parentCategoryId, '.select-category-child', categoryId);
        }
    },
    //获取回调select的数据
    getCategoryHtml: function (pid, target, id) {
        _category.getCategoty(pid, function (res) {
            var selectName = '-1';
            $(target).html(' <option value="-1">请选择</option>');
            for (var i = 0, iLength = res.length; i < iLength; i++) {
                if (_rm.validate(id, 'require')) {
                    if (id === res[i].id) {
                        selectName = res[i].id;
                    }
                }
                $(target).append(' <option value="' + res[i].id + '">' + res[i].name + '</option>');
            }
            $(target).val(selectName);
        }, function (errMsg) {
            _rm.errorTips(errMsg);
        });
    },
    //生成多图的html
    getSubImages: function (imageHost, subImages) {
        if (!subImages) {
            return '';
        }
        var images = subImages.split(',');
        var imagesHtml = '';
        if (images && images.length > 0) {
            for (var i = 0, iLength = images.length; i < iLength; i++) {
                imagesHtml += '<img src="' + imageHost + images[i] + '" class="p-img" style="display: inline"/>'
            }
        }
        return imagesHtml;
    },
    //渲染图片
    renderSubImage: function () {
        if (this.data.subImages.length > 0) {
            for (var i = 0, iLength = this.data.subImages.length; i < iLength; i++) {
                if (i == 0) {
                    $('.sub-image').html(' <img class="product-image" data-id="' + this.data.subImages[i] + '"src="' + this.data.imageHost + this.data.subImages[i] + '"/> <i class="fa fa-close fa-fw close-img" data-id="' + this.data.subImages[i] + '"></i>');
                } else {
                    $('.sub-image').append(' <img class="product-image" data-id="' + this.data.subImages[i] + '"src="' + this.data.imageHost + this.data.subImages[i] + '"/> <i class="fa fa-close fa-fw close-img" data-id="' + this.data.subImages[i] + '"></i>');
                }
            }
        } else {
            $('.sub-image').html('<p class="">选择图片吧！垃圾！</p>');
        }
    },
    //初始化富文本编辑器
    initSimditor: function () {
        console.log(this.data.detail);
        this.editor = new Simditor({
            textarea: $('#rich-editor'),
            placeholder: this.data.detail,
            toolbar: true,
            pasteImage: true,
            upload: {
                url: _rm.getServerUrl('/manage/product/richtext_img_upload.do'),
                defaultImage: '',
                fileKey: 'upload_file'
            }
        });
    },
};
$(function () {
    _productSave.init();
});

