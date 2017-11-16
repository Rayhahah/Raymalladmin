/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/14
 * @fuction
 */


var _rm = require('util/rm.js');
var _user = {
    //用户登录
    login: function (userInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/user/login.do'),
            data: userInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //获取当前登陆用户信息，强制登陆
    getUserInfo: function (resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/user/get_information.do'),
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //检查登陆状态
    checkLogin: function (resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/user/get_user_info.do'),
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //登出
    logout: function (resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/user/logout.do'),
            method: 'POST',
            success: resolve,
            error: reject
        });
    }
};
module.exports = _user;
