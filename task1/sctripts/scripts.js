window.onload = function() {
	var errors = 0;
	var wordLength = 0;
	var lettersCount = 0;
	var buttonsBlock = document.getElementById('buttons');
	var lettersBlock = document.getElementById('letters');
	buttonsBlock.addEventListener('click',
		function(e) {
			if (e.target.tagName === 'BUTTON') {
				var buttonValue = e.target.dataset.value;
				var letters = lettersBlock.children;
				var hasError = true;
				for (var i = 0; i < letters.length; i++) {
					var letter = letters[i];
					if (letter.dataset.value === buttonValue) {
						lettersCount ++;
						letter.innerText = buttonValue;
						hasError = false;
					};
				};

				e.target.remove();

				if (hasError) {
					errors++;
					document.getElementById('errors').innerText = "Ошибки:" + errors;
					hasLoose();
				};

				hasWin()
			};
		});

	function hasLoose() {
		if (errors === 6) {
			clearButtons();
			finish("Вы проиграли!");
		};
	};

	function hasWin() {
		if (lettersCount === wordLength) {
			finish("Вы победили!")
		}
	};

	function finish(finishText) {
		clearButtons();
		var newSpan = document.createElement('span');
		var text = document.createTextNode(finishText);
		newSpan.appendChild(text);
		buttonsBlock.appendChild(newSpan);
	}

	function clearButtons() {
		while (buttonsBlock.firstChild) {
			buttonsBlock.firstChild.remove();
		};
	};

	document.getElementById('newgame').onclick = function() {
		var dictionary = ["собака", "страховка", "диплодок", "пенсионер", "аквапарк"];
		var letters = [
			"а", "б", "в", "г", "д", "е", "ё", "ж", "з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х",
			"ц", "ч", "ш", "щ", "ъ", "ы", "ь", "э", "ю", "я"
		];
		var wordCount = getRandomInt(1, dictionary.length);
		var word = dictionary[wordCount];
		errors = 0;

		while (lettersBlock.firstChild) {
			lettersBlock.firstChild.remove();
		};

		wordLength = word.length;
		lettersCount = 0;
		for (var i = 0; i < word.length; i++) {
			var newSpan = document.createElement('span');
			newSpan.dataset.value = word[i];
			newSpan.classList.add("class-letter")
			var text = document.createTextNode('_');
			newSpan.appendChild(text);
			lettersBlock.appendChild(newSpan);
		};

		clearButtons();

		for (var i = 0; i < letters.length; i++) {
			var newButton = document.createElement('button');
			newButton.dataset.value = letters[i];
			newButton.classList.add("class-button")
			var text = document.createTextNode(letters[i]);
			newButton.appendChild(text);
			buttonsBlock.appendChild(newButton);
		};

		document.getElementById('errors').innerText = "Ошибки:" + errors;

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		};
	};
};