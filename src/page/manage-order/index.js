/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/15
 * @fuction
 */

require('./index.css');
require('page/common/nav/index.js');
require("exports?window.anno!../../util/jqpaginator.min.js");
var _rm = require('util/rm.js');
var _order = require('service/order-service.js');
var navSide = require('page/common/nav-side/index.js');
var templateHtml = require('./index.string');
var _manageOrder = {
    data: {
        type: 'list',
        listParams: {
            sortValue: _rm.getUrlParam('sortValue') || '',
            sortBy: _rm.getUrlParam('sortBy') || 'orderNo',
            pageNum: _rm.getUrlParam('pageNum') || 1,
            pageSize: _rm.getUrlParam('pageSize') || 10,
            totalPages: 0,
        }
    },
    init: function () {
        navSide.init({
            name: 'manage-order'
        });
        this.loadOrderList();
        this.bindEvent();
    },
    // 绑定点击事件
    bindEvent: function () {
        var _this = this;
        $('.btn-query').click(function () {
            _this.submitSearch();
        });
        $('.order-input').keyup(function (e) {
            if (e.keyCode === 13) {
                _this.submitSearch();
            }
        });
        $('.btn-refresh').click(function () {
            _this.data.listParams.pageNum = 1;
            _this.data.type = 'list';
            _this.loadOrderList();
        });

    },
    //加载订单列表
    loadOrderList: function () {
        var _this = this;
        _rm.showLoading('.order-list');
        if (this.data.type === 'list') {
            _order.getOrderList({
                pageNum: _this.data.listParams.pageNum,
                pageSize: _this.data.listParams.pageSize
            }, function (res) {
                console.log(res);
                _this.renderOrderList(res);
            }, function (errMsg) {
                _rm.errorTips(errMsg);
            });
        } else if (this.data.type === 'search') {
            //按照订单号搜索
            // 以便以后的拓展
            if (this.data.listParams.sortBy === 'orderNo') {
                //搜索获取订单列表
                _order.searchOrderList({
                    orderNo: this.data.listParams.sortValue,
                    pageNum: this.data.listParams.pageNum,
                    pageSize: this.data.listParams.pageSize
                }, function (res) {
                    _this.renderOrderList(res);
                }, function (errMsg) {
                    _rm.errorTips(errMsg);
                });
            }
        }
    },
    //渲染订单列表
    renderOrderList: function (res) {
        this.data.listParams.pageNum = res.pageNum;
        this.data.listParams.totalPages = res.total;
        var _html = _rm.renderHtml(templateHtml, res);
        $('.order-list').html(_html);
        this.renderPagination();
    },
    //加载分页插件
    renderPagination: function () {
        var _this = this;
        $('#order-pagination').jqPaginator({
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
                    _this.loadOrderList()
                }
            }
        });
    },
    submitSearch: function () {
        var sortBy = $('.order-sort-by').val(),
            sortValue = $('.order-input').val(),
            _this = this;
        var result = this.validateSort(sortBy, sortValue);
        if (result.status) {
            this.data.listParams.sortBy = sortBy;
            this.data.listParams.sortValue = sortValue;
            this.data.listParams.pageNum = 1;
            this.data.type = 'search';
            _this.loadOrderList();
        } else {
            _rm.errorTips(result.msg);
        }
    },
    //判断搜索信息是否合法
    validateSort: function (sortBy, sortValue) {
        var result = {
            status: false,
            msg: ''
        };
        if (sortBy === 'orderNo') {
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
    _manageOrder.init();
});

