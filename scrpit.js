var SIZE = 4;
var board = [];      // board[r][c] holds a tile number (1-15), or 0 for the empty slot
var moves = 0;
var seconds = 0;
var timer = null;
var playing = false;

function render() {
	for (var r = 0; r < SIZE; r++) {
		for (var c = 0; c < SIZE; c++) {
			var cell = document.getElementById("cell" + (r + 1) + (c + 1));
			cell.textContent = board[r][c] || "";
			cell.className = board[r][c] ? "" : "empty";
		}
	}
	document.getElementById("moves").textContent = moves;
	document.getElementById("time").textContent = seconds;
}

// Tiles in sequential order, row by row, with the empty slot last
function solvedBoard() {
	var b = [];
	for (var r = 0; r < SIZE; r++) {
		b.push([]);
		for (var c = 0; c < SIZE; c++) {
			b[r].push((r * SIZE + c + 1) % (SIZE * SIZE));
		}
	}
	return b;
}

function isSolved() {
	for (var r = 0; r < SIZE; r++) {
		for (var c = 0; c < SIZE; c++) {
			if (board[r][c] !== (r * SIZE + c + 1) % (SIZE * SIZE)) {
				return false;
			}
		}
	}
	return true;
}

function findEmpty() {
	for (var r = 0; r < SIZE; r++) {
		for (var c = 0; c < SIZE; c++) {
			if (board[r][c] === 0) {
				return [r, c];
			}
		}
	}
}

function swapTiles(r1, c1, r2, c2) {
	var temp = board[r1][c1];
	board[r1][c1] = board[r2][c2];
	board[r2][c2] = temp;
}

function startGame() {
	moves = 0;
	seconds = 0;
	playing = true;
	clearInterval(timer);
	timer = setInterval(function () {
		seconds++;
		document.getElementById("time").textContent = seconds;
	}, 1000);
	render();
}

// Scramble with many random legal moves, so the puzzle is always solvable
function newGame() {
	board = solvedBoard();
	var lastR = -1, lastC = -1;
	var dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
	for (var i = 0; i < 300 || isSolved(); i++) {
		var e = findEmpty();
		var d = dirs[Math.floor(Math.random() * dirs.length)];
		var r = e[0] + d[0], c = e[1] + d[1];
		if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || (r === lastR && c === lastC)) {
			continue;   // off the board, or would undo the previous move
		}
		swapTiles(e[0], e[1], r, c);
		lastR = e[0];
		lastC = e[1];
	}
	startGame();
}

// Solved board with a single tile out of position: one move wins
function simpleGame() {
	board = solvedBoard();
	if (Math.random() < 0.5) {
		swapTiles(3, 3, 3, 2);
	} else {
		swapTiles(3, 3, 2, 3);
	}
	startGame();
}

function clickTile(row, column) {
	if (!playing) {
		return;
	}
	var r = row - 1, c = column - 1;
	var e = findEmpty();
	// Only a tile directly next to the empty slot can move
	if (Math.abs(r - e[0]) + Math.abs(c - e[1]) !== 1) {
		return;
	}
	swapTiles(r, c, e[0], e[1]);
	moves++;
	render();
	if (isSolved()) {
		playing = false;
		clearInterval(timer);
		setTimeout(win, 1000);   // let the last tile appear before the alert
	}
}

function win() {
	if (confirm("CONGRATULATIONS!\n\nYou've successfully reordered the puzzle numbers in sequential order!\n\n" +
			"Number of moves it took to complete: " + moves + "\n" +
			"Time spent to complete it: " + seconds + " second(s).\n\n" +
			"Would you like to play again?")) {
		newGame();
	}
}

newGame();
