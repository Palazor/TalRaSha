/**
 * Created by Razor <renze1983@163.com> on 2016/1/1.
 *
 * 显示一个Loading界面
 */

var LoaderScene = cc.Scene.extend({

    _interval : null,
    _label : null,
    _className:"LoaderScene",
    cb: null,
    target: null,
    /**
     * Contructor of cc.LoaderScene
     * @returns {boolean}
     */
    init : function(){
        var self = this;

        //logo
        var logoWidth = 160;
        var logoHeight = 200;

        // bg
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(32, 32, 32, 255));
        self.addChild(bgLayer, 0);

        //image move to CCSceneFile.js
        if(cc._loaderImage){
            //loading logo
            cc.loader.loadImg(preLoadBg, {isCrossOrigin : false }, function(err, img){
                logoWidth = img.width;
                logoHeight = img.height;
                self._initStage(img, cc.visibleRect.center);
            });
        }

        //loading percent
        var label = self._label = new cc.LabelTTF("Loading... 0%", "Arial", 36);
        label.setPosition(cc.visibleRect.center);
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(this._label, 10);
        return true;
    },

    _initStage: function (img, centerPos) {
        var self = this;
        var texture2d = self._texture2d = new cc.Texture2D();
        texture2d.initWithElement(img);
        texture2d.handleLoadedTexture();
        var logo = self._logo = new cc.Sprite(texture2d);
        logo.setScale(cc.contentScaleFactor());
        logo.x = centerPos.x;
        logo.y = centerPos.y;
        self._bgLayer.addChild(logo, 5);
    },
    /**
     * custom onEnter
     */
    onEnter: function () {
        var self = this;
        this._super();
        self.schedule(self._startLoading, 0.3);
    },
    /**
     * custom onExit
     */
    onExit: function () {
        this._super();
        var tmpStr = "Loading... 0%";
        this._label.setString(tmpStr);
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function (resources, cb, target) {
        if(cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function () {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function (result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString("Loading... " + percent + "%");
            }, function () {
                if (self.cb)
                    self.cb.call(self.target);
            });
    }
});

LoaderScene.preload = function(resources, cb, target){
    var loaderScene;
    if(!loaderScene) {
        loaderScene = new LoaderScene();
        loaderScene.init();
    }
    loaderScene.initWithResources(resources, cb, target);

    cc.director.runScene(loaderScene);
    return loaderScene;
};