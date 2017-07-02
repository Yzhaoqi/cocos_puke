var handCard = {
    cardNum : 0,
    cardArray : []
};


var pickCard = {
    cardNum : 0,
    cardArray : []
};

var removeByValue = function(val) {
    for (var i = 0; i < handCard.cardArray.length; i++) {
        if (handCard.cardArray[i] == val) {
            handCard.cardArray.splice(i, 1);
            break;
        }
    }
}

exports.initial = () => {
    handCard.cardNum = 0;
    handCard.cardArray = [];
    pickCard.cardNum = 0;
    pickCard.cardArray = [];
}

exports.setHandCards = (array) => {
    handCard.cardNum = array.length;
    for (var i = 0; i < array.length; i++) {
        handCard.cardArray[i] = array[i];
    }
    handCard.cardArray.sort((a, b) => {return a-b});
}

exports.addHandCards = (array) => {
    var t = handCard.cardNum;
    handCard.cardNum = handCard.cardNum + array.length;
    for (var i = t; i < handCard.cardNum; i++) {
        handCard.cardArray[i] = array[i-t];
    }
    handCard.cardArray.sort((a, b) => {return a-b});
}

exports.pickCards = (array) => {
    pickCard.cardNum = array.length;
    handCard.cardNum = handCard.cardNum - array.length;
    for (var i = 0; i < array.length; i++) {
        pickCard.cardArray[i] = array[i];
        removeByValue(array[i]);
    }
}

exports.getHandCardNum = () => {
    return handCard.cardNum;
}

exports.getHandCards = () => {
    var array = [];
    for (var i = 0; i < handCard.cardNum; i++) {
        array[i] = handCard.cardArray[i];
    }
    return array;
}

exports.getPickCardNum = () => {
    return pickCard.cardNum;
}

exports.getPickCards = () => {
    var array = [];
    for (var i = 0; i < pickCard.cardNum; i++) {
        array[i] = pickCard.cardArray[i];
    }
    return array;
}