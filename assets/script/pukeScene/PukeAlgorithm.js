var com = require('GameDefine');

var getValue = function(cardVal) {
    if (cardVal - 52 >= 0) {
        return cardVal;
    } else {
        return Math.floor(cardVal / 4);
    }
}

exports.getTypeAndValue = function(cardArray) {
	var type = com.TYPE_NOT_VALID;
	var value = -1;
	var num = cardArray.length;
	var cardValue = [];
	for (var i = 0; i < num; i++) {
		cardValue[i] = getValue(cardArray[i]);
	}
	// single
	if (num == 1) {
		type = com.TYPE_SINGLE;
		value = cardValue[0];
	}
	// double or king bomb
	if (num == 2) {
		if (cardValue[0] == cardValue[1]) {
			type = com.TYPE_DOUBLE;
			value = cardValue[0];
		} else if (cardValue[0] == 52 && cardValue[1] == 53) {
			type = com.TYPE_KING_BOMB;
			value = cardValue[0];
		}
	}
	// tripple
	if (num == 3) {
		if (cardValue[0] == cardValue[1] && cardValue[0] == cardValue[2]) {
			type = com.TYPE_TRIPPLE;
			value = cardValue[0];
		}
	}
	// bomb
	if (num == 4) {
		if (cardValue[0] == cardValue[1] && cardValue[0] == cardValue[2] && cardValue[0] == cardValue[3]) {
			type = com.TYPE_BOMB;
			value = cardValue[0];
		}
	}
	// tripple carry
	if (type == com.TYPE_NOT_VALID && (num == 4 || num == 5)) {
		if (num == 4) {
			if (cardValue[0] == cardValue[1] && cardValue[0] == cardValue[2]) {
				type = com.TYPE_TRIPPLE_CARRY;
				value = cardValue[0];
			} else if (cardValue[1] == cardValue[2] && cardValue[2] == cardValue[3]) {
				type = com.TYPE_TRIPPLE_CARRY;
				value = cardValue[1];
			}
		} else {
			if (cardValue[0] == cardValue[1] && cardValue[0] == cardValue[2] && cardValue[3] == cardValue[4]) {
				type = com.TYPE_TRIPPLE_CARRY;
				value = cardValue[0];
			} else if (cardValue[0] == cardValue[1] && cardValue[2] == cardValue[3] && cardValue[3] == cardValue[4]) {
				type = com.TYPE_TRIPPLE_CARRY;
				value = cardValue[2];
			}
		}
	}
	// four carry
	if (type == com.TYPE_NOT_VALID && (num == 6 || num == 8)) {
		if (num == 6) {
			for (var i = 0; i < 3; i++) {
				var j;
				for (j = i+1; j < i+4; j++) {
					if (cardValue[i] != cardValue[j]) break;
				}
				if (j == i+4) {
					type = com.TYPE_FOUR_CARRY;
					value = cardValue[i];
					break;
				}
			}
		} else {
			var index = -1;
			for (var i = 0; i < 5; i++) {
				var j;
				for (j = i+1; j < i+4; j++) {
					if (cardValue[i] != cardValue[j]) break;
				}
				if (j == i+4) {
					index = i;
					break;
				}
			}
			if (index == 0 && cardValue[4] == cardValue[5] && cardValue[6] == cardValue[7]) {
				type = com.TYPE_FOUR_CARRY;
				value = cardValue[index];
			} else if (index == 2 && cardValue[0] == cardValue[1] && cardValue[6] == cardValue[7]) {
				type = com.TYPE_FOUR_CARRY;
				value = cardValue[index];
			} else if (index == 4 && cardValue[0] == cardValue[1] && cardValue[2] == cardValue[3]) {
				type = com.TYPE_FOUR_CARRY;
				value = cardValue[index];
			}
		}
	}
    // serial
	if (type == com.TYPE_NOT_VALID && (num >= 5 && num <= 12)) {
		var is_shunzi = true;
		for (var i = 1; i < num; i++) {
			if (cardValue[i] - cardValue[i-1] != 1) {
				is_shunzi = false;
				break;
			}
		}
		if (cardValue[num-1] == 12) is_shunzi = false;
		if (is_shunzi) {
			type = com.TYPE_SERIAL;
			value = cardValue[0];
		}
	}
    // serial double
	if (type == com.TYPE_NOT_VALID && (num >= 6 && num <= 20 && num % 2 == 0)) {
		var is_shunzi = true;
		if (cardValue[0] == cardValue[1]) {
			for (var i = 2; i < num; i+=2) {
				if (cardValue[i] != cardValue[i+1] || cardValue[i] - cardValue[i-2] != 1) {
					is_shunzi = false;
					break;
				}
			}
			if (cardValue[num-1] == 12) is_shunzi = false;
			if (is_shunzi) {
				type = com.TYPE_SERIAL_DOUBLE;
				value = cardValue[0];
			}
		}
	}
    // serial tripple
	if (type == com.TYPE_NOT_VALID && (num >= 6 && num <= 18 && num % 3 == 0)) {
		var is_shunzi = true;
		if (cardValue[0] == cardValue[1] && cardValue[0] == cardValue[2]) {
			for (var i = 3; i < num; i+=3) {
				if (cardValue[i] != cardValue[i+1] || cardValue[i] != cardValue[i+2] || cardValue[i] - cardValue[i-3] != 1) {
					is_shunzi = false;
					break;
				}
			}
			if (cardValue[num-1] == 12) is_shunzi = false;
			if (is_shunzi) {
				type = com.TYPE_SERIAL_TRIPPLE;
				value = cardValue[0];
			}
		}
	}
    // plane
	if (type == com.TYPE_NOT_VALID && (num >= 8 && (num % 4 == 0 || num % 5 == 0))) {
		if (num % 4 == 0) {
			var times = num / 4;
			for (var i = 0; i <= times; i++) {
				var has_shunzi = true;
				var j;
				if (cardValue[i] == cardValue[i+1] && cardValue[i] == cardValue[i+2]) {
					for (j = i+3; j < i+times*3; j+=3) {
						if (cardValue[j] != cardValue[j+1] || cardValue[j] != cardValue[j+2] || cardValue[j] - cardValue[j-3] != 1) {
							has_shunzi = false;
							break;
						}
					}
					if (cardValue[j-1] == 12) has_shunzi = false;
					if (has_shunzi) {
						type = com.TYPE_PLANE;
						value = cardValue[i];
						break;
					}
				}
			}
		} else {
			var times = num / 5;
			var index = -1;
			for (var i = 0; i <= times * 2; i+=2) {
				var has_shunzi = true;
				var j;
				if (cardValue[i] == cardValue[i+1] && cardValue[i] == cardValue[i+2]) {
					for (j = i+3; j < i+times*3; j+=3) {
						if (cardValue[j] != cardValue[j+1] || cardValue[j] != cardValue[j+2] || cardValue[j] - cardValue[j-3] != 1) {
							has_shunzi = false;
							break;
						}
					}
					if (cardValue[j-1] == 12) has_shunzi = false;
					if (has_shunzi) {
						index = i;
						break;
					}
				}
			}
			if (index != -1) {
				var is_duizi = true;
				for (var i = 0; i < index; i+=2) {
					if (cardValue[i] != cardValue[i+1]) {
						is_duizi = fasle;
						break;
					}
				}
				for (var i = index + times*3; i < num; i+=2) {
					if (cardValue[i] != cardValue[i+1]) {
						is_duizi = false;
						break;
					}
				}
				if (is_duizi == true) {
					type = com.TYPE_PLANE;
					value = cardValue[index];
				}
			}
		}
	}

	return {_type : type, _value : value};
}