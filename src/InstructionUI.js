/**
 * Created by Razor <renze1983@163.com> on 2015/12/30.
 *
 * 用各种形状的遮罩遮蔽GameLayer, 并用文字提示玩家进行对应操作.
 * Step 1: 普通的一笔画消除
 * Step 2: 多彩宝石消除
 * Step 3: 一个宝石开始转变为石头
 * Step 4: 一笔画消除石头(石头原位置产生一个新多彩宝石)
 * Step 5: 又一个石头
 * Step 6: 用炸弹摧毁
 */
var InstructionUI = cc.Layer.extend({

    gameLayer:null,

    ctor: function (gameLayer) {
        this._super();
        this.gameLayer = gameLayer;
    },

    goToStep: function (step) {

    },

    nextStep: function () {

    },

    /**
     * No need to implement
     */
    prevStep: function () {

    }

});