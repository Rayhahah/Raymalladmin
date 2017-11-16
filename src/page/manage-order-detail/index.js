/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/15
 * @fuction
 */

require('./index.css');
require('page/common/nav/index.js');
var _rm = require('util/rm.js');
var _order = require('service/order-service.js');
var navSide = require('page/common/nav-side/index.js');
var templateHtml = require('./index.string');
var _orderDetail = {
    data: {
        orderNo: _rm.getUrlParam('orderNo') || ''
    },
    init: function () {
        navSide.init({
            name: 'manage-order'
        });
        this.loadOrderDetail();
        this.bindEvent();
    },
    // 加载订单详情
    loadOrderDetail: function () {
        _rm.showLoading('.page-content');
        _order.getOrderDetail({
            orderNo: this.data.orderNo
        }, function (res) {
            var targetHtml = _rm.renderHtml(templateHtml, res);
            $('.page-content').html(targetHtml);
        }, function (errMsg) {
            _rm.errorTips(errMsg);
        });

    },
    //绑定点击事件
    bindEvent: function () {
        var _this = this;
        //发货按钮是动态渲染的，所以需要使用事件委托
        $(document).on('click', '.btn-send-goods', function () {
            if ($(this).hasClass('disabled')) {
                return;
            }
            _rm.confirmTips('确认发送货物吗？', function () {
                _order.sendGoods({
                    orderNo: _this.data.orderNo
                }, function (res) {
                    _rm.successTips(res);
                    _this.loadOrderDetail();
                }, function (errMsg) {
                    _rm.errorTips(errMsg);
                });
            });
        });
    }
};
$(function () {
    _orderDetail.init();
});

