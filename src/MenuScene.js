/**
 * Created by Razor <renze1983@163.com> on 2016/1/1.
 * 菜单场景, 包括{新用户/切换用户, 开始游戏, 排行榜}这些功能
 */

var MenuLayer = cc.Layer.extend({
    centerX: 0,
    centerY: 0,

    labelUser: null,

    menuUser: null,
    menuStart: null,
    menuScoreborad: null,
    menuStaff: null,

    menu: null,

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
        var curUser = Storage.getCurrentUser();
        var labelUser = new cc.LabelTTF("", "microsoft yahei", 48, undefined, cc.TEXT_ALIGNMENT_LEFT);
        labelUser.setPosition(this.centerX, this.centerY + 50);
        labelUser.setColor(cc.color(255, 255, 255));
        this.addChild(labelUser);
        this.labelUser = labelUser;
        if (curUser) {
            labelUser.setString('欢迎您, 指挥官' + curUser);
        }

        // user menu
        var text = curUser ? '切换用户' : '新用户';
        this.menuUser = MenuItem(text, function () {
            this._inputUser();
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
        menu.alignItemsVerticallyWithPadding(40);
        this.addChild(menu);
        menu.y = cc.winSize.height / 3;
        this.menu = menu;
    },

    _inputUser: function () {
        this._toggleMenu(false);

        var width = cc.winSize.width;
        var height = cc.winSize.height;
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 127), width, height);
        this.addChild(layer, 10);

        var bg = new cc.Sprite('res/dialogBg.png');
        bg.setPosition(width / 2, height / 2);
        layer.addChild(bg);

        var labelInput = new cc.LabelTTF("INPUT YOUR NAME", "microsoft yahei", 36);
        labelInput.setPosition(width / 2, height / 2 + 100);
        labelInput.setColor(cc.color(255, 255, 255));
        layer.addChild(labelInput);

        var inputBg = new cc.Scale9Sprite('res/inputBg.png');
        var inputField = new cc.EditBox(cc.size(inputBg.width, inputBg.height), inputBg);
        inputField.setFontName('microsoft yahei');
        inputField.setFontSize(36);
        inputField.setMaxLength(10);
        inputField.setFontColor(cc.color(255, 255, 255));
        inputField.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        inputField.setPosition(width / 2, height / 2 + 15);
        layer.addChild(inputField);

        // block event
        var ok = MenuItem('确定', function () {
            var curUser = inputField.getString();
            if (curUser && curUser != '') {
                this.labelUser.setString('欢迎您, 指挥官' + curUser);
                this.menuUser.setLabel('切换用户');
                Storage.setCurrentUser(curUser);
            }
            this._toggleMenu(true);
            this.removeChild(layer);
        }, this);
        var cancel = MenuItem('取消', function () {
            this._toggleMenu(true);
            this.removeChild(layer);
        }, this);

        var menu = new cc.Menu(ok, cancel);
        menu.alignItemsHorizontallyWithPadding(20);
        menu.y = height / 2 - 100;
        layer.addChild(menu);
    },

    _toggleMenu: function (enable) {
        this.menu.setEnabled(enable);
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