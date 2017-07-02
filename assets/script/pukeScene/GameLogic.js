var com = require('GameDefine');
var algorithm = require('PukeAlgorithm');

var lastCard = {
    type : com.TYPE_NOT_VALID,  // 出牌类型
    array : [],                 // 牌
    num : 0,                    // 出牌数量
    value : -1                  // 该牌的值（取最小，例[34567].value = [3]， [55566].value = [5]） 其中取值value = minCard / 4;
}

var currentCard = {
    type : com.TYPE_NOT_VALID,
    array : [],
    num : 0,
    value : -1
}

exports.initial = () => {
    lastCard.type = com.TYPE_NOT_VALID;
    lastCard.array = [];
    lastCard.num = 0;
    lastCard.value = -1;
}

exports.setCurrentCard = function(cardArray) {
    currentCard.num = cardArray.length;
    for (var i = 0; i < cardArray.length; i++) {
        currentCard.array[i] = cardArray[i];
    }
    var c = algorithm.getTypeAndValue(cardArray);
    currentCard.type = c._type;
    currentCard.value = c._value;
}

exports.getValue = function(cardVal) {
    if (cardVal - 52 >= 0) {
        return cardVal;
    } else {
        return Math.floor(cardVal / 4);
    }
}

exports.getCurrentCardArray = function() {
    var array = [];
    for (var i = 0; i < currentCard.num; i++) {
        array[i] = currentCard.array[i];
    }
    return array;
}

exports.getLastCards = function() {
    var s = {type : '', num : 0, value : 0};
    s.type = lastCard.type;
    s.num = lastCard.num;
    s.value = lastCard.value;
    return s;
}

exports.isValid = function() {
    return currentCard.type != com.TYPE_NOT_VALID;
}

exports.canPush = function() {
    var s = false;
    var bigger = false;
    if (lastCard.type == com.TYPE_BOMB || currentCard.type == com.TYPE_NOT_VALID) {
        return false;
    }
    if (currentCard.type == com.TYPE_KING_BOMB) {
        bigger = true;
    } else if (currentCard.type == com.TYPE_BOMB) {
        if (lastCard.type != com.TYPE_BOMB) {
            bigger = true;
        } else {
            bigger = (currentCard.value > lastCard.value);
        }
    } else {
        bigger = (currentCard.type == lastCard.type && currentCard.num == lastCard.num && currentCard.value > lastCard.value);
    }
    if (lastCard.type == com.TYPE_NOT_VALID || bigger) {
        s = true;
    }
    return s;
}

exports.pushCards = function() {
    lastCard.type = currentCard.type;
    lastCard.num = currentCard.num;
    lastCard.value = currentCard.value;
    for (var i = 0; i < lastCard.num; i++) {
        lastCard.array[i] = currentCard.array[i];
    }

    currentCard.type = com.TYPE_NOT_VALID;
    currentCard.num = 0;
    currentCard.value = -1;
    currentCard.array = [];
}

exports.isWin = function(handCardNum) {
    return handCardNum == 0;
}

exports.reset = function() {
    lastCard.type = com.TYPE_NOT_VALID;
    lastCard.num = 0;
    lastCard.value = -1;
    lastCard.array = [];
}