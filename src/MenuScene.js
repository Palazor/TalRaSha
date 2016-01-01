/**
 * Created by Razor <renze1983@163.com> on 2016/1/1.
 * 菜单场景, 包括{新用户/切换用户, 开始游戏, 排行榜}这些功能
 */

var MenuLayer = cc.Layer.extend({
    centerX: 0,
    centerY: 0,

    menuUser: null,
    menuStart: null,
    menuScoreborad: null,
    menuStaff: null,

    ctor: function () {
        this._super();

        this.centerX = cc.visibleRect.center.x;
        this.centerY = cc.visibleRect.center.y;

        var bg = new cc.Sprite(preLoadBg);
        bg.setPosition(this.centerX, this.centerY);
        this.addChild(bg);

        gameScene = new GameScene();
        scoreboardScene = new ScoreboardScene();
    },

    init: function () {
        // user
        var curUser = "Razor";//Storage.getCurrentUser();
        var labelUser = new cc.LabelTTF("", "microsoft yahei", 48, undefined, cc.TEXT_ALIGNMENT_LEFT);
        labelUser.setPosition(this.centerX, this.centerY);
        labelUser.setColor(cc.color(255, 255, 255));
        this.addChild(labelUser);
        if (curUser) {
            labelUser.setString('欢迎您, 指挥官' + curUser);
        }

        // user menu
        var text = curUser ? '切换用户' : '新用户';
        this.menuUser = MenuItem(text, function () {
            //this._inputUser();
        }, this);

        // start menu
        this.menuStart = MenuItem('开始游戏', function () {
            cc.director.runScene(new cc.TransitionFade(0.5, gameScene));
        }, this);

        // scorboard menu
        this.menuScoreborad = MenuItem('排行榜', function () {
            cc.director.runScene(new cc.TransitionFade(0.5, scoreboardScene));
        }, this);

        // staff menu
        this.menuStaff = MenuItem('制作人员', function () {
            this._showStaff();
        }, this);

        var menu = new cc.Menu(this.menuUser, this.menuStart, this.menuScoreborad, this.menuStaff);
        menu.alignItemsVerticallyWithPadding(20);
        this.addChild(menu);
        menu.y = cc.winSize.height / 4;
    },

    _inputUser: function () {
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 127), width, height);
        this.addChild(layer, 10);

        var bg = new cc.Sprite('res/dialogBg.png');
        bg.setPosition(width / 2, height / 2);
        layer.addChild(bg);

        var inputBg = new cc.Sprite('res/inputBg.png');
        inputBg.setPosition(width / 2, height / 2 + 50);
        layer.addChild(inputBg);

        var inputField = new cc.EditBox(cc.size(inputBg.width - 10, inputBg.height - 10), inputBg);
        inputField.setFontSize(36);
        inputField.setMaxLength(10);
        inputField.setFontColor(cc.color(255, 255, 255));
        inputField.setPosition(width / 2, height / 2 + 50);
        layer.addChild(inputField);

        // block event
        var clickHandler = function () {
            this.removeChild(layer);
        };
        if("touches" in cc.sys.capabilities) {
            var clickListener = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: clickHandler.bind(this)
            };
        } else {
            clickListener = {
                event: cc.EventListener.MOUSE,
                swallowTouches: true,
                onMouseDown: clickHandler.bind(this)
            };
        }
        //cc.eventManager.addListener(clickListener, bg);
    },

    _showStaff: function () {
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 127), width, height);
        this.addChild(layer, 10);

        var bg = new cc.Sprite('res/dialogBg.png');
        bg.setPosition(width / 2, height / 2);
        layer.addChild(bg);

        var label = new cc.LabelTTF("All by Razor", "microsoft yahei", 36);
        label.setColor(cc.color(255, 255, 255));
        label.setPosition(width / 2, height / 2 + 50);
        layer.addChild(label);

        var close = MenuItem('关闭', function () {
            this.removeChild(layer);
        }, this);
        close.setPosition(0, -50);
        layer.addChild(new cc.Menu(close));
    }
});

var MenuScene = cc.Scene.extend({
    menu: null,

    ctor: function () {
        this._super();

        this.menu = new MenuLayer();
        this.addChild(this.menu);

        return true;
    },

    onEnter: function () {
        this._super();

        this.menu.init();
    }
});