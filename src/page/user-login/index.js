/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/14
 * @fuction
 */

require('./index.css');
var _rm = require('util/rm.js');
var _user = require('service/user-service.js');

// 表单里的错误提示
var formError = {
    show: function (errMsg) {
        $('.error-item').show().find('.error-msg').text(errMsg);
    },
    hide: function () {
        $('.error-item').hide().find('.error-msg').text('');
    }
};
var _userLogin = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        //登陆
        $('.btn-login').click(function () {
            _this.submit();
        });
        // 绑定键盘登陆
        $('.login-content').keyup(function (e) {
            if (e.keyCode === 13) {
                // 键盘Enter
                _this.submit();
            }
        });
    },
    submit: function () {
        var formData = {
                username: $.trim($('#username').val()),
                password: $.trim($('#password').val())
            },
            result = this.formValidate(formData);
        if (result.status) {
            _user.login(formData, function (res) {
                window.location.href = './index.html';
            }, function (errMsg) {
                formError.show(errMsg);
            });
        } else {
            formError.show(result.msg);
        }
    },
    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_rm.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_rm.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        result.status = true;
        result.msg = "验证通过";
        return result;
    }
};
$(function () {
    _userLogin.init();
});