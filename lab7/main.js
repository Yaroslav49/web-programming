/* 

Составить функцию определения характеристик функции y = f(x) по вариантам задания, где каждая характеристика рассчитывается отдельной функцией 
и передаётся в функцию расчёта характеристик в виде массива, а рассчитанные характеристики возвращаются из функции также в виде массива. 
Функция задана в дискретных точках отрезка [a, b] с постоянным шагом h. 
Используя ее, найти характеристики заданных ниже функций f1, f2 и f3. 
Для заданных функций предусмотреть создание вариантов функций (через функции высшего порядка) для:

- мемоизации значений в замыкании и возможность получения только предрасчитанного значения и 
  количества предрасчитанных значений через собственные методы функции;
- вывод в консоль отладочной информации: время вызова, аргумент, значение функции;
- сохранение количества вызовов функции в замыкании, получение и обнуление этого значения через собственные методы функции. 

Интерфейс программы должен предоставлять возможность 
	выбрать диапазон и шаг определения функции, 
	выбрать вид функции (f1, f2 или f3), 
	выбрать сочетание рассчитываемых характеристик, 
	а также сочетание вариантов функции (мемоизированная, отладочная, сохранение кол-ва вызовов).

Характеристики: минимум, кол-во положительных значений, является ли монотонно-возрастающей.

*/

var f; // выбранная функция

// сами функции

function ln(x) {
	return Math.log(x);
}

function f1(x) {
	return x + (x ** 3 - ln(x)) / ( (x + 5) ** (0.5) );
}

function f2(x) {
	return ln(x - 5) - ln(x - 2) ** 3 + 1 / (x + 5 * Math.sin(x));
}

function f3(x) {
	return (Math.exp(3) + x) / 6 + (x ** 3 + 2 * x) / (4 * Math.sin(4 * x));
}

function tabulateF(f, a, b, h) {
	const n = Math.floor((b - a) / h) + 1;
	const ys = new Array(n);
	var x;
	for (var i = 0; i < n; i++) {
		x = a + i * h;
		ys[i] = f(x);
	}
	return ys;
}

// характеристики

function findMinimum(ys) {
	var min = Infinity;
	for (var i = 0; i <= ys.length; i++) {
		if (isFinite(ys[i])) {
			min = Math.min(min, ys[i]);
		}	
	}
	return min.toFixed(3);
}

function countPositiveValues(ys) {
	return ys.reduce(
		(count, value) => count + (isFinite(value) && value > 0), 
		0
	);
}

function checkMonoIncreasing(ys) {
	for (var i = 0; i <= ys.length-1; i++) {
		if (ys[i] >= ys[i+1]) {
			return false
		}
	}
	return true
}

function getMonoIncreasingText(ys) {
	let res = checkMonoIncreasing(ys);
	return `Функция ${res ? '' : 'не'} является монотонно возрастающей`;
}

function calculateCharacteristics(ys, charasteristicsFunctions) {
	return charasteristicsFunctions.map(func => func(ys));
}

// варианты функций

function memoize(f) {
	var cache = {}; // кэш значений
	var length = 0;

	function getKey(x) {
		return typeof x == 'number' ? x.toFixed(3) : x;
	}
	
	const newF = function(x) {
		const key = getKey(x);
		
		if (key in cache) {
			return cache[key];
		} else {
			length++;
			cache[key] = f.apply(this, arguments);
			return cache[key];
		}
		
	}

	for (key in f) {
		newF[key] = f[key];
	}

	newF.getCached = function(x) {
		const key = getKey(x);
		return cache === undefined ? undefined : cache[key];
	}

	newF.getLengthCash = function() {
		return length;
	}

	return newF;
}

function countCallsFunction(f) {
	var countCalls = 0;

	const newF = function() {
		countCalls++;
		return f.apply(this, arguments);
	}

	for (key in f) {
		newF[key] = f[key];
	}

	newF.getCountCalls = function() {
		return countCalls;
	}

	newF.resetCountCalls = function() {
		countCalls = 0;
	}

	return newF
}

function debugFunction(f) {
	const log = [];

	const newF = function(x) {
		const time = new Date().toTimeString().slice(0,8);
		const y = f.apply(this, arguments);
		log.push( { x, y, time } );
		console.log(`${time}, x=${x}, f(x)=${y}`);
		return y;
	}

	for (key in f) {
		newF[key] = f[key];
	}

	newF.getLog = function() {
		return log;
	}

	return newF;
}


// графика

function onLoadPage() {
	clearAll();
}

function clearAll() {
	[
		"result-frame", "error", 
		"minimum-out-group", "count-positive-values-out-group", "mono-increasing-out",
		"memo-frame", "cache-out-group", "memo-error",
		"count-calls-frame", "debug-frame"
	].forEach(
		id => {
			document.getElementById(id).style.display = 'none';
		}
	)
}

function setElementValue(nameElement, value) {
	document.getElementById(nameElement + "-group").style.display = 'block';
	document.getElementById(nameElement).value = value;
}

function showMinimum(value) {
	setElementValue("minimum-out", value);
}

function showCountPositiveValues(value) {
	setElementValue("count-positive-values-out", value);
}

function showMonoIncreasing(value) {
	let resultText = document.getElementById("mono-increasing-out");
	resultText.style.display = "block";
	resultText.textContent =  value;
}
	

function mainSolve() {
	clearAll();

	// получение входных данных
	const typeFunction = Number.parseInt(document.getElementById('type-function').value);
	const error = document.getElementById("error");
	if (!isFinite(typeFunction)) {
		error.textContent = 'Ошибка: функция не выбрана';
		error.style.display = 'block';
		return
	}
	f = [f1, f2, f3][typeFunction];
	var a = Number.parseFloat(document.getElementById('a').value);
	var b = Number.parseFloat(document.getElementById('b').value);
	var h = Number.parseFloat(document.getElementById('h').value);
	if (!isFinite(a) || !isFinite(b)) {		
		error.textContent = 'Ошибка: не заполнены границы отрезка определения функции';
		error.style.display = 'block';
		return
	}
	if (!isFinite(h) || h <= 0) {		
		error.textContent = 'Ошибка: введите положительное число для шага определения функции';
		error.style.display = 'block';
		return
	}
	if (b < a) {
		let buff = a;
		a = b;
		b = buff;
	}
	if ((b-a) < h) {
		error.textContent = 'Ошибка: шаг должен быть меньше границы отрезка определения функции';
		error.style.display = 'block';
		return
	}
	if (typeFunction == 0 && a <= 0) {
		error.textContent = 'Ошибка: функция f1(x) определена при x > 0';
		error.style.display = 'block';
		return
	}
	if (typeFunction == 1 && a <= 5) {
		error.textContent = 'Ошибка: функция f2(x) определена при x > 5';
		error.style.display = 'block';
		return
	}
	if (typeFunction == 2 && a == 0) {
		error.textContent = 'Ошибка: функция f3(x) определена при x ≠ 0';
		error.style.display = 'block';
		return
	}

	const minimumChecked = document.getElementById('minimum').checked;
	const countPositiveValuesChecked = document.getElementById('count-positive-values').checked;
	const monoIncreasingChecked = document.getElementById('mono-increasing').checked;
	if (!minimumChecked && !countPositiveValuesChecked && !monoIncreasingChecked) {
		error.textContent = 'Выберите хотя бы одну характеристику, чтобы продолжить';
		error.style.display = 'block';
		return
	}

	const memoVariantCheched = document.getElementById('memo').checked;
	const debugVariantChecked = document.getElementById('debug').checked;
	const countCallsVariantChecked = document.getElementById('count-calls').checked;

	document.getElementById("result-frame").style.display = 'flex';

	// отображение результатов

	if (memoVariantCheched) {
		f = memoize(f);
	}
	if (countCallsVariantChecked) {
		f = countCallsFunction(f);
	}
	if (debugVariantChecked) {
		f = debugFunction(f);
	}

	const ys = tabulateF(f, a, b, h);

	// характеристики функции
	var charasteristicsFunctions = [];
	var charasteristicsOutFunctions = [];
	if (minimumChecked) {
		charasteristicsFunctions.push(findMinimum);
		charasteristicsOutFunctions.push(showMinimum);
	}
	if (countPositiveValuesChecked) {
		charasteristicsFunctions.push(countPositiveValues);
		charasteristicsOutFunctions.push(showCountPositiveValues);
	}
	if (monoIncreasingChecked) {
		charasteristicsFunctions.push(getMonoIncreasingText);
		charasteristicsOutFunctions.push(showMonoIncreasing);
	}

	const charasteristics = calculateCharacteristics(ys, charasteristicsFunctions);

	charasteristicsOutFunctions.forEach(
		(element, index) => element(charasteristics[index])
	);

	// варианты функций
	if (memoVariantCheched) {
		document.getElementById("memo-frame").style.display = 'flex';
		document.getElementById("length-cache-out").value = f.getLengthCash();
	}
	if (countCallsVariantChecked) {
		document.getElementById("count-calls-frame").style.display = 'flex';
		document.getElementById("count-calls-out").value = f.getCountCalls();
	}
	if (debugVariantChecked) {
		document.getElementById("debug-frame").style.display = 'flex';
		const logTable = document.getElementById("debug-out");
		logTable.innerHTML = '';
		logTable.appendChild(createTable(f.getLog(), "Вывод в консоль"))
	}
	
}

function calculateCacheValue() {
	const x = Number.parseFloat(document.getElementById('x-cache').value);
	const error = document.getElementById("memo-error");
	if (!isFinite(x)) {
		error.textContent = 'Ошибка: задайте x';
		error.style.display = 'block';
		return
	}

	document.getElementById("cache-out-group").style.display = "block";
	var cache = f.getCached(x);
	cache = isNaN(cache) ? 'f(x) не определена' : cache;
	cache = cache ?? "отсутствует";
	document.getElementById("cache-out").value = String(cache);
}

function resetCountCalls() {
	f.resetCountCalls();
	document.getElementById("count-calls-out").value = f.getCountCalls();
}

function createTable(array, nameTable) {
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	var caption = document.createElement("caption");
	caption.appendChild(document.createTextNode(nameTable));
	table.appendChild(caption);
	table.appendChild(tbody);

	// создание шапки с названиями колонок
	var namesColumns = ["Время вызова", "x", "f(x)"];
	let row = document.createElement("tr");
	namesColumns.forEach(
		column => {
			let cell = document.createElement("th");
			let cellText = document.createTextNode(column);
			cell.appendChild(cellText);
			row.appendChild(cell);
		}
	)
	tbody.appendChild(row);

	// создание тела таблицы
	array.forEach(
		(obj) => {
			var row = document.createElement("tr");
			var values = [
				obj.time,
				obj.x,
				isNaN(obj.y) ? 'не определена' : obj.y
			]
			values.forEach(
				value => {
					let cell = document.createElement("td");
					let cellText = document.createTextNode(value);
					cell.appendChild(cellText);
					row.appendChild(cell);
				}
			);
			tbody.appendChild(row);
		}
	)
	return table;
}


