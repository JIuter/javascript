(function () {
	var model = (function() {
		var EMTPY = 0;
		var SNAKE = 1;
		var FOOD = 2;
		var GAME_ON = "on";
		var GAME_PAUSE = "pause";
		var GAME_OVER = "over";
		var UP = 119;
		var DOWN = 115;
		var LEFT = 97;
		var RIGHT = 100;

		var gameState;
		var size = 50;
		var gameMatrix;
		var headDirection;
		var snakeChain;
		var food;
		var score;
		var level;

		function clear() {
			snakeChain = [];
			snakeChain.push({ i: 0, j: 2 });
			snakeChain.push({ i: 0, j: 1 });
			snakeChain.push({ i: 0, j: 0 });
			headDirection = RIGHT;
			newFood();
			buildMatrix();
			score = 0;
			level = 1;
		};

		function getMatrix() {
			return gameMatrix;
		};

		function startGame() {
			gameState = GAME_ON;
		};

		function pauseGame() {
			gameState = GAME_PAUSE;
		};

		function getGameState() {
			return gameState;
		}

		function setHeadDirection(direction) {
			if ((direction === LEFT) && (headDirection === RIGHT) ||
				(direction === RIGHT) && (headDirection === LEFT) ||
				(direction === DOWN) && (headDirection === UP) ||
				(direction === UP) && (headDirection === DOWN)) {
					return;
			};
			headDirection = direction;
		}

		function tryMove() {
			var x;
			var y;
			if (headDirection === UP) {
				x = -1;
				y = 0;
			};
			if (headDirection === DOWN) {
				x = 1;
				y = 0;
			};
			if (headDirection === LEFT) {
				x = 0;
				y = -1;
			};
			if (headDirection === RIGHT) {
				x = 0;
				y = 1;
			};

			var i = snakeChain[snakeChain.length - 1].i;
			var j = snakeChain[snakeChain.length - 1].j;

			for (k = snakeChain.length - 1; k > 0; k--) {
				snakeChain[k].i = snakeChain[k-1].i;
				snakeChain[k].j = snakeChain[k-1].j;
			}

			snakeChain[0].i += x;
			snakeChain[0].j += y;

			if (snakeChain[0].i < 0)
				snakeChain[0].i = size - 1;
			if (snakeChain[0].j < 0)
				snakeChain[0].j = size - 1;
			if (snakeChain[0].i === size)
				snakeChain[0].i = 0;
			if (snakeChain[0].j === size)
				snakeChain[0].j = 0;

			if (hasCollision()) { // with food
				snakeChain.push({ i: i, j: j });
				score++;
				if (score % 5 === 0)
					level++;
				newFood();
			};

			if (hasCollision(snakeChain[0])) { // head with snake
				gameState = GAME_OVER;
				return;
			};

			buildMatrix();
		};

		function buildMatrix() {
			gameMatrix = [];
			for (i = 0; i < size; ++i) {
				var row = []
				for (j = 0; j < size; ++j) {
					row.push(EMTPY);
				}
				gameMatrix.push(row);
			}

			for (k = 0; k < snakeChain.length; k++) {
				gameMatrix[snakeChain[k].i][snakeChain[k].j] = SNAKE;
			};

			gameMatrix[food.i][food.j] = FOOD;
		};

		function newFood() {
			while (true) {
				var i = getRandomInt(0, size);
				var j = getRandomInt(0, size);
				food = { i: i, j: j };

				if (!hasCollision()) {
					return;
				}
			}
		};

		function hasCollision(element) {
			var chain = element || food;
			var k = element ? 1 : 0;
			for (n = k; n < snakeChain.length; n++) {
				if (snakeChain[n].i === chain.i && snakeChain[n].j === chain.j)
					return true;
			};

			return false;
		};

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		};

		function getLevel() {
			return level;
		};

		function getScore() {
			return score;
		};

		return {
			clear: clear,
			getMatrix: getMatrix,
			startGame: startGame,
			pauseGame: pauseGame,
			getState: getGameState,
			EMPTY: EMTPY,
			SNAKE: SNAKE,
			FOOD: FOOD,
			GAME_ON: GAME_ON,
			GAME_PAUSE: GAME_PAUSE,
			GAME_OVER: GAME_OVER,
			UP: UP,
			DOWN: DOWN,
			LEFT: LEFT,
			RIGHT: RIGHT,
			setHeadDirection: setHeadDirection,
			tryMove: tryMove,
			getLevel: getLevel,
			getScore: getScore
	};
	})();

	var game = (function (model) {
		var size = 50;
		var interval;

		function drawTable() {
			var $tbody = $("#tbody");
			$tbody.html("");
			for (i = 0; i < size; ++i) {
				var $row = $("<tr/>");
				for (j = 0; j < size; ++j) {
					var $cell = $("<td/>");
					$cell.attr("i", i);
					$cell.attr("j", j);
					if (model.getMatrix()[i][j] === model.SNAKE)
						$cell.addClass("snake")
					if (model.getMatrix()[i][j] === model.FOOD)
						$cell.addClass("food")
					$row.append($cell);
				};

				$tbody.append($row);
			};
		}

		function newGame() {
			model.clear();
			drawTable();
		};

		function startOrPauseGame() {
			if (model.getState() !== model.GAME_ON) {
				$("#text").html("Press space to pause!")
				if (model.getState() === model.GAME_OVER) {
					model.clear();
				};
				model.startGame();
				interval = setInterval(gameCycle, 100);
			} else {
				$("#text").html("Press space to start!")
				model.pauseGame();
				clearInterval(interval);
			};
		};

		function gameCycle() {
			if (model.getState() === model.GAME_ON) {
				model.tryMove();
				if (model.getState() === model.GAME_OVER) {
					clearInterval(interval);
					$("#text").html("Game over. Press space to start!")
				};
				$("#score").html("Score: " + model.getScore())
				$("#level").html("Level: " + model.getLevel())
				drawTable();
			};
		};

		return {
			drawTable: drawTable,
			newGame: newGame,
			startOrPauseGame: startOrPauseGame
		};
	})(model);

	game.newGame();

	$(document).on("keypress", function (event) {
		if (event.which === 32) {
			game.startOrPauseGame();
		}

		if (model.getState() === model.GAME_ON) {
			if (event.which === model.UP) {
				model.setHeadDirection(model.UP)
			}
			if (event.which === model.DOWN) {
				model.setHeadDirection(model.DOWN)
			}
			if (event.which === model.RIGHT) {
				model.setHeadDirection(model.RIGHT)
			}
			if (event.which === model.LEFT) {
				model.setHeadDirection(model.LEFT)
			}
		}
	});
})()