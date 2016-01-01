function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var GameLayer = cc.Layer.extend({

    mapPanel:null,
    lightningPanel:null,
    gameUI:null,
    instructionUI:null,

    score:0,
    crystalCount: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        'meta': 0,
        'stone': 0
    },

    map:null,
    stone: null,

    moving:false,

    joinCrystals: [],
    headCrystal: null,

    _eventPointerDown: null,
    _eventPointerMove: null,
    _eventPointerUp: null,
    _eventTouchCancelled: null,
    _touching: false,

    blockStone: true,
    _timeStart: 0,
    timeLeft: 0,
    timeBonus: 0,

    ctor: function () {
        this._super();

        var size = cc.winSize;

        var bg = new cc.Sprite("res/bg.jpg");
        this.addChild(bg, 1);
        bg.x = size.width/2;
        bg.y = size.height/2;

        var clippingPanel = new cc.ClippingNode();
        this.addChild(clippingPanel, 2);
        this.mapPanel = new cc.Layer();
        this.mapPanel.x = (size.width - Constant.MAP_WIDTH)/2;
        this.mapPanel.y = (size.height - Constant.MAP_HEIGHT)/2;
        clippingPanel.addChild(this.mapPanel, 1);

        var stencil = new cc.DrawNode();
        stencil.drawRect(cc.p(this.mapPanel.x,this.mapPanel.y - Constant.CRYSTAL_WIDTH/2),
        		cc.p(this.mapPanel.x+Constant.MAP_WIDTH,
        				this.mapPanel.y+Constant.MAP_HEIGHT),
            cc.color(0,0,0), 1, cc.color(0,0,0));
        clippingPanel.stencil = stencil;

        this.lightningPanel = new cc.DrawNode();
        this.addChild(this.lightningPanel, 3);

        this.gameUI = new GameUI(this);
        this.addChild(this.gameUI, 4);

        return true;
    },

    _initListeners: function () {
        if("touches" in cc.sys.capabilities){
            this._eventPointerDown = {
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this._onTouchBegan.bind(this),
                onTouchMoved: this._onTouchMove.bind(this),
                onTouchEnded: this._onTouchEnd.bind(this),
                onTouchCancelled: this._onTouchEnd.bind(this)
            };
        } else {
            this._eventPointerDown = {
                event: cc.EventListener.MOUSE,
                onMouseDown: this._onMouseDown.bind(this),
                onMouseMove: this._onMouseMove.bind(this),
                onMouseUp: this._onMouseUp.bind(this)
            };

            //this._eventPointerMove = {
            //    event: cc.EventListener.MOUSE,
            //};
            //this._eventPointerUp = {
            //    event: cc.EventListener.MOUSE,
            //};
        }
    },

    init: function () {
        this.score = 0;
        this.crystalCount = {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            'meta': 0,
            'stone': 0
        };
        this.timeBonus = 0;
        this.lightningPanel.clear();

        this.mapPanel.removeAllChildren();
        this.map = [];
        for (var i = 0; i < Constant.MAP_COLS; i++) {
            var column = [];
            var rows = Constant.MAP_ROWS - (i % 2);
            for (var j = 0; j < rows; j++) {
                //var crystal = Crystal.createRandomType(i,j);
                //this.mapPanel.addChild(crystal);
                //crystal.x = i * Constant.CELL_SPACE + Constant.CELL_WIDTH / 2;
                //crystal.y = j * Constant.CELL_HEIGHT + (1 + i % 2) * Constant.CELL_HEIGHT / 2;
                //column.push(crystal);
                column.push(null);
            }
            this.map.push(column);
        }

        this.scheduleOnce(this._start, 0.5, this);
    },

    _start: function () {
        this._timeStart = new Date().getTime();
        this.timeLeft = Constant.TIME_LEFT_INIT * 1000;

        this._generateNewCrystal();

        this.scheduleOnce(function () {
            this.blockStone = false;
        }, Constant.TIME_STONE_SPAWN, this);
        this.scheduleUpdate();

        this._addListeners();
    },

    _addListeners: function () {
        this._initListeners();
        cc.eventManager.addListener(this._eventPointerDown, this.mapPanel);
    },

    _removeListeners: function () {
        cc.eventManager.removeAllListeners();
        //cc.eventManager.removeListeners(this.mapPanel);
    },

    _onTouchBegan: function (touch, event) {
        if (!this.mapPanel) {
            return;
        }
        this._touching = true;

        this._pointerDown(touch.getLocation().x, touch.getLocation().y);

        return true;
    },

    _onTouchMove: function (touch, event) {
        if (!this._touching) {
            return false;
        }
        this._pointerMove(touch.getLocation().x, touch.getLocation().y);

        return true;
    },

    _onTouchEnd: function (touch, event) {
        if (!this._touching) {
            return false;
        }

        this._pointerUp();
        this._touching = false;

        return true;
    },

    _onMouseDown: function (event) {
        if (!this.mapPanel) {
            return;
        }

        this._touching = true;

        this._pointerDown(event.getLocationX(), event.getLocationY());

        //this._initListeners();
        //cc.eventManager.addListener(this._eventPointerMove, this.mapPanel);
        //cc.eventManager.addListener(this._eventPointerUp, this.mapPanel);

        return true;
    },

    _onMouseMove: function (event) {
        if (!this._touching) {
            return false;
        }

        this._pointerMove(event.getLocationX(), event.getLocationY());

        return true;
    },

    _onMouseUp: function (event) {
        if (!this._touching) {
            return false;
        }

        //cc.eventManager.removeListener(this._eventPointerMove, this.mapPanel);
        //cc.eventManager.removeListener(this._eventPointerUp, this.mapPanel);

        this._pointerUp();

        this._touching = false;

        return true;
    },

    _pointerDown: function (screenX, screenY) {
        this.joinCrystals = [];
        this.headCrystal = null;

        this._pushCrystal(screenX, screenY);
    },

    _pointerMove: function (screenX, screenY) {
        this._pushCrystal(screenX, screenY);
    },

    _pointerUp: function () {
        this._removeJoined();
    },

    _pushCrystal: function (screenX, screenY) {
        var column = Math.floor((screenX - this.mapPanel.x) / Constant.CELL_SPACE);
        var row = Math.floor((screenY - this.mapPanel.y) / Constant.CELL_HEIGHT - 0.5 * (column % 2));

        if (!this._checkCrystalExist(column, row)) {
            return;
        }
        var crystal = this.map[column][row];

        // stone is ignored
        if (crystal.type == Constant.CRYSTAL_STONE) {
            return;
        }

        // find the first normal crystal
        if (this.headCrystal == null && crystal.type != Constant.CRYSTAL_META) {
            this.headCrystal = crystal;
        }

        var len = this.joinCrystals.length;
        if (len == 0) {
            this.joinCrystals.push(crystal);

            return;
        }

        // must be a neighbour
        var tail = this.joinCrystals[len - 1];
        if (!this._isNeighbour(tail, crystal)) {
            return;
        }

        var index = this.joinCrystals.indexOf(crystal);
        if (index >= 0 ) {
            // already in queue, roll back
            this.joinCrystals.splice(index + 1);
            this.lightningPanel.clear();
            this._drawLine(this.joinCrystals);
        } else if (crystal.type == Constant.CRYSTAL_META || this.headCrystal.type == crystal.type) {
            // add a new available crystal
            this.joinCrystals.push(crystal);

            this.lightningPanel.clear();
            this._drawLine(this.joinCrystals);
        }
    },

    _removeJoined: function () {
        this.lightningPanel.clear();

        var count = this.joinCrystals.length;
        if (count < 3) {
            return;
        }

        this.moving = true;
        var tryRemoveStone = this.stone && this.stone.type == Constant.CRYSTAL_STONE && count >= 4;
        var metaBonus = 0, stoneBonus = 1;

        var removeStone = function () {
            stoneBonus = Constant.STONE_BONUS_SCORE;

            if (this.crystalCount.hasOwnProperty(this.stone.type)) {
                this.crystalCount[this.stone.type]++;
            } else {
                this.crystalCount[this.stone.type] = 1;
            }

            var col = this.stone.column;
            var row = this.stone.row;
            this.map[col][row] = null;
            this.stone.die();
            this.stone = null;

            var dice = Math.random();
            if (dice < 0.3) {
                var meta = new Crystal(Constant.CRYSTAL_META, col, row);
                this.mapPanel.addChild(meta);
                meta.x = col * Constant.CELL_SPACE + Constant.CELL_WIDTH / 2;
                meta.y = row * Constant.CELL_HEIGHT + (1 + col % 2) * Constant.CELL_HEIGHT / 2;
                this.map[col][row] = meta;
            } else if (dice < 0.6) {
                this.timeBonus += Constant.STONE_BONUS_TIME;
                this.timeLeft += Constant.STONE_BONUS_TIME * 1000;
            }
        };

        var removeCrystal = function (crystal) {
            if (crystal.type == Constant.CRYSTAL_META) {
                metaBonus++;
            }

            if (tryRemoveStone && this._isNeighbour(this.stone, crystal)) {
                removeStone.apply(this);
            }

            // update statistic
            if (this.crystalCount.hasOwnProperty(crystal.type)) {
                this.crystalCount[crystal.type]++;
            } else {
                this.crystalCount[crystal.type] = 1;
            }

            this.map[crystal.column][crystal.row] = null;
            crystal.die();
            if (crystal == this.stone) {
                this.stone = null;
                stoneBonus = Constant.STONE_BONUS_SCORE * 1.5;
            }
        };

        if (this.joinCrystals.forEach) {
            this.joinCrystals.forEach(function (crystal) {
                removeCrystal.apply(this, [crystal]);
            }.bind(this))
        } else {
            for (var i = 0; i < this.joinCrystals.length; i++) {
                removeCrystal.apply(this, [this.joinCrystals[i]]);
            }
        }

        this.score += Math.floor(count * count * (1 + metaBonus * 0.5) * stoneBonus);

        this._generateNewCrystal();
    },

    _checkCrystalExist: function(col, row){
        if(col >= 0 && col < Constant.MAP_COLS &&
            row >= 0 && row < Constant.MAP_ROWS - (col % 2) &&
            this.map && this.map[col][row]){
            return true;
        }
        return false;
    },

    _isNeighbour: function (a, b) {
        if (!a || !b) {
            return false;
        }

        var distSqr = (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
        return distSqr < Constant.CELL_HEIGHT * Constant.CELL_HEIGHT + 1
    },

    _generateNewCrystal: function () {
        var maxTime = 0;
        for (var col = 0; col < Constant.MAP_COLS; col++) {
            var missCount = 0;
            for (var row = 0; row < this.map[col].length; row++) {

                var crystal = this.map[col][row];
                if(!crystal){
                    var crystal = Crystal.createRandomType(col, Constant.MAP_ROWS - (col % 2) + missCount);
                    this.mapPanel.addChild(crystal);
                    crystal.x = crystal.column * Constant.CELL_SPACE + Constant.CELL_WIDTH / 2;
                    crystal.y = crystal.row * Constant.CELL_HEIGHT + (1 + crystal.column % 2) * Constant.CELL_HEIGHT / 2;
                    this.map[col][crystal.row] = crystal;
                    missCount++;
                }else{
                    var fallLength = missCount;
                    if(fallLength > 0){
                        var duration = Math.sqrt(2 * fallLength / Constant.FALL_ACCELERATION);
                        if(duration > maxTime)
                            maxTime = duration;
                        var move = cc.moveTo(duration, crystal.x, crystal.y-Constant.CELL_HEIGHT * fallLength).easing(cc.easeIn(2));    //easeIn参数是幂，以几次幂加速
                        crystal.runAction(move);
                        crystal.row -= fallLength;        //adjust all crystal's row
                        this.map[col][row] = null;
                        this.map[col][crystal.row] = crystal;
                    }
                }
            }

            //移除超出地图的临时元素位置
            for (var j = this.map[col].length; j >= Constant.MAP_ROWS - (col % 2); j--) {
                this.map[col].splice(j, 1);
            }
        }
        this.scheduleOnce(this._finishCrystalFalls.bind(this), maxTime);

    },

    _finishCrystalFalls: function () {
        this.moving = false;
    },

    _popStone: function () {
        if (this.stone) {
            return;
        }

        var col = Math.floor(Math.random() * this.map.length);
        var column = this.map[col];
        var row = Math.floor(Math.random() * column.length);
        this.stone = column[row];
        this.stone.turnToStone();
    },

    _drawLine: function (path) {
        var len = path.length || 0;
        var start = path[0];
        for (var i = 1; i < len; i++) {
            var end = path[i];
            var offset = cc.p(10, Constant.MAP_HEIGHT / 2 - Constant.CELL_HEIGHT / 2 - 10);
            this.lightningPanel.drawSegment(cc.pAdd(start.getPosition(), offset),
                cc.pAdd(end.getPosition(), offset), 4, cc.color(127, 255, 255, 127));
            start = end;
        }
    },

    update : function() {
        this._super();

        if (!this.blockStone) {
            this._popStone();
        }

        var curTime = new Date().getTime();
        this.timeLeft -= curTime - this._timeStart;
        this._timeStart = curTime;
        if (this.timeLeft <= 0) {
            this._removeListeners();
            this.unscheduleUpdate();
            Storage.pushToScoreboard(Storage.getCurrentUser(), this.score);
            this.gameUI.showResult();
        }
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);

        layer.init();
    }
});



