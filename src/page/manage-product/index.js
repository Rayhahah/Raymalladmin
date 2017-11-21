/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/16
 * @fuction
 */
require('./index.css');
require('page/common/nav/index.js');
require("exports?window.anno!../../util/jqpaginator.min.js");
var _rm = require('util/rm.js');
var _product = require('service/product-service.js');
var navSide = require('page/common/nav-side/index.js');
var templateHtml = require('./index.string');
var _manageProduct = {
    data: {
        type: 'list',
        listParams: {
            sortValue: _rm.getUrlParam('sortValue') || '',
            sortBy: _rm.getUrlParam('sortBy') || 'productId',
            pageNum: _rm.getUrlParam('pageNum') || 1,
            pageSize: _rm.getUrlParam('pageSize') || 10,
            totalPages: 0
        }
    },
    init: function () {
        navSide.init({
            name: 'manage-product'
        });
        this.loadProductList();
        this.bindEvent();
    },
    // 绑定点击事件
    bindEvent: function () {
        var _this = this;
        // 根据条件搜索商品
        $('.btn-query').click(function () {
            _this.submitSearch();
        });
        $('.product-input').keyup(function (e) {
            if (e.keyCode === 13) {
                _this.submitSearch();
            }
        });
        //重新加载列表
        $('.btn-refresh').click(function () {
            _this.data.listParams.pageNum = 1;
            _this.data.type = 'list';
            _this.loadProductList();
        });
        //上下架按钮
        $(document).on('click', '.btn-sold-out', function () {
            var $this = $(this);
            var statusAction = $this.text();
            _rm.confirmTips('确认' + statusAction + '该商品？', function () {
                var _status = '';
                //需要设置的商品状态
                if (statusAction === '上架') {
                    _status = '1';
                } else if (statusAction === '下架') {
                    _status = '0';
                }
                _product.setProductStatus({
                    productId: $this.data('id'),
                    status: _status
                }, function (res) {
                    _this.loadProductList();
                    _rm.successTips(res);
                }, function (errMsg) {
                    _rm.errorTips(errMsg);
                })
            });
        });
    },
    // 设置搜索商品的信息
    submitSearch: function () {
        var sortBy = $('.product-sort-by').val(),
            sortValue = $('.product-input').val(),
            _this = this;
        var result = this.validateSort(sortBy, sortValue);
        if (result.status) {
            this.data.listParams.sortBy = sortBy;
            this.data.listParams.sortValue = sortValue;
            this.data.listParams.pageNum = 1;
            this.data.type = 'search';
            _this.loadProductList();
        } else {
            _rm.errorTips(result.msg);
        }
    },
    //加载商品列表
    loadProductList: function () {
        var _this = this;
        _rm.showLoading('.product-list');
        if (this.data.type === 'list') {
            _product.getProductList({
                pageNum: _this.data.listParams.pageNum,
                pageSize: _this.data.listParams.pageSize
            }, function (res) {
                _this.renderProductList(res);
            }, function (errMsg) {
                _rm.errorTips(errMsg);
            });
        } else if (this.data.type === 'search') {
            //按照商品id搜索
            // 以便以后的拓展
            if (this.data.listParams.sortBy === 'productId') {
                //搜索获取商品列表
                _product.searchProductList({
                    productId: this.data.listParams.sortValue,
                    pageNum: this.data.listParams.pageNum,
                    pageSize: this.data.listParams.pageSize
                }, function (res) {
                    _this.renderProductList(res);
                }, function (errMsg) {
                    _rm.errorTips(errMsg);
                });
            } else if (this.data.listParams.sortBy === 'productName') {
                //根据商品名称搜索
                //搜索获取商品列表
                _product.searchProductList({
                    productName: this.data.listParams.sortValue,
                    pageNum: this.data.listParams.pageNum,
                    pageSize: this.data.listParams.pageSize
                }, function (res) {
                    _this.renderProductList(res);
                }, function (errMsg) {
                    _rm.errorTips(errMsg);
                });

            }
        }
    },
    //渲染商品列表
    renderProductList: function (res) {
        this.data.listParams.pageNum = res.pageNum;
        this.data.listParams.totalPages = res.total;
        this.filterData(res);
        var _html = _rm.renderHtml(templateHtml, res);
        $('.product-list').html(_html);
        if (this.data.listParams.totalPages > 0) {
            this.renderPagination();
        }
    },
    //拦截数据，设置信息
    filterData: function (res) {
        if (res && res.list && res.list.length > 0) {
            for (var i = 0, iLength = res.list.length; i < iLength; i++) {
                var _status = res.list[i].status;
                if (_status === 1) {
                    // 在售
                    res.list[i].statusDesc = '在售';
                    res.list[i].statusAction = '下架';
                } else if (_status === 0) {
                    //下架
                    res.list[i].statusDesc = '已下架';
                    res.list[i].statusAction = '上架';
                }
            }
        }
    },
    //加载分页插件
    renderPagination: function () {
        var _this = this;
        $('#product-pagination').jqPaginator({
            totalCounts: _this.data.listParams.totalPages,
            pageSize: _this.data.listParams.pageSize,
            visiblePages: 5,
            currentPage: _this.data.listParams.pageNum,
            first: '<li class="first"><a href="javascript:void(0);">First</a></li>',
            prev: '<li class="prev"><a href="javascript:void(0);"><<</a></li>',
            next: '<li class="next"><a href="javascript:void(0);">>></a></li>',
            last: '<li class="last"><a href="javascript:void(0);">Last</a></li>',
            page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
            onPageChange: function (num) {
                if (num != _this.data.listParams.pageNum) {
                    _this.data.listParams.pageNum = num;
                    _this.loadProductList();
                }
            }
        });
    },
    //判断搜索信息是否合法
    validateSort: function (sortBy, sortValue) {
        var result = {
            status: false,
            msg: ''
        };
        if (sortBy === 'productId') {
            if (!_rm.validate(sortValue, 'number')) {
                result.msg = '订单号只能为数字';
                return result;
            }
        }
        result.status = true;
        result.msg = '搜索信息合法';
        return result;
    }

};
$(function () {
    _manageProduct.init();
});

