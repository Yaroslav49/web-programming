/* 

Составить функцию вставки элемента Е после каждого элемента вектора, превышающего
некоторое значение Р. Используя данную функцию обработать все строки матриц M1 и М2.
Определить на сколько данные матрицы увеличились, уменьшились или остались прежнего
размера. 

После найти количество элементов Е с хотя бы одним чётным индексом в матрицах М1 и
М2. 

После этого отсортировать каждую чётную строку каждой матрицы по возрастанию, нечетную
– по убыванию.

*/

// непосредственно вычисления

function createMatrix(n, m, startValue, endValue) {
	const arr = Array(n).fill(0);
	arr.forEach(
		(_, index, array) => {
			array[index] = Array(m).fill(0);
			array[index].forEach(
				(_, index, array) => {
					array[index] = startValue + Math.random() * (endValue - startValue);
				}
			);
		}
	);
	return arr;
}

function insertInVector(insertValue, compareValue, vector) {
	vector.reduceRight(
		(_, value, index) => {
			if (value > compareValue) {
				vector.splice(index + 1, 0, insertValue);
			}
		},
		0
	);
}

function countEWithEvenIndex(E, matrix) {
	var count = 0;
	matrix.forEach(
		(row, index1) => {
			count += row.reduce(
				(prevValue, value, index2) => {
					if (value == E && (index1 % 2 == 0 || index2 % 2 == 0)) {
						return prevValue + 1;
					} else {
						return prevValue;
					}
				},
				0
			)
		}
	)
	return count;
}

function sortMatrix(matrix) {
	matrix.forEach(
		(row, index) => {
			if (index % 2 == 0) {
				row.sort((a, b) => {
					return a - b;
				})
			} else {
				row.sort((a, b) => {
					return b - a;
				})
			}
		}
	);
}

// графика

function insertInMatrix(insertValue, compareValue, matrix, table, nameTable) {
	var changes = 0;
	matrix.forEach(
		(row) => {
			changes -= row.length;
			insertInVector(insertValue, compareValue, row);
			changes += row.length;
		}
	);
	table.appendChild(createTable(matrix, nameTable));

	// выводим надпись про изменения в данных
	var verb = changes > 0 ? 'увеличились на ' : (changes == 0 ? 'не изменились' : 'уменьшились на ');
	var p = document.createElement("p");
	p.textContent = `Данные матрицы ${verb}${changes == 0 ? '' : (changes.toString() + " элементов")}`;
	table.appendChild(p);

	// выводим надпись про элементы E с чётным индексом
	var count = countEWithEvenIndex(insertValue, matrix);
	p = document.createElement("p");
	p.textContent = `Количество элементов Е с хотя бы одним чётным индексом: ${count}`;
	table.appendChild(p);
}

function createTable(matrix, nameTable) {
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	var caption = document.createElement("caption");
	caption.appendChild(document.createTextNode(nameTable));
	table.appendChild(caption);
	table.appendChild(tbody);

	matrix.forEach(
		(value) => {
			let row = document.createElement("tr");
			value.forEach(
				(value) => {
					let cell = document.createElement("td");
					cell.className = "cell";
					let cellText = document.createTextNode(value.toFixed(2));
					cell.appendChild(cellText);
					row.appendChild(cell);
				}
			);
			tbody.appendChild(row);
		}
	)
	return table;
}

function clearAll() {
	var error = document.getElementById("error");
	error.textContent = '';
	error.style.display = 'none';

	document.getElementById("matrixs").style.display = 'none';
	document.getElementById("insert-matrixs").style.display = 'none';
	document.getElementById("sort-matrixs").style.display = 'none';

	document.getElementById("matrix1").innerHTML = '';
	document.getElementById("matrix2").innerHTML = '';
	document.getElementById("insert-matrix1").innerHTML = '';
	document.getElementById("insert-matrix2").innerHTML = '';
	document.getElementById("sort-matrix1").innerHTML = '';
	document.getElementById("sort-matrix2").innerHTML = '';
}

function checkSizeMatrix(n) {
	return isFinite(n) && n >= 1 && n <= 50;
}

function mainSolve() {
	clearAll();
	var resultFrame = document.getElementById("result-frame");
	resultFrame.style.display = "flex";

	// получение входных данных
	var n = Number.parseInt(document.getElementById('n').value);
	var m = Number.parseInt(document.getElementById('m').value);
	var n2 = Number.parseInt(document.getElementById('n2').value);
	var m2 = Number.parseInt(document.getElementById('m2').value);
	var startValue = Number.parseFloat(document.getElementById('start').value);
	var endValue = Number.parseFloat(document.getElementById('end').value);
	var insertValue = Number.parseFloat(document.getElementById('E').value);
	var compareValue = Number.parseFloat(document.getElementById('P').value);

	// обработка ошибок
	var error = document.getElementById('error');
	if (!checkSizeMatrix(n) || !checkSizeMatrix(m)) {
		error.textContent = "Ошибка: неправильные размеры матрицы M1 (должно быть число от 1 до 50)";
	}
	if (!checkSizeMatrix(n2) || !checkSizeMatrix(m2)) {
		error.textContent = "Ошибка: неправильные размеры матрицы M2 (должно быть число от 1 до 50)";
	}
	if (!isFinite(startValue) || !isFinite(endValue)) {
		error.textContent = "Ошибка: введите числовой диапазон для генерации";
	}
	if (!isFinite(insertValue)) {
		error.textContent = "Ошибка: параметр E должен быть числом";
	}
	if (!isFinite(compareValue)) {
		error.textContent = "Ошибка: параметр P должен быть числом";
	}
	if (error.textContent != '') {
		error.style.display = 'inline';
		return
	}
	if (startValue > endValue) {
		let buff = startValue;
		startValue = endValue;
		endValue = buff;
	}

	// генерация матриц М1 и М2
	document.getElementById("matrixs").style.display = "flex";
	var m1 = createMatrix(n, m, startValue, endValue);
	var m2 = createMatrix(n2, m2, startValue, endValue);
	var matrix1Div = document.getElementById("matrix1");
	var matrix2Div = document.getElementById("matrix2");
	matrix1Div.appendChild(createTable(m1, "Матрица М1"))
	matrix2Div.appendChild(createTable(m2, "Матрица М2"))

	// 1. Вставка элементов E
	document.getElementById("insert-matrixs").style.display = "flex";
	matrix1Div = document.getElementById("insert-matrix1");
	matrix2Div = document.getElementById("insert-matrix2");
	insertInMatrix(insertValue, compareValue, m1, matrix1Div, "Матрица М1 после вставки")
	insertInMatrix(insertValue, compareValue, m2, matrix2Div, "Матрица М2 после вставки")

	// 2. Сортировка матриц
	document.getElementById("sort-matrixs").style.display = "flex";
	matrix1Div = document.getElementById("sort-matrix1");
	matrix2Div = document.getElementById("sort-matrix2");
	sortMatrix(m1); sortMatrix(m2);
	matrix1Div.appendChild(createTable(m1, "Матрица М1 после сортировки"))
	matrix2Div.appendChild(createTable(m2, "Матрица М2 после сортировки"))
}