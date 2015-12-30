function trace(){
    cc.log(Array.prototype.join.call(arguments, ", "));
}

var GameLayer = cc.Layer.extend({

    mapPanel:null,
    ui:null,

    score:0,
    map:null,

    moving:false,

    joinCrystals: [],
    headCrystal: null,

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
        
        //this.addChild(this.mapPanel,2);

        if("touches" in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this._onTouchBegan.bind(this)
            }, this.mapPanel);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this._onMouseDown.bind(this)
            }, this.mapPanel);
        }

        this._init();

        this.ui = new GameUI(this);
        this.addChild(this.ui, 3);

        return true;
    },

    _init: function () {
        this.score = Storage.getCurrentScore();
        
        this.map = [];
        for (var i = 0; i < Constant.MAP_COLS; i++) {
            var column = [];
            var rows = Constant.MAP_ROWS - (i % 2);
            for (var j = 0; j < rows; j++) {
                var crystal = Crystal.createRandomType(i,j);
                this.mapPanel.addChild(crystal);
                crystal.x = i * Constant.CELL_SPACE + Constant.CELL_WIDTH / 2;
                crystal.y = j * Constant.CELL_HEIGHT + (1 + i % 2) * Constant.CELL_HEIGHT / 2;
                column.push(crystal);
            }
            this.map.push(column);
        }
    },

    _onTouchBegan: function (touch, event) {
        this._pointerDown(touch.getLocation().x, touch.getLocation().y);
    },

    _onMouseDown: function (event) {
        this._pointerDown(event.getLocationX(), event.getLocationY());

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: this._onMouseMove.bind(this)
        }, this.mapPanel);
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseUp: this._onMouseUp.bind(this)
        }, this.mapPanel);
    },

    _onMouseMove: function (event) {
        this._pointerMove(event.getLocationX(), event.getLocationY());
    },

    _onMouseUp: function (event) {
        cc.eventManager.removeListener({
            event: cc.EventListener.MOUSE,
            onMouseMove: this._onMouseMove.bind(this)
        }, this.mapPanel);
        cc.eventManager.removeListener({
            event: cc.EventListener.MOUSE,
            onMouseUp: this._onMouseUp.bind(this)
        }, this.mapPanel);

        this._pointerUp();
    },

    _pointerDown: function (screenX, screenY) {
        this.joinCrystals = [];
        headCrystal = null;

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
        if (crystal.type == Constant.CRYSTAL_STONE) {
            return;
        }

        if (this.joinCrystals.length == 0) {
            this.joinCrystals.push(crystal);

            if (crystal.type != Constant.CRYSTAL_META) {
                this.headCrystal = crystal;
            }

            return;
        }

        if (this.joinCrystals.indexOf(crystal) < 0 && this.headCrystal.type == crystal.type) {
            this.joinCrystals.push(crystal);
            // draw line
        }

        return;
    },

    _removeJoined: function () {
        if (this.joinCrystals.length == 0) {
            return;
        }

        this.moving = true;

        for (var i = 0; i < this.joinCrystals.length; i++) {
            var crystal = this.joinCrystals[i];
            this.mapPanel.removeChild(crystal);
            this.map[crystal.column][crystal.row] = null;
        }

        this.score += this.joinCrystals.length*joinCrystals.length;
    },

    _popCrystal: function (column, row) {
        if(this.moving)
            return;

        var joinCrystals = [this.map[column][row]];
        var index = 0;
        var pushIntoCrystals = function(element){
            if(joinCrystals.indexOf(element) < 0)
                joinCrystals.push(element);
        };
        while(index < joinCrystals.length){
            var crystal = joinCrystals[index];
            if(this._checkCrystalExist(crystal.column-1, crystal.row) && 
            		this.map[crystal.column-1][crystal.row].type == crystal.type){
                pushIntoCrystals(this.map[crystal.column-1][crystal.row]);
            }
            if(this._checkCrystalExist(crystal.column+1, crystal.row) && 
            		this.map[crystal.column+1][crystal.row].type == crystal.type){
                pushIntoCrystals(this.map[crystal.column+1][crystal.row]);
            }
            if(this._checkCrystalExist(crystal.column, crystal.row-1) && 
            		this.map[crystal.column][crystal.row-1].type == crystal.type){
                pushIntoCrystals(this.map[crystal.column][crystal.row-1]);
            }
            if(this._checkCrystalExist(crystal.column, crystal.row+1) && 
            		this.map[crystal.column][crystal.row+1].type == crystal.type){
                pushIntoCrystals(this.map[crystal.column][crystal.row+1]);
            }
            index++;
        }

        if(joinCrystals.length <= 1)
            return;
        
        this.steps++;
        this.moving = true;

        for (var i = 0; i < joinCrystals.length; i++) {
            var crystal = joinCrystals[i];
            this.mapPanel.removeChild(crystal);
            this.map[crystal.column][crystal.row] = null;
        }

        this.score += joinCrystals.length*joinCrystals.length;
        this._generateNewCrystal();
        this._checkSucceedOrFail();
    },

    _checkCrystalExist: function(col, row){
        if(col >= 0 && col < Constant.MAP_COLS &&
            row >= 0 && row < Constant.MAP_ROWS - (col % 2) &&
            this.map && this.map[col][row]){
            return true;
        }
        return false;
    },

    _generateNewCrystal: function () {
        var maxTime = 0;
        for (var i = 0; i < Constant.MAP_SIZE; i++) {        //deal each column
            var missCount = 0;
            for (var j = 0; j < this.map[i].length; j++) {

                var crystal = this.map[i][j];
                if(!crystal){
                    var crystal = Crystal.createRandomType(i,Constant.MAP_SIZE+missCount);
                    this.mapPanel.addChild(crystal);
                    crystal.x = crystal.column * Constant.CRYSTAL_WIDTH + Constant.CRYSTAL_WIDTH/2;
                    crystal.y = crystal.row * Constant.CRYSTAL_WIDTH + Constant.CRYSTAL_WIDTH/2;
                    this.map[i][crystal.row] = crystal;
                    missCount++;
                }else{
                    var fallLength = missCount;
                    if(fallLength > 0){
                        var duration = Math.sqrt(2*fallLength/Constant.FALL_ACCELERATION);
                        if(duration > maxTime)
                            maxTime = duration;
                        var move = cc.moveTo(duration, crystal.x, 
                        		crystal.y-Constant.CRYSTAL_WIDTH*fallLength).
                        		easing(cc.easeIn(2));    //easeIn参数是幂，以几次幂加速
                        crystal.runAction(move);
                        crystal.row -= fallLength;        //adjust all crystal's row
                        this.map[i][j] = null;
                        this.map[i][crystal.row] = crystal;
                    }
                }
            }

            //移除超出地图的临时元素位置
            for (var j = this.map[i].length; j >= Constant.MAP_SIZE; j--) {
                this.map[i].splice(j, 1);
            }
        }
        this.scheduleOnce(this._finishCrystalFalls.bind(this), maxTime);

    },

    _finishCrystalFalls: function () {
        this.moving = false;
    },

    _checkSucceedOrFail: function () {
        if(this.score > this.targetScore){
            this.ui.showSuccess();
            this.score += (this.limitStep - this.steps) * 30;
            Storage.setCurrentLevel(this.level+1);
            Storage.setCurrentScore(this.score);
            this.scheduleOnce(function(){
                cc.director.runScene(new GameScene());
            }, 3);
        }else if(this.steps >= this.limitStep){
            this.ui.showFail();
            Storage.setCurrentLevel(0);
            Storage.setCurrentScore(0);
            this.scheduleOnce(function(){
                cc.director.runScene(new GameScene());
            }, 3);
        }
    }

});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});



