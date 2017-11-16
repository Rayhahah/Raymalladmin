/**
 * @author Rayhahah
 * @blog http://rayhahah.com
 * @time 2017/11/16
 * @fuction
 */

require('./index.css');
var _loading = {
    /**
     * 显示加载动画
     * @param target 存放加载动画的容器
     * @param type   选择一下的其中一种使用   spinner : 律动柱状
     *                                         square ： 反转正方形
     *                                         doubleBounce ： 层叠圆形
     *                                         dot: 交错圆形
     *                                         circle: 绕圈圆形
     *
     * @param option:  动画的属性 ：   color : 动画的整体颜色
     *                                  contentWidth: 动画整体宽度
     *                                  contentHeight: 动画整体高度
     *                                  childWidth: 动画内元素的宽度，spinner  、 circle 有
     */
    show: function (target, type, option) {
        var defaultOption = {
            color: '#eee',
            contentWidth: '150px',
            contentHeight: '150px',
            childWidth: '15px',
            childHeight: '15px'
        };
        var loadingHtml = this.renderHtml(type)
        if (target instanceof jQuery) {
            target.html(loadingHtml);
        } else {
            $(target).html(loadingHtml);
        }
        var $option = $.extend(defaultOption, option);
        this.initOption(target, $option);
    },
    /**
     * 渲染对应的html结构
     */
    renderHtml: function (type) {
        var loadingHtml = '';
        if (type === 'spinner') {
            loadingHtml = '<div class="spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div>';
        } else if (type === 'square') {
            loadingHtml = '<div class="square-rotate"></div>';
        } else if (type === 'doubleBounce') {
            loadingHtml = '<div class="double-bounce-body"> <div class="double-bounce1"></div> <div class="double-bounce2"></div> </div>';
        } else if (type === 'dot') {
            loadingHtml = '<div class="dot-body"> <div class="dot1"></div> <div class="dot2"></div> </div>';
        } else if (type === 'circle') {
            loadingHtml = '<div class="circle-body"> <div class="circle-container container1"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> <div class="circle-container container2"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> <div class="circle-container container3"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> </div>';
        }
        return loadingHtml;
    },
    /**
     * 属性设置
     * 不知道为啥find一定为true，所以是用outerWidth来判断
     */
    initOption: function (target, option) {
        if ($(target).find('.spinner').outerWidth()) {
            $('.spinner  div').attr('style',
                'background-color:' + option.color
                + ';width:' + option.childWidth);
            $('.spinner').attr('style',
                'height:' + option.contentHeight
                + '; width:' + option.contentWidth);
        } else if ($(target).find('.square-rotate').outerWidth()) {
            $('.square-rotate').attr('style',
                'background-color:' + option.color
                + ';' + 'height:' + option.contentHeight
                + '; width:' + option.contentWidth);
        } else if ($(target).find('.double-bounce-body').outerWidth()) {
            $('.double-bounce1, .double-bounce2').attr('style', 'background-color:' + option.color);
            $('.double-bounce-body').attr('style',
                'height:' + option.contentHeight
                + '; width:' + option.contentWidth);
        } else if ($(target).find('.dot-body').outerWidth()) {
            $('.dot1, .dot2').attr('style', 'background-color:' + option.color);
            $('.dot-body').attr('style',
                'height:' + option.contentHeight
                + '; width:' + option.contentWidth);
        } else if ($(target).find('.circle-body').outerWidth()) {
            $('.container1 > div, .container2 > div, .container3 > div').attr('style',
                'background-color:' + option.color
                + ';height:' + option.childHeight
                + ';width:' + option.childWidth);
            $('.circle-body').attr('style',
                'height:' + option.contentHeight
                + '; width:' + option.contentWidth);
        }
    }
};
module.exports = _loading;