/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/16
 * @fuction
 */


var _rm = require('util/rm.js');
var _product = {
    //获取商品列表
    getProductList: function (productInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/product/list.do'),
            data: productInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //新增商品
    //categoryId，name，subtitle，mainImage，subImages，detail，stock，status，price
    saveProduct: function (productInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/product/save.do'),
            data: productInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //根据商品id或商品名称搜索商品列表
    //productName、productId、pageNum、pageSize
    searchProductList: function (productInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/product/search.do'),
            data: productInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //获取商品详细信息
    getProductDetail: function (productId, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/product/detail.do'),
            data: productId,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //设置商品状态
    //productId、status
    setProductStatus: function (productInfo, resolve, reject) {
        _rm.request({
            url: _rm.getServerUrl('/manage/product/set_sale_status.do'),
            data: productInfo,
            method: 'POST',
            success: resolve,
            error: reject
        });
    },
    //上传文件
    uploadFile: function (formData, resolve, reject) {
        _rm.upload({
            url: _rm.getServerUrl('/manage/product/upload.do'),
            data: {
                upload_file: formData
            },
            success: resolve,
            error: reject
        });
    },
    //使用ajaxfileUploader
    uploadFileAjax: function (fileId, resolve, reject) {
        _rm.ajaxUpload({
            url: _rm.getServerUrl('/manage/product/upload.do'),
            fileId: fileId,
            success: resolve,
            error: reject
        });
    }
};
module.exports = _product;
