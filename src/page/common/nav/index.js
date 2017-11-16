/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/13
 * @fuction
 */

require('./index.css');
var _rm = require('util/rm.js');
var _user = require('service/user-service.js');
var _nav = {
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad: function () {
        //获取用户信息
        _user.getUserInfo(function (res) {
            $('.nav-username').text('欢迎，' + res.username + " 管理员");
        }, function (errMsg) {
            //获取信息失败就去登陆页面
            window.location.href = './user-login.html';
        });
    },
    bindEvent: function () {
        //登出
        $('.nav-logout').click(function () {
            _user.logout(function (res) {
                window.location.href = './user-login.html';
            }, function (errMsg) {
                _rm.errorTips(errMsg);
            });
        });
    },
};
$(function () {
    _nav.init();
});