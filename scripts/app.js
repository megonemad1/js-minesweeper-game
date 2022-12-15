
/**Paths to used images */
const TILE_NORMAL_PATH = "./images/tile_default.png";
const TILE_FLAG_PATH = "./images/tile_flag.png";
const TILE_BOMB_PATH = "./images/tile_bomb.png";
const TILE_CHECKED_PATH = "./images/tile_checked.png";
const TILE_ONE_PATH = "./images/tile_one.png";
const TILE_TWO_PATH = "./images/tile_two.png";
const TILE_THREE_PATH = "./images/tile_three.png";
const TILE_FOUR_PATH = "./images/tile_four.png";
const TILE_FIVE_PATH = "./images/tile_five.png";
const TILE_SIX_PATH = "./images/tile_six.png";
const TILE_SEVEN_PATH = "./images/tile_seven.png";
const TILE_EIGHT_PATH = "./images/tile_eight.png";
const TILE_INFINITY_PATH = "./images/tile_infinity.png";

const KABOOM_SOUND = "./sounds/kaboom.mp3";

const NUMERIC_TILES = [TILE_ONE_PATH, TILE_TWO_PATH, TILE_THREE_PATH, TILE_FOUR_PATH, TILE_FIVE_PATH, TILE_SIX_PATH, TILE_SEVEN_PATH, TILE_EIGHT_PATH];

/**Field parameters */
const FIELD_DIM = 12;
const FIELD_SIZE = FIELD_DIM * FIELD_DIM;

/** Classnames */
const GRID_CLASSNAME = '.grid';
const TILE_CLASSNAME = 'tile';
const ATTRIBUTE_TILENAME = 'data-tile';
const ATTRIBITE_CHECKED = 'tile--checked';
const ATTRIBITE_FLAGGED = 'tile--flagged';
const ATTRIBUTE_BOMB = 'tile--bomb';

/** In-game parameters */
let bombs = [];
let numbers = [];
let grid;
let bombFrequency = 0.2;
let gameOver = false;
let tile_history = [];

/**
* MD5 (Message-Digest Algorithm)
* http://www.webtoolkit.info/
**/
class random {
	constructor(seed) {
		this.queue = this.md5_dec(seed);
		this.seed = seed + this.queue.join('');
	}
	md5_dec(string) {
		return this.md5(string).map((n) => parseInt(n, 16))
	}
	md5(string) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}

		function AddUnsigned(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x, y, z) { return (x & y) | ((~x) & z); }
		function G(x, y, z) { return (x & z) | (y & (~z)); }
		function H(x, y, z) { return (x ^ y ^ z); }
		function I(x, y, z) { return (y ^ (x | (~z))); }

		function FF(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function GG(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function HH(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function II(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		};

		function WordToHex(lValue) {
			var WordToHexValue = '', WordToHexValue_temp = '', lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				WordToHexValue_temp = '0' + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
			}
			return WordToHexValue;
		};

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, '\n');
			var utftext = '';

			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}

			return utftext;
		};

		var x = Array();
		var k, AA, BB, CC, DD, a, b, c, d;
		var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
		var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
		var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
		var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k = 0; k < x.length; k += 16) {
			AA = a; BB = b; CC = c; DD = d;
			a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = AddUnsigned(a, AA);
			b = AddUnsigned(b, BB);
			c = AddUnsigned(c, CC);
			d = AddUnsigned(d, DD);
		}

		var temp = [
			WordToHex(a).toLowerCase(),
			WordToHex(b).toLowerCase(),
			WordToHex(c).toLowerCase(),
			WordToHex(d).toLowerCase(),
		];

		return temp;
	}
	getInt() {
		const n = this.queue.shift()
		if (this.queue.length <= 0) {
			this.queue = this.md5_dec(this.seed)
			this.seed += this.queue.join('');
		}
		return n;
	}
	getUInt8() { return (this.getInt() % 256) | 0xFF }
	getInt8() { return this.getUInt8() & 0xFF }
	getFloat() { return parseFloat('0.' + this.getInt()) }
}
const R = new random("TheSEED");

/**Solves if there will be a bomb on the tile */
function do_solution(x, y) {
	bombs.push(`${x},${y}`);
	if (x > 0) numbers.push(`${x - 1},${y}`);
	if (x < FIELD_DIM - 1) numbers.push(`${x + 1},${y}`);
	if (y > 0) numbers.push(`${x},${y - 1}`);
	if (y < FIELD_DIM - 1) numbers.push(`${x},${y + 1}`);
	if (x > 0 && y > 0) numbers.push(`${x - 1},${y - 1}`);
	if (x < FIELD_DIM - 1 && y < FIELD_DIM - 1) numbers.push(`${x + 1},${y + 1}`);
	if (y > 0 && x < FIELD_DIM - 1) numbers.push(`${x + 1},${y - 1}`);
	if (x > 0 && y < FIELD_DIM - 1) numbers.push(`${x - 1},${y + 1}`);
}


/** Parses and splits coordinates */
function parse_coordinates() {
	for (let i = 0; i < numbers.length; i++) {
		let num = numbers[i];
		let coords = num.split(',');
		let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
		let dataNum = parseInt(tile.getAttribute('data-num'));
		if (!dataNum) dataNum = 0;
		tile.setAttribute('data-num', dataNum + 1);
	}
}

/**Processes one tile */
function process_tile(tile, x, y) {
	tile.setAttribute(ATTRIBUTE_TILENAME, `${x},${y}`);
	let random_boolean = R.getFloat() < bombFrequency;
	if (random_boolean) do_solution(x, y);

	//Right mouse button click event
	tile.oncontextmenu = function (e) {
		e.preventDefault();
		add_flag(tile);
	}

	//Left mouse button click event
	tile.addEventListener('click', function (e) {
		tile_history.push(x * FIELD_DIM + y)
		clickTile(tile);
	});
}

/**Process field */
function process_field(grid) {
	let x = 0;
	let y = 0;
	for (const tile of grid.children) {
		process_tile(tile, x, y);
		x++;
		if (x >= FIELD_DIM) {
			x = 0;
			y++;
		}
	}
	parse_coordinates();

}

/** Clears numbers and bombs arrays */
function clear_arrays() {
	numbers = [];
	bombs = [];
	gameOver = false;

}

/**Creates game field */
function create_board(grid) {
	if (!grid) return
	clear_arrays();
	for (let i = 0; i < FIELD_SIZE; i++) {
		const tile = document.createElement('img');
		tile.classList.add(TILE_CLASSNAME);
		tile.setAttribute('src', TILE_NORMAL_PATH);
		grid.appendChild(tile);
	}
	process_field(grid);
}

/**Put a flag on a tile (or remove) */
function add_flag(tile) {
	if (gameOver) return;
	if (!tile.classList.contains(ATTRIBITE_CHECKED)) {
		if (!tile.classList.contains(ATTRIBITE_FLAGGED)) {
			tile.setAttribute('src', TILE_FLAG_PATH);
			tile.classList.add(ATTRIBITE_FLAGGED);
		} else {
			tile.setAttribute('src', TILE_NORMAL_PATH);
			tile.classList.remove(ATTRIBITE_FLAGGED);
		}
	}
}


/**Left mouse button click on tile */
const clickTile = (tile) => {
	if (gameOver) return;
	if (tile.classList.contains(ATTRIBITE_CHECKED) || tile.classList.contains(ATTRIBITE_FLAGGED)) return;
	let coordinate = tile.getAttribute(ATTRIBUTE_TILENAME);
	if (bombs.includes(coordinate)) {
		endGame(tile);
	} else {

		let num = tile.getAttribute('data-num');
		if (num != null) {
			tile.classList.add(ATTRIBITE_CHECKED);
			tile.setAttribute('src', TILE_CHECKED_PATH);
			if (num < 0 || num > NUMERIC_TILES.length) tile.setAttribute('src', TILE_INFINITY_PATH);
			else tile.setAttribute('src', NUMERIC_TILES[num - 1]);
			console.log(`There are ${num} bombs around!`);
			if (num == 0) tile.setAttribute('src', TILE_CHECKED_PATH);
			setTimeout(() => {
				checkVictory();
			}, 100);
			return;
		}
		checkTile(tile, coordinate);
	}
	tile.classList.add(ATTRIBITE_CHECKED);
	tile.setAttribute('src', TILE_CHECKED_PATH);
}




/**Check tiles nearby */
const checkTile = (tile, coordinate) => {

	let coords = coordinate.split(',');
	let x = parseInt(coords[0]);
	let y = parseInt(coords[1]);

	setTimeout(() => {
		if (x > 0) {
			let targetW = document.querySelectorAll(`[data-tile="${x - 1},${y}"`)[0];
			clickTile(targetW, `${x - 1},${y}`);
		}
		if (x < FIELD_DIM - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x + 1},${y}"`)[0];
			clickTile(targetE, `${x + 1},${y}`);
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y - 1}"]`)[0];
			clickTile(targetN, `${x},${y - 1}`);
		}
		if (y < FIELD_DIM - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y + 1}"]`)[0];
			clickTile(targetS, `${x},${y + 1}`);
		}

		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x - 1},${y - 1}"`)[0];
			clickTile(targetNW, `${x - 1},${y - 1}`);
		}
		if (x < FIELD_DIM - 1 && y < FIELD_DIM - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x + 1},${y + 1}"`)[0];
			clickTile(targetSE, `${x + 1},${y + 1}`);
		}

		if (y > 0 && x < FIELD_DIM - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x + 1},${y - 1}"]`)[0];
			clickTile(targetNE, `${x + 1},${y - 1}`);
		}
		if (x > 0 && y < FIELD_DIM - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x - 1},${y + 1}"`)[0];
			clickTile(targetSW, `${x - 1},${y + 1}`);
		}
	}, 10);
}

/**End of the game */
const endGame = (tile) => {
	gameOver = true;
	tile.setAttribute('src', TILE_BOMB_PATH);
	var audio = new Audio(KABOOM_SOUND);
	//audio.play();

	for (const current_tile of grid.children) {
		let coordinate = current_tile.getAttribute(ATTRIBUTE_TILENAME);
		if (bombs.includes(coordinate)) {
			current_tile.classList.remove(ATTRIBITE_FLAGGED);
			current_tile.classList.add(ATTRIBITE_CHECKED, ATTRIBUTE_BOMB);
			current_tile.setAttribute('src', TILE_BOMB_PATH);
		}
	}
	andfinaly();
	//alert("GAME OVER! U EXPLODED URSELF!");
}

/** Are ya winning son?  */
const checkVictory = () => {
	let win = true;
	for (const ctile of grid.children) {
		let coordinate = ctile.getAttribute(ATTRIBUTE_TILENAME);
		if (!ctile.classList.contains(ATTRIBITE_CHECKED) && !bombs.includes(coordinate)) win = false;
	}
	if (win) {
		alert("Congratulations! You won!");
		gameOver = true;
		andfinaly();
	}
}


function andfinaly() {
	const key = R.md5(JSON.stringify(tile_history)).join('');
	RSeeded = new random(key)
	input_ele = document.getElementById('txtinput')
	should_encrypt = document.querySelector("#chkshouldencrypt").checked
	try {
		if (should_encrypt)
			input_ele.value = encrypt(input_ele.value, RSeeded)
		else
			input_ele.value = decrypt(input_ele.value, RSeeded)
	}
	catch {
		console.log("failed to process input")
	}
}


function encrypt(str, R) {
	// convert the string to a byte array
	var bytes = [];
	for (var i = 0; i < str.length; i++) {
		var charCode = str.charCodeAt(i);
		bytes.push(charCode);
	}

	// perform XOR on each byte with each number in the array
	for (var j = 0; j < bytes.length; j++) {
		bytes[j] = bytes[j] ^ R.getUInt8();
	}

	// convert the byte array to a base64 string
	var base64 = btoa(String.fromCharCode.apply(null, bytes));

	return base64;
}

function decrypt(base64, R) {
	// convert the base64 string to a byte array
	var bytes = atob(base64).split('').map(function (c) {
		return c.charCodeAt(0);
	});

	// perform XOR on each byte with each number in the array
	for (var j = 0; j < bytes.length; j++) {
		bytes[j] = bytes[j] ^ R.getUInt8();
	}

	// convert the byte array to a string
	var str = String.fromCharCode.apply(null, bytes);

	return str;
}

/**Game start function */
function start() {
	clear_arrays();
	grid = document.querySelector(GRID_CLASSNAME);
	grid.replaceChildren();
	create_board(grid);
	document.title = `Minesweeper: ${bombs.length} bombs!`;
	tile_history = [];
}




start();
