/**
 * Created by Razor <renze1983@163.com> on 2015/12/30.
 * 一个排行榜, 包括{用户名, 积分, 时间}
 */

var ScoreboardLayer = cc.Layer.extend({
    scoreData: null,
    centerX: 0,
    centerY: 0,

    colorList: [],

    labelList: [],

    ctor: function () {
        this._super();

        this.scoreData = Storage.getScoreboard();

        this.centerX = cc.visibleRect.center.x;
        this.centerY = cc.visibleRect.center.y;

        var bg = new cc.Sprite(preLoadBg);
        bg.setPosition(this.centerX, this.centerY);
        this.addChild(bg);

        this.colorList = [cc.color(237, 198,99), cc.color(193, 204, 213), cc.color(64, 200, 127)];
    },
    
    showScoreboard: function () {
        var scores = this.scoreData;

        var len = scores.length;
        var posY = cc.winSize.height / 2 + len * 25;
        var maxColorIndex = this.colorList.length - 1;
        this.labelList = [];
        for (var index = 0; index < len; index++) {
            var record = scores[index];
            var textColor = cc.color(this.colorList[Math.min(maxColorIndex, index)]);

            var score = new cc.LabelTTF(record['score'], "microsoft yahei", 36, undefined, cc.TEXT_ALIGNMENT_RIGHT);
            score.setAnchorPoint(1, 0.5);
            score.setColor(textColor);
            score.setPosition(this.centerX - 50, posY);
            this.addChild(score);
            this.labelList.push(score);

            var user = new cc.LabelTTF(record['user'], "microsoft yahei", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
            user.setAnchorPoint(0, 0.5);
            user.setColor(textColor);
            user.setPosition(this.centerX + 50, posY);
            this.addChild(user);
            this.labelList.push(user);

            posY -= 50;
        }

        var menu = new cc.Menu(MenuItem('主菜单', function () {
            var len = this.labelList.length;
            for (var index = 0; index < len; index++) {
                this.removeChild(this.labelList[index]);
            }
            cc.director.runScene(new cc.TransitionFade(0.5, menuScene));
            return true;
        }, this));
        menu.y = posY - 50;
        this.addChild(menu);
    }
});

var ScoreboardScene = cc.Scene.extend({
    board: null,

    ctor:function () {
        this._super();

        this.board = new ScoreboardLayer();
        this.addChild(this.board);
    },

    onEnter:function () {
        this._super();

        this.board.showScoreboard();
    },

    onExit:function () {

    }
});