/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/15
 * @fuction
 */


var _rm = require('util/rm.js');
var _order = {
    //获取订单列表
    getOrderList: function (userInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/order/list.do'),
            data: userInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //获取订单详情
    getOrderDetail: function (orderInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/order/detail.do'),
            data: orderInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //根据订单号模糊所有所有匹配订单
    searchOrderList: function (orderInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/order/search.do'),
            data: orderInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //对已付款订单，发货~~
    sendGoods: function (orderInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/order/send_goods.do'),
            data: orderInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    }
};
module.exports = _order;
