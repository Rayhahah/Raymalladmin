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
var _addCategory = {
    data: {
        currentParentId: '0',
        categoryList: []
    },
    init: function () {
        navSide.init({
            name: 'manage-category'
        });
        this.loadFirstCategory();
        this.bindEvent();
    },
    // 绑定点击事件
    bindEvent: function () {
        var _this = this;
        // 选择框改变的情况下
        $('.select-parent-category').change(function () {
            var selectProvice = $(this).val();
            _this.data.currentParentId = selectProvice;
        });
        // 提交新增节点
        $('.btn-submit').click(function () {
            var categoryName = $.trim($('.input-category-name').val());
            if (_rm.validate(categoryName, 'require')) {
                _category.addCategory({
                    categoryName: categoryName,
                    parentId: _this.data.currentParentId
                }, function (res) {
                    _rm.successTips(res);
                }, function (errMsg) {
                    _rm.errorTips(errMsg);
                })
            } else {
                _rm.errorTips('节点名称不能为空');
            }
        });

    },
    //加载全部一级节点
    //目前只对一级节点可以做添加
    loadFirstCategory: function () {
        var _this = this;
        _category.getCategoty('', function (res) {
            _this.filterData(res);
            var optionHtml = _this.getSelectOption(_this.data.categoryList);
            $('.select-parent-category').html(optionHtml);
        }, function (errMsg) {
            _rm.errorTips(errMsg);
        });
    },
    //截取关键数据
    filterData: function (res) {
        if (res && res.length > 0) {
            for (var i = 0, iLength = res.length; i < iLength; i++) {
                this.data.categoryList.push({
                    id: res[i].id,
                    name: res[i].name
                })
            }
        }
    },
    //获取select框选项，输入数组，输出html
    getSelectOption: function (optionArray) {
        var html = '<option value="0">/</option>';//默认样式
        for (var i = 0, length = optionArray.length; i < length; i++) {
            html += '<option value="' + optionArray[i].id + '">/' + optionArray[i].name + '</option>';
        }
        return html;
    },
};
$(function () {
    _addCategory.init();
});