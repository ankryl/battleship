let model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

//проверка попаданий и потоплен ли корабль
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);

			if (ship.hits[index] === "hit") {
				view.displayMessage("Повторный выстрел по кораблю!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Попадание!");

				if (this.isSunk(ship)) {
					view.displayMessage("Ты потопил мой корабль!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Промах!");
		return false;
	},

	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

//размещение кораблей
	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // горизонтальное
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // вертикальное
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

    //проверка на избежание столкновений
	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
}; 

//присваивание классов
let view = {
    displayMessage: function(msg){
        let messageArea = document.querySelector(".messageArea");
        messageArea.innerHTML = msg;
    },
    
    displayHit: function(location){
let cell = document.getElementById(location);
cell.setAttribute("class", "hit");
    },

    displayMiss: function(location){
let cell = document.getElementById(location);
cell.setAttribute("class","miss");
    }
};




//обработка  координат выстрелов, отслеживание кол-ва выстрелов, запрос обноваления модели после выстрела, проверка на зварешение игры
let controll = {
	guesses: 0,

	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("Ты потопил все мои корабли, за " + this.guesses + " ходов!");
			}
		}
	}
}

//проверка полученных данных и преобразование в формат для model
function parseGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Введены некорректные координаты!");
	} else {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Ты не попал по полю, попробуй снова!");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Ты не попал по полю, попробуй снова!");
		} else {
			return row + column;
		}
	}
	return null;
}

//получение и передача координат
function handleFireButton() {
	let guessInput = document.querySelector(".guessInput");
	let guess = guessInput.value.toUpperCase();

	controll.processGuess(guess);

	guessInput.value = "";
}


// выстрел по нажатию enter
function handleKeyPress(e) {
	let fireButton = document.querySelector(".fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}




window.onload = init;

function init() {

	let fireButton = document.querySelector(".fireButton");
	fireButton.onclick = handleFireButton;


	let guessInput = document.querySelector(".guessInput");
	guessInput.onkeypress = handleKeyPress;

	
	model.generateShipLocations();
}


