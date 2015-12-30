/**
 * Created by Razor <renze1983@163.com> on 2015/12/30.
 */

/**
 * 显示一个Loading界面
 */
var LoadingScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    }
});


/**
 * 菜单场景, 包括{新用户/切换用户, 开始游戏, 排行榜}这些功能
 */
var MenuScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    }
});


/**
 * 一个排行榜, 包括{用户名, 积分, 时间}
 */
var BillboardScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
    }
});