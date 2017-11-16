/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/16
 * @fuction
 */

require('./index.css');
require('page/common/nav/index.js');
var _rm = require('util/rm.js');
var _category = require('service/category-service.js');
var navSide = require('page/common/nav-side/index.js');
var templateHtml = require('./index.string');
var _manageCategory = {
    data: {
        currentId: _rm.getUrlParam('categoryId') || '0'
    },
    init: function () {
        navSide.init({
            name: 'manage-category'
        });
        this.loadCategoryList();
        this.bindEvent();
    },
    // 绑定点击事件
    bindEvent: function () {
        var _this = this;
        //重新加载
        $('.btn-refresh').click(function () {
            _this.loadCategoryList();

        });
        //修改品类名称
        $(document).on('click', '.set-category-name', function () {
            var $id = $(this).data('id');
            _rm.inputTips('请输入要新的品类名称', function (inputValue) {
                if (_rm.validate(inputValue, 'require')) {
                    _category.setCategoryName({
                        categoryId: $id,
                        categoryName: inputValue
                    }, function (res) {
                        _rm.successTips(res);
                        _this.loadCategoryList();
                    }, function (errMsg) {
                        _rm.errorTips(errMsg);
                    });
                } else {
                    _rm.errorTips('新节点名不能为空');
                }
            });
        });
    },
    //加载品类列表
    loadCategoryList: function () {
        var _this = this;
        _rm.showLoading('.page-body');
        _category.getCategoty(_this.data.currentId, function (res) {
            var data = _this.filterData(res);
            var targetHtml = _rm.renderHtml(templateHtml, data);
            $('.page-body').html(targetHtml);
        }, function (errMsg) {
            _rm.showErrorMessage('.page-body', errMsg);
        });
    },
    //对数据做二次封装处理
    filterData: function (res) {
        var data = {
            currentId: this.data.currentId,
            isTop: false,
            list: res
        };
        if (parseInt(this.data.currentId) === 0) {
            data.isTop = true;
        }
        return data;
    }
};
$(function () {
    _manageCategory.init();
});

