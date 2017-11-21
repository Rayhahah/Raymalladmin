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
var templateHtml = require('./index.string');
var _productDetail = {
    data: {
        productId: _rm.getUrlParam('productId') || ''
    },
    init: function () {
        navSide.init({
            name: 'manage-product'
        });
        this.loadProductDetail();
        this.bindEvent();
    },
    // 加载订单详情
    loadProductDetail: function () {
        var _this = this;
        _rm.showLoading('.product-detail-content');
        _product.getProductDetail({
            productId: parseInt(this.data.productId)
        }, function (res) {
            _this.filterData(res);
            var targetHtml = _rm.renderHtml(templateHtml, res);
            $('.product-detail-content').html(targetHtml);
            $('.product-images').html(_this.getSubImages(res.imageHost, res.subImages));
            _this.getProductCategoryInfo(res.parentCategoryId, res.categoryId);

        }, function (errMsg) {
            _rm.errorTips(errMsg);
        });
    },
    //绑定点击事件
    bindEvent: function () {
        var _this = this;
    },
    //拦截数据做二次封装处理
    filterData: function (res) {
        if (res) {
            if (res.status === 1) {
                res.statusDesc = '在售';
            } else if (res.status === 0) {
                res.statusDesc = '已下架';
            }
        }
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
    //获取商品所属分类信息
    getProductCategoryInfo: function (parentCategoryId, categoryId) {
        var _this = this;
        var resultHtml = '';
        if (parentCategoryId === 0) {
            this.getCategoryHtml(parentCategoryId, categoryId, function (resHtml) {
                $('.product-category-info').html(resHtml);
            });
        } else {
            this.getCategoryHtml('0', parentCategoryId, function (resHtml) {
                resultHtml = resHtml;
                _this.getCategoryHtml(parentCategoryId, categoryId, function (resHtml) {
                    resultHtml += resHtml;
                    $('.product-category-info').html(resultHtml);
                });
            });
        }
    },
    getCategoryHtml: function (pid, id, onSuccess) {
        _category.getCategoty(pid, function (res) {
            for (var i = 0, iLength = res.length; i < iLength; i++) {
                if (res[i].id === id) {
                    onSuccess(' <select class="select-category" disabled="disabled"> <option>' + res[i].name + '</option> </select>');
                }
            }
        }, function (errMsg) {
            _rm.errorTips(errMsg);
        });
    },
};
$(function () {
    _productDetail.init();
});

