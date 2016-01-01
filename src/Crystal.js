var r = function (range, min) {
    if (range == undefined) {
        range = 1;
    }
    min = min || 0;

    return min + Math.random() * range;
};

var Crystal = cc.Sprite.extend({
    icon: null,

    type: 0,
    column: 0,
    row: 0,

    ctor: function (type, column, row) {
        this._super();
        this.icon = new cc.Sprite("res/gem_" + type + ".png");
        this.addChild(this.icon);
        this.init(type, column, row);
    },

    init: function (type, column, row) {
        this.type = type;
        this.column = column;
        this.row = row;
    },

    turnToStone: function () {
        if (this.type == Constant.CRYSTAL_STONE) {
            return;
        }

        // 快速, 随机地战栗, 颜色渐渐变灰, 透明度变淡, 最后变成石头图片
        this.scheduleOnce(function () {
            this.icon.stopAllActions();


            var crystalOut = cc.spawn(cc.fadeOut(0.1), cc.scaleTo(0.1, 0.2));
            var stoneCallback = new cc.CallFunc(function () {
                this.icon.setColor(cc.color(255,255,255));
                this.icon.setTexture('res/gem_stone.png');
                this.icon.setScale(1);
                this.type = Constant.CRYSTAL_STONE;
            }, this);
            var stoneIn = cc.fadeIn(0.1);
            this.icon.runAction(cc.sequence(crystalOut, stoneCallback, stoneIn));
        }, 5, this);

        const variance = 4;

        var move = cc.moveTo(0.02, r(variance), r(variance));
        var actionCallback = function () {};
        var callback = new cc.CallFunc(function () { actionCallback.apply(this) }, this);

        var dark = cc.tintTo(0.1, 63, 63, 63);
        var light = cc.tintTo(0.1, 255, 255, 255);
        this.icon.runAction(cc.repeatForever(cc.sequence(dark, light)));
        this.icon.runAction(cc.sequence(move, callback));
        actionCallback = function () {
            move = cc.moveTo(0.02, r(variance), r(variance));
            this.icon.runAction(cc.sequence(move, callback));
        }
    },

    die: function () {
        // 消除时的动画, 变大到2倍, 逐渐透明, 最后注销
        this.icon.stopAllActions();
        this.icon.x = 0;
        this.icon.y = 0;

        this.stopAllActions();
        var fade = cc.fadeOut(0.1);
        var scale = cc.scaleTo(0.1, 2);
        var spawn = cc.spawn(fade, scale);
        var callback = cc.callFunc(function () {
            this.removeChild(this.icon);
            this.removeFromParent(true);
        }, this);
        var sequence = cc.sequence(spawn, callback);
        this.runAction(sequence);
    },

    moveTo: function (x, y) {
        // 移动到某点
    }
});


Crystal.createRandomType = function (column, row) {
    if (Math.random() < 0.01) {
        return new Crystal(Constant.CRYSTAL_META, column, row);
    } else {
        return new Crystal(parseInt(Math.random()*Constant.CRYSTAL_TYPE_COUNT) + 1, column, row);
    }
};