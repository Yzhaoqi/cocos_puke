var com = require('GameDefine');
var mediumZone = require('MediumZone');
var rightZone = require('RightZone');
var leftZone = require('LeftZone');
var hostZone = require('HostZone');
var gameLogic = require('GameLogic');
var ThenJs = require('../public/then');
var gameDisplay = require('GameDisplay');
var robot = require('Robot');

var control;
var seat = {
    medium : cc.Node,
    right : cc.Node,
    left : cc.Node,
    getSeat: function(num) {
        if (num == 0) return this.medium;
        if (num == 1) return this.right;
        return this.left;
    }
}
var avatar = [];
var pointToChoose = [0, 1, 2, 3];
var hostNum = -1;
var currentSeat = -1;
var pointForSeat = [0, 0, 0];
var orderSeat = [0, 0, 0];
var chooseSeat = 0;
var hasBeenPass = false;
var is_first = true;

var bgm;

cc.Class({
    extends: cc.Component,

    properties: {
        bgm: {
            url: cc.AudioClip,
            default: null
        }
    },

    // use this for initialization
    onLoad: function () {
        pointForSeat = [0, 0, 0];
        chooseSeat = 0;

        var self = this;
        control = self.node;
        seat.medium = self.node.getChildByName('HandCardMedium');
        seat.right = self.node.getChildByName('HandCardRight');
        seat.left = self.node.getChildByName('HandCardLeft');

        avatar[0] = self.node.getChildByName('MediumAvatar');
        avatar[1] = self.node.getChildByName('RightAvatar');
        avatar[2] = self.node.getChildByName('LeftAvatar');

        self.setEvent(self);

        gameDisplay.displayStartGameButton('button/game_start', self.node, self);
    },

    startGame: function() {
        var self = this;

        bgm = cc.audioEngine.play(this.bgm, true, 1);

        ThenJs((cont) => {self.initialCards(self, cont)})
        .then((cont, p) => {self.handCardLoad(p, cont)})
        .then((cont, p) => {self.chooseHost(p, cont)})
    },

    restartGame: function() {
        cc.audioEngine.stop(bgm);
        var self = this;
        cc.log(this);
        var children = control.children;
        for (var i = 0; i < children.length; i++) {
            children[i].removeAllChildren();
        }

        mediumZone.initial();
        leftZone.initial();
        rightZone.initial();
        hostZone.initial();
        gameLogic.initial();
        pointToChoose = [0, 1, 2, 3];
        hostNum = -1;
        currentSeat = -1;
        pointForSeat = [0, 0, 0];
        orderSeat = [0, 0, 0];
        chooseSeat = 0;
        hasBeenPass = false;
        is_first = true;

        gameDisplay.displayStartGameButton('button/game_start', self.node, self);
    },

    initialCards: function(self, callback) {
        var cardHeap = [];
        var randomArray = [];
        for (var i = 0; i < com.puke_card_nums; i++) {
            cardHeap[i] = i;
            randomArray[i] = Math.random();
        }
        cardHeap.sort(function(a, b) {return randomArray[a] - randomArray[b]});
        
        var mediumArray = cardHeap.splice(0, 17);
        var rightArray = cardHeap.splice(0, 17);
        var leftArray = cardHeap.splice(0, 17);
        var hostArray = cardHeap.splice(0, 3);

        mediumZone.setHandCards(mediumArray);
        rightZone.setHandCards(rightArray);
        leftZone.setHandCards(leftArray);
        hostZone.setHostCards(hostArray);

        callback(null, self);
    },

    handCardLoad: function(self, callback) {
        var node = self.node.getChildByName('HandCardMedium');
        var mediumHand = mediumZone.getHandCards();
        var mediumNum = mediumZone.getHandCardNum();
        for (var i = 0; i < mediumNum; i++) {
            gameDisplay.displayHandCard('puke_card/', mediumHand[i], mediumNum, i, node, self);
        }

        var rightNode = self.node.getChildByName('HandCardRight');
        var leftNode = self.node.getChildByName('HandCardLeft');
        gameDisplay.displayBackCard(rightNode);
        gameDisplay.displayCardNum(rightZone.getHandCardNum(), rightNode);
        gameDisplay.displayBackCard(leftNode);
        gameDisplay.displayCardNum(leftZone.getHandCardNum(), leftNode);

        var hostNode = self.node.getChildByName('HostPart');
        var hostCard = hostZone.getHostCards();
        var hostNum = hostZone.getHostCardNum();
        for (var i = 0; i < hostNum; i++) {
            gameDisplay.displayHostCard('puke_card/', hostCard[i], i, hostNode);
        }

        callback(null, self);
    },

    chooseHost: function(self, callback) {
        self.node.emit(com.START_SET_HOST);
        callback(null, self);
        // TODO : choose point for three seat
    },

    canPushCard: function(self) {
        if (currentSeat != 0) return;
        var childNode = self.node.getChildByName('HandCardMedium').children;
        var array = [];
        var j = 0;
        var handCard = mediumZone.getHandCards();
        for (var i = 0; i < childNode.length; ++i) {
            if (childNode[i].getPositionY() == 15) {
                array[j++] = handCard[i];
            }
        }
        gameLogic.setCurrentCard(array);
        if (gameLogic.isValid() && gameLogic.canPush()) {
            self.changePushButton(self, true);
        } else {
            self.changePushButton(self, false);
        }
    },

    mediumPickCardLoad: function(self) {
        var node = self.node.getChildByName('PickCardMedium');
        var pickCards = mediumZone.getPickCards();
        var num = mediumZone.getPickCardNum();
        var childNode = node.children;
        for (var i = 0; i < childNode.length; ++i) {
            childNode[i].destroy();
        }

        for (var i = 0; i < num; i++) {
            gameDisplay.displayPickCard('puke_card/', pickCards[i], num, i, node);
        }
    },

    changePushButton: function(self, is_valid) {
        var node = control.getChildByName('pick');
        if (node == null) return;
        let sp = node.getComponent(cc.Sprite);
        if (is_valid) {
            gameDisplay.changeDealButton('button/pick_on.png', sp);
            node.off(cc.Node.EventType.TOUCH_START, self.pushCard, self);
            node.on(cc.Node.EventType.TOUCH_START, self.pushCard, self);
        } else {
            gameDisplay.changeDealButton('button/pick_off.png', sp);
            node.off(cc.Node.EventType.TOUCH_START, self.pushCard, self);
        }
    },

    setEvent : function(self) {
        control.on(com.START_SET_HOST, self.startSetHost, self);
        control.on(com.ON_SELECT_NEXT, self.selectNext, self);
        control.on(com.MAIN_GAME_START, self.mainGameStart, self);
        control.on(com.ON_GAME_NEXT, self.gameNext, self);
        control.on(com.GAME_OVER, self.gameOver, self);
        for (var i = 0; i < 3; i++) {
            seat.getSeat(i).on(com.ON_SELECT_POINT, self.choosePoint, self);
            seat.getSeat(i).on(com.ON_NEXT_PUSH_CARD, self.nextPushCard, self);
        }
    },

    startSetHost : function() {
        var startNum = Math.floor(Math.random() * 3) % 3;
        seat.getSeat(startNum).emit(com.ON_SELECT_POINT, startNum);
    },

    selectNext : function(event) {
        var num = event.detail.num;
        var point = event.detail.point;
        pointForSeat[num] = point;

        var node;
        if (num == 0) node = control.getChildByName('PickCardMedium');
        else if (num == 1) node = control.getChildByName('PickCardRight');
        else node = control.getChildByName('PickCardLeft');

        gameDisplay.displayPointChoose(node, point);

        chooseSeat++;
        if (point == 3) {
            hostNum = num;
            control.emit(com.MAIN_GAME_START);
        } else if (chooseSeat == 3) {
            var max = pointForSeat[0];
            hostNum = 0;
            for (var i = 1; i < 3; i++) {
                if (pointForSeat[i] > max) {
                    max = pointForSeat[i];
                    hostNum = i;
                }
            }
            control.emit(com.MAIN_GAME_START);
        } else {
            for (var i = 0; i < pointToChoose.length; i++) {
                if (pointToChoose[i] == point) {
                    pointToChoose.splice(i, 1);
                    break;
                }
            }
            var next = (num + 1) % 3;
            seat.getSeat(next).emit(com.ON_SELECT_POINT, next);
        }
    },

    choosePoint : function(event) {
        var num = event.detail;
        var self = this;
        // medium choose point
        if (num == 0) {
            var node = new cc.Node('GetPoint');
            node.setPosition(0, 120);
            seat.medium.addChild(node);
            for (var i = 0; i < pointToChoose.length; i++) {
                gameDisplay.displayPointButton('button/', pointToChoose[i], pointToChoose.length, i, node, self);
            }
        } else {
            robot.selectPoint(num, pointToChoose, self);
        }
    },

    mediumGetPoint : function(event) {
        var point_choose = this.tag;
        control.emit(com.ON_SELECT_NEXT, {num: 0, point: point_choose});
        if (seat.medium.getChildByName('GetPoint') != null)
            seat.medium.getChildByName('GetPoint').destroy();
    },

    mainGameStart : function(event) {
        setTimeout(() => {
            control.getChildByName('PickCardRight').removeAllChildren();
            control.getChildByName('PickCardLeft').removeAllChildren();
            control.getChildByName('PickCardMedium').removeAllChildren();
            for (var i = 0; i < 3; i++) gameDisplay.setSkin(avatar[i], i == hostNum);
        }, 0);
        var self = this;
        var zone;
        if (hostNum == 0) zone = mediumZone;
        else if (hostNum == 1) zone = rightZone;
        else zone = leftZone;

        orderSeat[hostNum] = 0;
        var nextNum = (hostNum + 1) % 3;
        orderSeat[nextNum] = 1;
        nextNum = (nextNum + 1) % 3;
        orderSeat[nextNum] = 2;

        currentSeat = hostNum;

        zone.addHandCards(hostZone.getHostCards());
        if (zone == mediumZone) {
            seat.medium.removeAllChildren();

            var handCard = mediumZone.getHandCards();
            var num = mediumZone.getHandCardNum();
            for (var i = 0; i < num; i++) {
                gameDisplay.displayHandCard('puke_card/', handCard[i], num, i, seat.medium, self);
            }
            seat.medium.emit(com.ON_NEXT_PUSH_CARD);
        } else {
            var node = seat.getSeat(hostNum);
            gameDisplay.changeCardNum(zone.getHandCardNum(), node);
            node.emit(com.ON_NEXT_PUSH_CARD);
        }
    },

    nextPushCard : function(event) {
        var self = this;
        if (currentSeat == 0) {
            control.getChildByName('PickCardMedium').removeAllChildren();
            gameDisplay.showButton(control, 'button/pick_off', 'button/pass', is_first ,self);
        } else {
            var zone;
            if (currentSeat == 1) {
                control.getChildByName('PickCardRight').removeAllChildren();
                zone = rightZone;
            } else {
                control.getChildByName('PickCardLeft').removeAllChildren();
                zone = leftZone;
            }
            var last = (currentSeat + 2) % 3;
            var lastZone;
            if (last == 0) lastZone = mediumZone;
            else if (last == 1) lastZone = rightZone;
            else lastZone = leftZone;
            robot.pushCard(zone, hasBeenPass, orderSeat[currentSeat], lastZone.getHandCardNum(), gameLogic, gameDisplay, seat.getSeat(currentSeat), self);
        }
    },
        
    pushCard : function(event) {
        var self = this;
        var array = gameLogic.getCurrentCardArray();
        mediumZone.pickCards(array);
        var handCard = mediumZone.getHandCards();
        var num = mediumZone.getHandCardNum();

        var node = self.node.getChildByName('HandCardMedium');
        var childNode = node.children;
        for (var i = 0; i < childNode.length; ++i) {
            childNode[i].destroy();
        }

        for (var i = 0; i < num; i++) {
            gameDisplay.displayHandCard('puke_card/', handCard[i], num, i, node, self);
        }
        self.mediumPickCardLoad(self);
        gameDisplay.destroyButton(control);
        gameLogic.pushCards();

        self.hasPushCard();
        //self.changePushButton(self, false);
    },

    otherPushCard : function(zone, n){
        var node;
        var pickCards = zone.getPickCards();
        var num = zone.getPickCardNum();

        if (n == seat.left) node = control.getChildByName('PickCardLeft');
        else node = control.getChildByName('PickCardRight');

        var childNode = node.children;
        for (var i = 0; i < childNode.length; ++i) {
            childNode[i].destroy();
        }

        for (var i = 0; i < num; i++) {
            gameDisplay.displayPickCard('puke_card/', pickCards[i], num, i, node);
        }
    },

    hasPushCard : function() {
        hasBeenPass = false;
        is_first = false;
        control.emit(com.ON_GAME_NEXT);
    },

    passCard : function(event) {
        if (hasBeenPass) {
            gameLogic.reset();
            is_first = true;
            hasBeenPass = false;
        } else {
            hasBeenPass = true;
        }

        var node;
        if (currentSeat == 0) node = control.getChildByName('PickCardMedium');
        else if (currentSeat == 1) node = control.getChildByName('PickCardRight');
        else node = control.getChildByName('PickCardLeft');

        gameDisplay.displayPassLabel(node);
        if (currentSeat == 0) gameDisplay.destroyButton(control);
        control.emit(com.ON_GAME_NEXT);
    },

    gameNext : function(event) {
        var self = this;
        var zone;
        if (currentSeat == 0) zone = mediumZone;
        else if (currentSeat == 1) zone = rightZone;
        else zone = leftZone;

        if (zone.getHandCardNum() == 0) {
            control.emit(com.GAME_OVER);
        } else {
            currentSeat = (currentSeat + 1) % 3;
            seat.getSeat(currentSeat).emit(com.ON_NEXT_PUSH_CARD);
        }
    },

    gameOver : function(event) {
        var self = this;
        var text;
        if (currentSeat == 0 || (hostNum != 0 && hostNum != currentSeat)) {
            text = "You Win";
        } else {
            text = "You Lose";
        }
        gameDisplay.displayGameRestartButton('button/game_restart', self.node, self);
        control.getChildByName('HostPart').removeAllChildren();
        gameDisplay.displayResult(control.getChildByName('HostPart'), text);
        cc.log(currentSeat, 'win');
    }
});
