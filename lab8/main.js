/* 

Разработать класс объектов по вариантам задания (через прототипы, без использования class-определения). 
Каждый класс из вариантов должен иметь переопределенный метод toString() для вывода состояния объекта в консоль, 
а также наследоваться от родительского класса BaseObject, который должен иметь методы:

• регистрации факта, времени и аргументов вызова методов дочерних классов 
  (т.е. дочерний класс должен регистрировать эту информацию при вызове своих методов в своём родительском классе).
• очистку списка регистрации действий.
• вывод списка зарегистрированных действий в консоль.

Интерфейс программы должен содержать возможность создавать объекты класса и выполнять с
ними все возможные действия, с выводом результатов на экран.

Вариант 7: «Множество целых чисел» (Set). Разработать класс множества целых чисел мощности n.
Реализовать методы для
	определения принадлежности заданного элемента множеству,
	добавление/удаление элемента, 
	пересечения, объединения, разности двух множеств.

*/

// конструкторы классов

function BaseObject() {
	this.logData = [];
}

BaseObject.prototype.saveLogOperation = function(name, args) {
	this.logData.push({
		name, args,
		time: new Date().toTimeString().slice(0,8)
	})
}

BaseObject.prototype.clearLogData = function() {
	this.logData.length = 0;
}

function getValuesOfLog(obj) {
	return [obj.time, obj.name, obj.args]
}

BaseObject.prototype.printLog = function() {
	const result = document.getElementById("log-out");
	result.innerHTML = '';
	result.style.display = 'block';
	if (this.logData.length == 0) {
		let message = "Список зарегистрированных действий пуст";
		console.log(message);
		result.textContent = message;
	} else {
		this.logData.forEach(
			value => {
				console.log(`${value.time} ${value.name}(${value.args})`);
			}
		)
		const namesColumns = ["Время", "Метод", "Аргумент"];
		result.appendChild(createTable(this.logData, "Вызовы методов дочерних классов", namesColumns, getValuesOfLog));
	}
	
}

var baseObject = new BaseObject();

function toString() {
	return `Множество мощностью ${this.n}:\n[${Object.keys(this.data).join(', ')}]`;
}

function toSmallString() {
	const keys = Object.keys(this.data);
	if (keys.length == 0) {
		return '∅';
	} else {
		return `${keys.join(', ')}`;
	}
}

function include(elem) {
	this.saveLogOperation("include", String(elem));
	return elem in this.data;
}

function addToSet(elem) {
	this.data[elem] = true;
	this.n++;
	this.saveLogOperation("add", String(elem));
	return this;
}

function removeFromSet(elem) {
	this.saveLogOperation("remove", String(elem));
	if (elem in this.data) {
		delete this.data[elem];
		this.n--;
		return true;
	} else {
		return false;
	}
}

function intersection(set2) {
	this.saveLogOperation("intersection", set2.toString());
	var keys = Object.keys(this.data);
	keys = keys.filter(value => value in set2.data);
	return new Set(keys);
}

function union(set2) {
	this.saveLogOperation("union", set2.toString());
	var keys = Object.keys(this.data);
	keys = keys.filter(value => !(value in set2.data));
	return new Set(keys.concat(Object.keys(set2.data)));
}

function difference(set2) {
	this.saveLogOperation("difference", set2.toString());
	var keys = Object.keys(this.data);
	keys = keys.filter(value => !(value in set2.data));
	return new Set(keys);
}

function Set(arr) {
	BaseObject.call(this);
	this.data = {};
	this.n = 0;
	arr.forEach(
		value => {
			this.data[value] = true;
			this.n++;
		}
	)
	this.toString = toString;
	this.toSmallString = toSmallString;
	this.include = include;
	this.add = addToSet;
	this.remove = removeFromSet;
	this.intersection = intersection;
	this.union = union;
	this.difference = difference;
}

Set.prototype = baseObject;
Set.prototype.constructor = Set;

// графика

var sets = [];

function onLoadPage() {
	clearAll();
}

function clearAll() {
	[
		"operations1-frame", "error-creating", "sets",
		"error-include", "result-include", "error-add", "result-add", "error-remove", "result-remove",
		"operations2-frame", "result-intersection", "result-union", "result-difference",
		"log-frame", "log-out"
	].forEach(
		id => {
			document.getElementById(id).style.display = 'none';
		}
	)
}

// позволяет генерировать до 260 уникальных имён множеств
const getUniqueName = function() {
	var id = 0
	var f = function() {
		var name;
		if (id < 26) {
			name = String.fromCharCode(65 + id); // name = A, B...
		} else if (id < 260) {
			let code = id - 26;
			name = String.fromCharCode(65 + Math.floor(code / 9)) + String(code % 9 + 1); // name = A1, A2... A9, B1...
		} else {
			name = "?";
		}
		id++;
		return name;
	}
	f.resetCounter = function() {
		id = 0;
	}
	return f;
}();


// создание множества
function createSet() {
	const textSetA = document.getElementById('set').value.trim();
	var arrSetA = textSetA.split(/\s+/).map(value => parseInt(value));
	if (textSetA === '') {
		arrSetA = [];
	}

	const error = document.getElementById("error-creating");
	error.style.display = 'none';
	if (arrSetA.some(value => !isFinite(value))) {
		error.textContent = 'Ошибка: неправильный ввод множества';
		error.style.display = 'block';
		return
	}

	if (sets.length >= 260) {
		error.textContent = 'Ошибка: превышено максимальное количество множеств';
		error.style.display = 'block';
		return
	}

	const set = new Set(arrSetA);
	//console.dir(set);

	sets.push({
		name: getUniqueName(),
		data: set
	});
	updateSetsTable();
	updateSelects();
	
	document.getElementById("operations1-frame").style.display = 'flex';
	document.getElementById("log-frame").style.display = 'flex';

	if (sets.length > 1) {
		document.getElementById("operations2-frame").style.display = 'flex';
	}
}

// операции с одним множеством

function operationWithOneSet(name) {
	const elem = parseInt(document.getElementById(name + '-elem').value);
	const currentSetIndex = document.getElementById('select-1').value;

	const resultBlock = document.getElementById("result-" + name);
	const error = document.getElementById("error-" + name);
	if (!isFinite(elem)) {
		error.textContent = 'Ошибка: элемент множества может быть только целым числом';
		error.style.display = 'block';
		resultBlock.style.display = 'none';
		return
	}

	error.style.display = 'none';
	const result = sets[currentSetIndex].data[name](elem);
	const nameSet = sets[currentSetIndex].name;
	resultBlock.style.display = 'block';

	if (name == "include") {
		resultBlock.textContent = `Элемент ${elem} ${result ? '' : ' не '} принадлежит множеству ${nameSet}`;
	} else {
		updateSetsTable();
		updateSelects();
		if (name == "add") {
			resultBlock.textContent = `Элемент ${elem} добавлен в множество ${nameSet}`;
		} else if (name == "remove") {
			resultBlock.textContent = result ? `Элемент ${elem} удалён из множества ${nameSet}` : `Элемента ${elem} нет в множестве ${nameSet}!`;
		} 
	}
}

function checkInclude() {
	operationWithOneSet("include");
}

function addElemInSet() {
	operationWithOneSet("add");
}

function removeElemFromSet() {
	operationWithOneSet("remove");
}

// операции с двумя множествами

function operationWithTwoSets(name) {
	const set1Index = document.getElementById('select-2-1').value;
	const set2Index = document.getElementById('select-2-2').value;

	const resultBlock = document.getElementById("result-" + name);

	const result = sets[set1Index].data[name](sets[set2Index].data);
	resultBlock.style.display = 'block';
	resultBlock.textContent = `Результат:\n${result.toString()}`;
}

function intersectionTwoSets() {
	operationWithTwoSets('intersection');
}

function unionTwoSets() {
	operationWithTwoSets('union');
}

function differenceTwoSets() {
	operationWithTwoSets('difference');
}

// работа с логами

function printLog() {
	const currentSetIndex = document.getElementById('select-3').value;
	sets[currentSetIndex].data.printLog();
}

function clearLog() {
	const currentSetIndex = document.getElementById('select-3').value;
	sets[currentSetIndex].data.clearLogData();
	document.getElementById("log-out").style.display = 'none';
}

// всякое вспомогательное

function deleteSets() {
	if (confirm("Вы уверены, что хотите удалить все созданные множества?")) {
		sets = [];
		getUniqueName.resetCounter();
		clearAll();
	}
}

function getValuesOfSet(obj) {
	return [
		obj.name,
		obj.data.toSmallString()
	]
}

function updateSetsTable() {
	const namesColumns = ["Название", "Значения"];
	const table = document.getElementById("sets");
	table.style.display = "block";
	table.innerHTML = "";
	table.appendChild(createTable(sets, "Множества", namesColumns, getValuesOfSet))
}

function updateSelects() {
	const namesSelects = ['select-1', 'select-2-1', 'select-2-2', 'select-3'];
	for (let id in namesSelects) {
		const select = document.getElementById(namesSelects[id]);
		const selectedIndex = select.selectedIndex < 0 ? 0 : select.selectedIndex;
		select.innerHTML = '';
		sets.forEach(
			(value, index) => {
				let option = new Option(value.name, index);
				select.add(option);
			}
		)
		select.selectedIndex = selectedIndex;
	}
}


// универсальное создание таблицы
function createTable(array, nameTable, namesColumns, getValues) {
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	var caption = document.createElement("caption");
	caption.appendChild(document.createTextNode(nameTable));
	table.appendChild(caption);
	table.appendChild(tbody);

	// создание шапки с названиями колонок
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
			var values = getValues(obj);
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


