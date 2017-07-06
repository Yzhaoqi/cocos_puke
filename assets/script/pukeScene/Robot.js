var com = require('GameDefine');

// 选择分值
exports.selectPoint = (seat, pointToChoose, self) => {
    setTimeout(()=>{
        var l = pointToChoose.length;
        var num = Math.floor(Math.random() * l) % l;
        self.node.emit(com.ON_SELECT_NEXT, {num: seat, point: pointToChoose[num]});
    }, 500);
}

exports.pushCard = (zone, isLastPass, order, lastHandCardNum, gameLogic, gameDisplay, node, self) => {
    setTimeout(() => {
        if (isLastPass && order == 1) {
            self.passCard();
        } else {
            var array = getPushCard(zone, gameLogic, lastHandCardNum);
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
        }
    }, 500);
}

var getPushCard = function(zone, gameLogic, lastHandCardNum) {
    var currentCard = zone.getHandCards();
    var num = zone.getHandCardNum();
    var last = gameLogic.getLastCards();

    var array = [], currentCardValue = []; // currentCardValue
    for (var i = 0; i < num; i++) {
        currentCardValue[i] = gameLogic.getValue(currentCard[i]);
    }
    switch(last.type) {
        case com.TYPE_NOT_VALID: 
            array = getFirstPushCardArray(currentCard, currentCardValue, num);
            return array;
        case com.TYPE_SINGLE:
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

        case com.TYPE_TRIPPLE_CARRY:
            var tempValue;
            for (var i = 0; i < num - 2; i++) {
                if (currentCardValue[i] > last.value
                    && currentCardValue[i] == currentCardValue[i + 1]
                    && currentCardValue[i + 1] == currentCardValue[i + 2]) {
                    array[0] = currentCard[i];
                    array[1] = currentCard[i + 1];
                    array[2] = currentCard[i + 2];
                    tempValue = currentCardValue[i];
                }
            }
            if (array.length == 3) {
                if (last.num == 4) {
                    for (var i = 0; i < num; i++) {
                        if (currentCardValue[i] != tempValue) {
                            array[3] = currentCard[i];
                            return array;
                        }
                    }
                } else {
                    for (var i = 0; i < num - 1; i++) {
                        if (currentCardValue[i] > last.value
                            && currentCardValue[i] == currentCardValue[i + 1]
                            && currentCardValue[i] != tempValue) {
                            array[3] = currentCard[i];
                            array[4] = currentCard[i + 1];
                            return array;
                        }
                    }
                }
            }
            array = [];
            break;

        case com.TYPE_SERIAL:
            var i = 0, j = 0;
            for (i = 0; i < num; i++) {
                if (currentCardValue[i] > last.value)
                    break;
            }
            var less = last.num - 1;
            var currentValue = currentCardValue[i];
            array[j++] = currentCard[i++];
            for (; i < num; i++) {
                if (currentCardValue[i] - currentValue == 1) {
                    array[j++] = currentCard[i];
                    currentValue = currentCardValue[i];
                    less--;
                    if (less == 0) break;
                } else if (currentCardValue[i] == currentValue) {

                } else {
                    j = 0;
                    array[j++] = currentCard[i];
                    currentValue = currentCardValue[i];
                    less = last.num - 1;
                }
            }
            if (less == 0 && gameLogic.getValue(array[j-1]) != 12) {
                return array;
            }
            array = [];
            break;
        // 对更多的case进行讨论。
    }
    array = getBomb(currentCard, currentCardValue, num, lastHandCardNum);
    return array;
}

var getBomb = function(currentCard, currentCardValue, num, lastHandCardNum) {
    if (lastHandCardNum > 5) return [];
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

var getFirstPushCardArray = function(currentCard, currentCardValue, num) {
    var array = [];
    var i = 0;
    var pushCardNum = 0;
    // find serials
    while (pushCardNum < 5 && i < num) {
        pushCardNum = 0;
        var j = 0;
        var currentValue = currentCardValue[i];
        array[j++] = currentCard[i++];
        pushCardNum++;
        for (; i < num; i++) {
            if (currentCardValue[i] - currentValue == 1 && currentCardValue[i] != 12) {
                array[j++] = currentCard[i];
                currentValue = currentCardValue[i];
                pushCardNum++;
            } else if (currentCardValue[i] == currentValue) {

            } else {
                break;
            }
        }
    }
    if (pushCardNum >= 5) return array;
    array = [];

    // find tripple carry
    var tempValue;
    for (var i = 0; i < num - 2; i++) {
        if (currentCardValue[i] == currentCardValue[i + 1]
            && currentCardValue[i + 1] == currentCardValue[i + 2]) {
            array[0] = currentCard[i];
            array[1] = currentCard[i + 1];
            array[2] = currentCard[i + 2];
            tempValue = currentCardValue[i];
        }
    }
    if (array.length == 3) {
        if (num > 3) {
            for (var i = 0; i < num; i++) {
                if (currentCardValue[i] != tempValue) {
                    array[3] = currentCard[i];
                    return array;
                }
            }
        } else {
            return array;
        }
    }

    // find double
    for (var i = 0; i < num - 1; i++) {
        if (currentCardValue[i] == currentCardValue[i + 1]) {
            array[0] = currentCard[i];
            array[1] = currentCard[i + 1];
            return array;
        }
    }

    array[0] = currentCard[0];
    return array;
}