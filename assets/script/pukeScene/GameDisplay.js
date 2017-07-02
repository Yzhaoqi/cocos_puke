var com = require('GameDefine');

var temp_button_path = "";

exports.displayStartGameButton = (file, parentNode, self) => {
    cc.loader.loadRes(file, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('startGame');
        node.setPosition(0, 0);
        node.on(cc.Node.EventType.TOUCH_START, function(event){
            self.startGame();
            node.destroy();
        }, node);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(node);
    });
}

exports.displayGameRestartButton = (file, parentNode, self) => {
    cc.loader.loadRes(file, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('restartGame');
        node.setPosition(0, 0);
        node.on(cc.Node.EventType.TOUCH_START, function(event){
            self.restartGame();
            node.destroy();
        }, node);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(node);
    });
}

exports.displayPointChoose = (parentNode, point) => {
    var node = new cc.Node('Label');
    var txt = node.addComponent(cc.Label);
    txt.string = point + '分';
    txt.fontSize = 30;
    parentNode.addChild(node);
}

exports.displayHandCard = (path, cardVal, num, position, parentNode, self) => {
    var distance = (num-1)*10;
    cc.loader.loadRes(path + cardVal, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('card' + cardVal);
        node.setPosition(position*20-distance, -15);
        node.setLocalZOrder(position);
        node.on(cc.Node.EventType.TOUCH_START, function(event){
            if(node.getPositionY() == -15) {
                node.setPosition(position*20-distance, 15);
            } else {
                node.setPosition(position*20-distance, -15);
            }
            self.canPushCard(self);
        }, node);
        node.on(com.GAME_OUTPUT_CARD, function(event) {              
            cc.log(node.getLocalZOrder());
        }, node);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(node);
    });
}

exports.displayPickCard = (path, cardVal, num, position, parentNode) => {
    var distance = (num-1)*10;
    cc.loader.loadRes(path + cardVal, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('card' + cardVal);
        node.setPosition(position*20-distance, 0);
        node.setLocalZOrder(position);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(node);
    });
}

exports.displayPassLabel = (parentNode) => {
    cc.loader.loadRes('font/font', function(error, res) {
        if( error ) { 
            cc.log( 'Error: ' + error ); 
            return; 
        }
        var node = new cc.Node('Label');
        var txt = node.addComponent(cc.Label);
        txt.font = res;
        txt.string = "Pass";
        txt.fontSize = 30;
        parentNode.addChild(node);
    });
}

exports.displayHostCard = (path, cardVal, position, parentNode) => {
    var distance = 105;
    cc.loader.loadRes(path + cardVal, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('card' + cardVal);
        node.setPosition((position-1)*distance, 0);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(node);
    });
}

exports.showButton = (parentNode, pickPath, passPath, showpass, self) => {  
    cc.loader.loadRes(pickPath, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var pick = new cc.Node('pick');
        pick.setPosition(-80, -80);
        let spriteComponent = pick.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(pick);
        self.canPushCard(self);
    });
    if (showpass) return;
    cc.loader.loadRes(passPath, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var pass = new cc.Node('pass');
        pass.setPosition(80, -80);
        let spriteComponent = pass.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;

        pass.on(cc.Node.EventType.TOUCH_START, self.passCard, self);
        
        parentNode.addChild(pass);
    });
}

exports.destroyButton = (parentNode) => {
    var pick = parentNode.getChildByName('pick');
    var pass = parentNode.getChildByName('pass');
    if (pick != null) pick.destroy();
    if (pass != null) pass.destroy();
}

exports.changeDealButton = (resFile, sprite) => {
    if (temp_button_path == resFile) return;
    temp_button_path = resFile;
    cc.loader.loadRes(resFile, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        sprite.spriteFrame = spriteFrame;
    })
}

exports.displayBackCard = (parentNode) => {
    cc.loader.loadRes('puke_card/back.png', cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('backCard');
        node.setPosition(0, 0);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;
        
        parentNode.addChild(node);
    });
}

exports.displayCardNum = (num, parentNode) => {
    var node = new cc.Node('cardNum');
    node.setPosition(0, 90);

    let textLabel = node.addComponent(cc.Label);
    textLabel.string = "" + num;
    textLabel.fontSize = 20;

    parentNode.addChild(node);
}

exports.changeCardNum = (num, parentNode) => {
    var node = parentNode.getChildByName('cardNum');
    let textLabel = node.getComponent(cc.Label)
    textLabel.string = "" + num;
}

exports.displayPointButton = (path, pointVal, num, position, parentNode, self) => {
    var distance = (num - 1) * 55;
    cc.loader.loadRes(path + 'point_' +  pointVal, cc.SpriteFrame, function(err, spriteFrame) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        var node = new cc.Node('point' + pointVal);
        node.tag = pointVal;
        node.setPosition(position*110-distance, 0);
        let spriteComponent = node.addComponent(cc.Sprite);
        spriteComponent.spriteFrame = spriteFrame;

        node.on(cc.Node.EventType.TOUCH_START, self.mediumGetPoint, node);

        parentNode.addChild(node);
    });
}

exports.displayResult = (parentNode, text) => {
    cc.loader.loadRes('font/font', function(error, res) {
        if( error ) { 
            cc.log( 'Error: ' + error ); 
            return; 
        }
        var node = new cc.Node('Label');
        node.setContentSize(200, 300);
        var txt = node.addComponent(cc.Label);
        txt.font = res;
        txt.string = text;
        txt.fontSize = 36;
        parentNode.addChild(node);
    });
}