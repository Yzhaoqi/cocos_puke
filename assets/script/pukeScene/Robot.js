var com = require('GameDefine');

// 选择分值
exports.selectPoint = (seat, pointToChoose, self) => {
    setTimeout(()=>{
        self.node.emit(com.ON_SELECT_NEXT, {num: seat, point: pointToChoose[0]});
    }, 200);
}

exports.pushCard = (zone, gameLogic, gameDisplay, node, self) => {
    setTimeout(() => {
        var array = getPushCard(zone, gameLogic);

        if (array.length != 0) {
            gameLogic.setCurrentCard(array);
            gameLogic.pushCards();
            zone.pickCards(array);
            gameDisplay.changeCardNum(zone.getHandCardNum(), node);
            self.otherPushCard(zone, node);
            self.hasPushCard();
        } else {
            self.passCard();
        }  
    }, 200);
}


/**
 * TODO ：先考虑一个最简单的跟牌AI
 * 根据上家出的牌出手中最小的符合相应类型的牌
 * zone ：牌区， 相关可调用的方法（可参考MediumZone.js）
 *              zone.getHandCardNum()返回自己手牌的数量
 *              zone.getHandCards()返回自己的手牌数组
 * gameLogic ：游戏逻辑，存放游戏相关的信息（可参考GameLogic.js）
 *              gameLogic.getLastCard() 返回以下对象：
 *                  {type：上家出牌的类型， num：上家出牌的数量，value：上家出牌的值} type参见GameDefine中的定义。
 *              gameLogic.getValue(cardVal) 返回一张卡的值
 */
var getPushCard = function(zone, gameLogic) {
    var currentCard = zone.getHandCards();
    var num = zone.getHandCardNum();
    var last = gameLogic.getLastCards();

    var array = [], currentCardValue = []; // currentCardValue
    for (var i = 0; i < num; i++) {
        currentCardValue[i] = gameLogic.getValue(currentCard[i]);
    }
    switch(last.type) {
        case com.TYPE_NOT_VALID: case com.TYPE_SINGLE:
            for (var i = 0; i < num; i++) {
                if (currentCardValue[i] > last.value) {
                    array[0] = currentCard[i];
                    return array;
                }
            }
            break;

       case com.TYPE_DOUBLE:
            for (var i = 0; i < num - 1; i++) {
                if (currentCardValue[i] > last.value
                    && currentCardValue[i] == currentCardValue[i + 1]) {
                    array[0] = currentCard[i];
                    array[1] = currentCard[i + 1];
                    return array;
                }
            }
            break;
        
        case com.TYPE_TRIPPLE:
            for (var i = 0; i < num - 2; i++) {
                if (currentCardValue[i] > last.value
                    && currentCardValue[i] == currentCardValue[i + 1]
                    && currentCardValue[i + 1] == currentCardValue[i + 2]) {
                    array[0] = currentCard[i];
                    array[1] = currentCard[i + 1];
                    array[2] = currentCard[i + 2];
                    return array;
                }
            }
            break;

        case com.TYPE_BOMB:
            for (var i = 0; i < num - 3; i++) {
                if (currentCardValue[i] > last.value
                    && currentCardValue[i] == currentCardValue[i + 1]
                    && currentCardValue[i] == currentCardValue[i + 2]
                    && currentCardValue[i] == currentCardValue[i + 3]) {
                    array[0] = currentCard[i];
                    array[1] = currentCard[i + 1];
                    array[2] = currentCard[i + 2];
                    array[3] = currentCard[i + 3];
                    return array;
                }
            }
            break;
        // TODO: 对更多的case进行讨论。
    }

    // 使用炸弹或者对王等
    array = getBomb(currentCard, currentCardValue, num);
    return array;
}

var getBomb = function(currentCard, currentCardValue, num) {
    var array = [];
    var i, j = 1;
    array[0] = currentCard[0];
    for (i = 1; i < num; i++) {
        if (currentCardValue[i] == currentCardValue[i-1]) {
            array[j] = currentCard[i];
        } else {
            j = 0;
            array[j] = currentCard[i]
        }
        j++;
        if (j == 4) break;
    }
    cc.log(array);
    if (array.length == 4) return array;
    array = [];
    if (currentCard[num-2] == 52) {
        array[0] = currentCard[num-2];
        array[1] = currentCard[num-1];
    }
    return array;
}