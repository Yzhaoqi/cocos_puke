var hostCard = {
    cardNum : 0,
    cardArray : []
}

var removeByValue = function(val) {
    for (var i = 0; i < handCard.cardArray.length; i++) {
        if (handCard.cardArray[i] == val) {
            handCard.cardArray.splice(i, 1);
            break;
        }
    }
}


exports.initial = () => {
    hostCard.cardNum = 0;
    hostCard.cardArray = [];
}

exports.setHostCards = (array) => {
    hostCard.cardNum = array.length;
    for (var i = 0; i < array.length; i++) {
        hostCard.cardArray[i] = array[i];
    }
    hostCard.cardArray.sort((a, b) => {return a-b});
}

exports.getHostCardNum = () => {
    return hostCard.cardNum;
}

exports.getHostCards = () => {
    var array = [];
    for (var i = 0; i < hostCard.cardNum; i++) {
        array[i] = hostCard.cardArray[i];
    }
    return array;
}
