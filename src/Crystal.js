
var Crystal = cc.Sprite.extend({

    type: 0,
    column: 0,
    row: 0,

    ctor: function (type, column, row) {
        this._super("res/gem_" + (type+1) + ".jpg");
        this.init(type, column, row);
    },

    init: function (type, column, row) {
        this.type = type;
        this.column = column;
        this.row = row;
    },

    stone: function () {
        // 快速, 随机地战栗, 颜色渐渐变灰, 透明度变淡, 最后变成石头图片
    },

    die: function () {
        // 消除时的动画, 变大到2倍, 逐渐透明, 最后注销
    },

    moveTo: function (x, y) {
        // 移动到某点
    }
});


Crystal.createRandomType = function (column, row) {
    return new Crystal(parseInt(Math.random()*Constant.CRYSTAL_TYPE_COUNT), column, row);
};