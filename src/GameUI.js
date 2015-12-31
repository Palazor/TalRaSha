
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

        var leftTimeLabel = new cc.LabelTTF("TIME LEFT", "arial", 36, undefined, cc.TEXT_ALIGNMENT_LEFT);
        leftTimeLabel.setAnchorPoint(0, 1);
        leftTimeLabel.x = margin;
        leftTimeLabel.y = scoreLabel.y - scoreLabel.height - 10;
        leftTimeLabel.setColor(cc.color(255, 255, 255));
        this.addChild(leftTimeLabel);

        var leftTimeText = new cc.LabelTTF("0", "arial", 36, undefined, cc.TEXT_ALIGNMENT_RIGHT);
        leftTimeText.setAnchorPoint(1, 1);
        leftTimeText.x = size.width - margin;
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
        var bg = new cc.LayerColor(cc.color(255,255,255),500,500);
        this.addChild(bg, 1);
        var size = cc.director.getWinSize();
        bg.x = (size.width - bg.width)/2;
        bg.y = (size.height - bg.height)/2;
        var text = new cc.LabelTTF("Score:" + (this.gameLayer.score), "arial", 50);
        text.setColor(cc.color(0,0,0));
        text.x = 250;
        text.y = 250;
        bg.addChild(text);
    },

    update: function () {
        this.scoreText.setString("" + this.gameLayer.score);
        this.leftTimeText.setString("" + Math.round(this.gameLayer.timeLeft / 1000));

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

    showFinalScore: function () {

    }

});


