
var GameUI = cc.Layer.extend({

    scoreText:null,
    leftTimeText:null,

    count1Text:null,
    count2Text:null,
    count3Text:null,
    count4Text:null,
    count5Text:null,
    countMetaText:null,

    gameLayer:null,

    leftTimeFill: null,

    ctor: function (gameLayer) {
        this._super();
        this.gameLayer = gameLayer;
        this._initInfoPanel();
        this.scheduleUpdate();
    },

    _initInfoPanel: function () {
        const margin = 80;

        var size = cc.director.getWinSize();

        var scoreLabel = new cc.LabelTTF("SCORE", "arial", 48, undefined, cc.TEXT_ALIGNMENT_LEFT);
        scoreLabel.setAnchorPoint(0, 1);
        scoreLabel.x = margin;
        scoreLabel.y = size.height - 30;
        scoreLabel.setColor(cc.color(255, 255, 255));
        this.addChild(scoreLabel);

        var scoreText = new cc.LabelTTF("0", "arial", 48, undefined, cc.TEXT_ALIGNMENT_RIGHT);
        scoreText.setAnchorPoint(1, 1);
        scoreText.x = size.width - margin;
        scoreText.y = scoreLabel.y;
        scoreText.setColor(cc.color(255, 255, 255));
        this.addChild(scoreText);
        this.scoreText = scoreText;

        var leftTimeFill = new cc.Sprite('res/timeBarFill.png');
        leftTimeFill.setAnchorPoint(0, 1);
        leftTimeFill.x = size.width - margin - 345;
        leftTimeFill.y = scoreLabel.y - scoreLabel.height - 19;
        this.addChild(leftTimeFill);
        this.leftTimeFill = leftTimeFill;

        var leftTimeMask = new cc.Sprite('res/timeBar.png');
        leftTimeMask.setAnchorPoint(1, 1);
        leftTimeMask.setPosition(size.width - margin, scoreLabel.y - scoreLabel.height - 16);
        this.addChild(leftTimeMask);

        var leftTimeLabel = new cc.LabelTTF("TIME LEFT", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        leftTimeLabel.setAnchorPoint(0, 1);
        leftTimeLabel.x = margin;
        leftTimeLabel.y = scoreLabel.y - scoreLabel.height - 10;
        leftTimeLabel.setColor(cc.color(255, 255, 255));
        this.addChild(leftTimeLabel);

        var leftTimeText = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_RIGHT);
        leftTimeText.setAnchorPoint(0.5, 1);
        leftTimeText.x = leftTimeFill.x + 165;
        leftTimeText.y = leftTimeLabel.y;
        leftTimeText.setColor(cc.color(255, 255, 255));
        this.addChild(leftTimeText);
        this.leftTimeText = leftTimeText;

        const iconWidth = 60;
        var crystal1 = new cc.Sprite('res/gem_1.png');
        crystal1.x = margin + crystal1.width / 2;
        crystal1.y = 150;
        crystal1.setScale(0.7);
        this.addChild(crystal1);

        var count1Text = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        count1Text.setAnchorPoint(0, 0.5);
        count1Text.x = margin + iconWidth;
        count1Text.y = crystal1.y;
        count1Text.setColor(cc.color(255, 255, 255));
        this.addChild(count1Text);
        this.count1Text = count1Text;

        var crystal2 = new cc.Sprite('res/gem_2.png');
        crystal2.x = crystal1.x + 190;
        crystal2.y = crystal1.y;
        crystal2.setScale(0.7);
        this.addChild(crystal2);

        var count2Text = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        count2Text.setAnchorPoint(0, 0.5);
        count2Text.x = count1Text.x + 190;
        count2Text.y = crystal1.y;
        count2Text.setColor(cc.color(255, 255, 255));
        this.addChild(count2Text);
        this.count2Text = count2Text;

        var crystal3 = new cc.Sprite('res/gem_3.png');
        crystal3.x = crystal2.x + 190;
        crystal3.y = crystal1.y;
        crystal3.setScale(0.7);
        this.addChild(crystal3);

        var count3Text = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        count3Text.setAnchorPoint(0, 0.5);
        count3Text.x = count2Text.x + 190;
        count3Text.y = crystal1.y;
        count3Text.setColor(cc.color(255, 255, 255));
        this.addChild(count3Text);
        this.count3Text = count3Text;

        var crystal4 = new cc.Sprite('res/gem_4.png');
        crystal4.x = margin + crystal4.width / 2;
        crystal4.y = 100;
        crystal4.setScale(0.7);
        this.addChild(crystal4);

        var count4Text = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        count4Text.setAnchorPoint(0, 0.5);
        count4Text.x = margin + iconWidth;
        count4Text.y = crystal4.y;
        count4Text.setColor(cc.color(255, 255, 255));
        this.addChild(count4Text);
        this.count4Text = count4Text;

        var crystal5 = new cc.Sprite('res/gem_5.png');
        crystal5.x = crystal4.x + 190;
        crystal5.y = crystal4.y;
        crystal5.setScale(0.7);
        this.addChild(crystal5);

        var count5Text = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        count5Text.setAnchorPoint(0, 0.5);
        count5Text.x = count4Text.x + 190;
        count5Text.y = crystal4.y;
        count5Text.setColor(cc.color(255, 255, 255));
        this.addChild(count5Text);
        this.count5Text = count5Text;

        var crystalMeta = new cc.Sprite('res/gem_meta.png');
        crystalMeta.x = crystal5.x + 190;
        crystalMeta.y = crystal4.y;
        crystalMeta.setScale(0.7);
        this.addChild(crystalMeta);

        var countMetaText = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        countMetaText.setAnchorPoint(0, 0.5);
        countMetaText.x = count5Text.x + 190;
        countMetaText.y = crystal4.y;
        countMetaText.setColor(cc.color(255, 255, 255));
        this.addChild(countMetaText);
        this.countMetaText = countMetaText;
    },

    showResult: function () {
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 196), width, height);
        this.addChild(layer);

        var textColor = cc.color(255, 255, 255);
        var centerX = width / 2;
        var posY = height / 2 + 350;

        // total sore
        var labelScore = new cc.LabelTTF('总分', "microsoft yahei", 56, undefined, cc.TEXT_ALIGNMENT_RIGHT);
        labelScore.setAnchorPoint(1, 0.5);
        labelScore.setColor(textColor);
        labelScore.setPosition(centerX - 50, posY);
        layer.addChild(labelScore);

        var textScore = new cc.LabelTTF(this.gameLayer.score + "", "microsoft yahei", 56, undefined, cc.TEXT_ALIGNMENT_LEFT);
        textScore.setAnchorPoint(0, 0.5);
        textScore.setColor(textColor);
        textScore.setPosition(centerX + 50, posY);
        layer.addChild(textScore);

        posY -= 70;

        // time bonus
        var labelTime = new cc.LabelTTF('奖励时间', "microsoft yahei", 56, undefined, cc.TEXT_ALIGNMENT_RIGHT);
        labelTime.setAnchorPoint(1, 0.5);
        labelTime.setColor(textColor);
        labelTime.setPosition(centerX - 50, posY);
        layer.addChild(labelTime);

        var textTime = new cc.LabelTTF(this.gameLayer.timeBonus + "", "microsoft yahei", 56, undefined, cc.TEXT_ALIGNMENT_LEFT);
        textTime.setAnchorPoint(0, 0.5);
        textTime.setColor(textColor);
        textTime.setPosition(centerX + 50, posY);
        layer.addChild(textTime);

        posY -= 70;

        var types = [];
        for (var index = 0; index < Constant.CRYSTAL_TYPE_COUNT; index++) {
            types.push((index + 1) + "");
        }
        types.push(Constant.CRYSTAL_META, Constant.CRYSTAL_STONE);
        var len = types.length;
        for (index = 0; index < len; index++) {
            var type = types[index];

            var crystal = new cc.Sprite("res/gem_" + type + ".png");
            crystal.setAnchorPoint(1, 0.5);
            crystal.setPosition(centerX - 50, posY);
            layer.addChild(crystal);

            var textCount = new cc.LabelTTF(this.gameLayer.crystalCount[type] + "", "microsoft yahei", 56, undefined, cc.TEXT_ALIGNMENT_LEFT);
            textCount.setAnchorPoint(0, 0.5);
            textCount.setColor(textColor);
            textCount.setPosition(centerX + 50, posY);
            layer.addChild(textCount);

            posY -= 70;
        }

        var home = MenuItem('主菜单', function () {
            cc.director.runScene(new cc.TransitionFade(0.5, menuScene));
            return true;
        }, this);
        var again = MenuItem('重来', function () {
            this.removeChild(layer);
            this.gameLayer.init();
            return true;
        }, this);
        var scoreboard = MenuItem('排行榜', function () {
            cc.director.runScene(new cc.TransitionFade(0.5, scoreboardScene));
            return true;
        }, this);
        var menu = new cc.Menu(home, again, scoreboard);
        menu.alignItemsHorizontallyWithPadding(10);
        menu.y = posY - 50;
        layer.addChild(menu);
    },

    update: function () {
        this.scoreText.setString("" + this.gameLayer.score);
        this.leftTimeText.setString("" + Math.round(this.gameLayer.timeLeft / 1000));
        this.leftTimeFill.scaleX = this.gameLayer.timeLeft / 1000 / Constant.TIME_LEFT_INIT;

        this.count1Text.setString("" + this.gameLayer.crystalCount['1']);
        this.count2Text.setString("" + this.gameLayer.crystalCount['2']);
        this.count3Text.setString("" + this.gameLayer.crystalCount['3']);
        this.count4Text.setString("" + this.gameLayer.crystalCount['4']);
        this.count5Text.setString("" + this.gameLayer.crystalCount['5']);
        this.countMetaText.setString("" + this.gameLayer.crystalCount[Constant.CRYSTAL_META]);
    },

    drawLine: function (path, color) {
        // TODO: 从头至尾连接水晶的一条线 颜色跟水晶颜色一直, 略微加深颜色
    },

    clearLine: function () {

    },

    showFinalScore: function () {

    }

});


