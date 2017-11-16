/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/13
 * @fuction
 */

require('./index.css');
var _rm = require('util/rm.js');
var _user = require('service/user-service.js');

// 侧边导航栏
var navSide = {
    option: {
        name: '',
        navList: [
            {name: 'index', desc: 'Home', href: './index.html'},
            {name: 'manage-product', desc: '商品管理', href: './manage-product.html'},
            {name: 'manage-category', desc: '品类管理', href: './manage-category.html'},
            {name: 'manage-order', desc: '订单管理', href: './manage-order.html'}
        ]
    },
    init: function (option) {
        //拓展原型，把后面的对象原型都赋予到第一个上面，会覆盖修改
        //只会对第一层属性生效
        // $.extend(dest,src1,src2,src3....)
        //合并选项
        $.extend(this.option, option);
        this.renderNav();
        this.bindEvent();
    },
    //渲染导航菜单
    renderNav: function () {
        var $target = $('#' + this.option.name);
        $target.addClass('active');
        if ($target.parent().hasClass('nav-side-second')) {
            $target.parent().addClass('in');
        }
    },
    //绑定菜单的点击事件
    bindEvent: function () {
        var _option = this.option;
        for (var i = 0, iLength = _option.navList.length; i < iLength; i++) {
            $('#' + _option.navList[i].name).click(function () {
                var $id = $(this).attr('id');
                window.location.href = './' + $id + '.html';
            });
        }
    }
};
module.exports = navSide;