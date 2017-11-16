/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/16
 * @fuction
 */


var _rm = require('util/rm.js');
var _category = {
    //新增节点
    //categoryName：新增节点名称
    //parentId：父节点
    addCategory: function (categoryInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/category/add_category.do'),
            data: categoryInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //设置品类名称
    // categoryId ： 品类原id
    //categoryName：品类新名称
    setCategoryName: function (orderInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/category/set_category_name.do'),
            data: orderInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //根据parentId获取所有平级节点，不递归
    getCategoty: function (categoryId, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/category/get_category.do'),
            data: {
                categoryId: categoryId
            },
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //根据parentId获取它平级节点ID和他所有子节点的ID
    getDeepCategory: function (categoryId, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/category/get_deep_category.do'),
            data: {
                categoryId: categoryId
            },
            method: 'POST',
            success: resolve,
            error: reject
        });
    }
};
module.exports = _category;
