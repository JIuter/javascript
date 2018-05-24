(function() {
	$("#newgame").click(function () {
		var arr = [];
		var ei, ej;
		var size = $("#options").val();
		for (i = 0; i < size; ++i) {
			arr[i] = []
			for (j = 0; j < size; ++j) {
				if (i + j != (size - 1) * 2) {
					arr[i][j] = i * size + j + 1;
				} else {
					arr[i][j] = "";
				};
			};
		};

		ei = size - 1;
		ej = size - 1;
		for (i = 0; i < 500 * size; ++i) {
			switch (Math.round(3 * Math.random())) {
				case 0: if (ei != 0) swap(arr, ei, ej, --ei, ej); break; // up
				case 1: if (ej != size - 1) swap(arr, ei, ej, ei, ++ej); break; // right
				case 2: if (ei != size - 1) swap(arr, ei, ej, ++ei, ej); break; // down
				case 3: if (ej != 0) swap(arr, ei, ej, ei, --ej); // left
			};
		};

		var table = document.createElement("table"),
			tbody = document.createElement("tbody");
		table.appendChild(tbody);
		for (i = 0; i < size; ++i) {
			var row = document.createElement("tr");
			for (j = 0; j < size; ++j) {
				var cell = document.createElement("td");
				cell.id = i + "_" + j;
				cell.dataset.i = i;
				cell.dataset.j = j;
				cell.innerHTML = arr[i][j];
				row.appendChild(cell);
			};

			tbody.appendChild(row);
		};

		var $tableDiv = $("#table");
		$tableDiv.html("");
		$("#win").html("");
		$tableDiv.append(table);
		$tableDiv.find("td").click(function (e) {
			var $element = $(this),
			i = $element.data("i"),
			j = $element.data("j");
			if ((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1)) {
				$("#" + ei + "_" + ej).html($element.html());
				$element.html("");
				ei = i;
				ej = j;
				var q = true;
				for (i = 0; i < size; ++i) {
					for (j = 0; j < size; ++j) {
						var $cel = $("#" + i + "_" + j);
						if (i + j != (size - 1) * 2 && $cel.html() != i * size + j + 1) {
							q = false;
							$cel.removeClass("cool");
						} else {
							$cel.addClass("cool");
						};
					};
				};

				$("#" + (size - 1) + "_" + (size - 1)).removeClass("cool");
				if (q) {
					$("#win").html("Вы победили!")
				};
			};
		});
	});

	function swap(arr, i1, j1, i2, j2) {
		t = arr[i1][j1];
		arr[i1][j1] = arr[i2][j2];
		arr[i2][j2] = t;
	};
})()