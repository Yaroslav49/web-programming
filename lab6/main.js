/* 

Создать программу, для выполнения задачи по вариантам ниже. При формировании массивов
предусмотреть возможность задавать размеры массива и переменных, необходимых по заданию,
значения свойств объектов задавать случайным образом. Предусмотреть вывод на экран всех
промежуточных результатов работы, а также возможность сериализации массива объектов и
загрузки массива в формате JSON.

Описать массив объектов и поместить в него сгенерированные сведения о N работниках.
Предусмотреть такие сведения как ФИО работника (отдельным объектом), дата
рождения (отдельный объект), номер цеха, трудовая информация (отдельный объект со
сведениями о должности, разряде, стаже). 

Написать функцию выдачи списка работников по должности, разряду или диапазону стажа.
Написать функцию удаления сведений о дате рождения, если стаж менее заданного числа.
Написать функцию добавления информации о возрасте работника, найденного по году рождения.

*/

// функции для объектов

function getFIO() {
	return `${this.surname} ${this.name} ${this.patronymic}`;
}

function getDateBirth() {
	var formatStr = (num) => num.toString().padStart(2, '0');
	return `${formatStr(this.day) }.${formatStr(this.month)}.${this.year}`;
}

function getYearsStr(years) {
    const lastDigit = years % 10;
    const remainderHundreds = years % 100;
    
    if (lastDigit === 1 && remainderHundreds !== 11)
		return `${years} год`;
    else if ((lastDigit >= 2 && lastDigit <= 4) && !(remainderHundreds >= 12 && remainderHundreds <= 14))
		return `${years} года`;
    else 
		return `${years} лет`;
}

function getExperience() {
	const years = this.experience;
    return getYearsStr(years);
}

// генерация объектов

function makeDeepCopy(obj) {
	var copy = {};
	for(var key in obj)
	{
		if(typeof obj[key] != "object")
			copy[key] = obj[key];
		else
			copy[key] = makeDeepCopy(obj[key]);
	}	
	return copy;
}

function copyArrayObjects(array) {
	return array.map(obj => makeDeepCopy(obj));
}

function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randomBetween(start, end) {
	return start + Math.floor(Math.random() * (end - start + 1));
}

function generateFIO() {
	var gender = Math.floor(Math.random() * 2);
	var names = [
		["Ярослав", "Олег", "Николай", "Вадим", "Иван", "Андрей"], 
		["Ольга", "Анастасия", "Дарья", "Алиса", "Екатерина", "Александра"]
	];
	var surnames = [
		["Иванов", "Петров", "Кузьмин", "Николаев", "Морозов", "Пирогов", "Куличев", "Гаранин", "Зеленин"], 
		[]
	];
	surnames[1] = surnames[0].map(surname => surname + 'а');
	var patronymics = [
		["Андреевич", "Алексеевич", "Александрович", "Владимирович", "Сергеевич", "Иванович", "Петрович", "Дмитриевич"],
		["Андреевна", "Алексеевна", "Александровна", "Владимировна", "Сергеевна", "Ивановна", "Петровна", "Дмитриевна"]
	]
	return {
		name: randomElement(names[gender]),
		surname: randomElement(surnames[gender]),
		patronymic: randomElement(patronymics[gender]),
		toString: getFIO
	}
}

function generateDateBirth() {
	return {
		day: randomBetween(1, 28),
		month: randomBetween(1, 12),
		year: randomBetween(1960, 2006),
		toString: getDateBirth
	}
}

function generateLaborInfo(age) {
	const posts = ["Электромонтёр", "Машинист крана", "Каменщик", "Штукатур-маляр", "Слесарь-ремонтник", "Плотник", "Водитель"];
	return {
		post: randomElement(posts),
		category: randomBetween(1, 8),
		experience: randomBetween(0, age-18),
		getExperience
	}
}

function generateWorker() {
	const dateBirth = generateDateBirth();
	const age = new Date().getFullYear() - dateBirth.year;
	return {
		fio: generateFIO(),
		dateBirth,
		workshop: randomBetween(1, 12),
		laborInfo: generateLaborInfo(age)
	}
}

function generatArrayWorkers(n) {
	var array = new Array(n);
	for (var i = 0; i < n; ++i) {
		array[i] = generateWorker();
	}
	return array;
}

// графика

function showTab(tabButton, tabId) {
	// Скрыть все вкладки
	const tabs = tabButton.parentNode.parentNode.getElementsByClassName('tab');
	for (var i = 0; i < tabs.length; ++i) {
		tabs[i].style.display = 'none';
	}

	// Убрать активный класс у всех кнопок
	const buttons = tabButton.parentNode.getElementsByClassName('tab-button');
	for (var i = 0; i < buttons.length; ++i) {
		buttons[i].classList.remove('active');
	}

	// Показать выбранную вкладку и установить активный класс
	document.getElementById(tabId).style.display = 'flex';
	tabButton.classList.add('active');
}

function createTable(array, nameTable, hasAge) {
	var table = document.createElement("table");
	var tbody = document.createElement("tbody");
	var caption = document.createElement("caption");
	caption.appendChild(document.createTextNode(nameTable));
	table.appendChild(caption);
	table.appendChild(tbody);

	// создание шапки с названиями колонок
	var namesColumns = ["ФИО", "Дата рождения", "Номер цеха", "Должность", "Разряд", "Стаж"];
	if (hasAge) {
		namesColumns.push("Возраст");
	}
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
		(worker) => {
			var row = document.createElement("tr");
			var values = [
				worker.fio.toString(),
				worker.dateBirth ? worker.dateBirth.toString() : '',
				worker.workshop,
				worker.laborInfo.post,
				worker.laborInfo.category,
				worker.laborInfo.getExperience(),
			]
			if (hasAge) {
				values.push(worker.age ? getYearsStr(worker.age) : '')
			}
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

function onLoadPage() {
	[
		"tab-load-array", "tab-find-by-category", "tab-find-by-experience",
	].forEach(
		id => {
			document.getElementById(id).style.display = 'none';
		}
	)
	clearAll();
}

function clearAll() {
	[
		"result-creating-array", "json-out", "result-creating-array-from-json",
		"find-form", "search-by-post-array",
		"delete-form", "add-form",
		"error-generating", "error-loading",
	].forEach(
		id => {
			document.getElementById(id).style.display = 'none';
		}
	)
}

var workers; // список работников

// генерирует список работников
function generateArray() {
	document.getElementById("tab-load-array").style.display = 'none';
	clearAll();

	// получение входных данных
	var n = Number.parseInt(document.getElementById('n').value);
	if (!isFinite(n) || n <= 0) {
		var error = document.getElementById("error-generating");
		error.textContent = 'Ошибка: введите целое положительное число для размера массива';
		error.style.display = 'block';
		return
	}

	workers = generatArrayWorkers(n);
	document.getElementById("result-creating-array").style.display = "flex";
	const table = document.getElementById("original-array");
	table.innerHTML = '';
	table.appendChild(createTable(workers, "Список работников"));
	document.getElementById("find-form").style.display = "flex";
	document.getElementById("delete-form").style.display = "flex";
	document.getElementById("add-form").style.display = "flex";
}

// сериализует список работников
function serializeArray() {
	const str = JSON.stringify(workers,null,4);
	const textarea = document.getElementById("json-out");
	textarea.style.display = "block";
	textarea.textContent = str;
}

function checkArrayFromJSON(array) {
	if (!array || !Array.isArray(array) || array.length == 0) {
		return false;
	}
	for (var i = 0; i < array.length; i++) {
		let worker = array[i];
		if ("fio" in worker && "surname" in worker.fio && "name" in worker.fio && "patronymic" in worker.fio) {
			worker.fio.toString = getFIO;
		} else {
			return false;
		}
		if ("dateBirth" in worker && "day" in worker.dateBirth && "month" in worker.dateBirth && "year" in worker.dateBirth) {
			worker.dateBirth.toString = getDateBirth;
		} else {
			return false;
		}
		if (!("workshop" in worker)) {
			return false;
		}
		if ("laborInfo" in worker && "post" in worker.laborInfo && "category" in worker.laborInfo && "experience" in worker.laborInfo) {
			worker.laborInfo.getExperience = getExperience;
		} else {
			return false;
		}
	}
	return true;
}

// создаёт список работников
function loadArrayFromJSON() {
	document.getElementById("tab-generate-array").style.display = 'none';
	clearAll();
	const str = document.getElementById("json-in").value;

	var error = document.getElementById("error-loading");
	error.textContent = '';
	error.style.display = 'none';

	var array = null;
	try {
		array = JSON.parse(str);
	} catch {};
	if (!checkArrayFromJSON(array)) {
		error.textContent = 'Ошибка: проверьте правильность JSON-строки';
		error.style.display = 'block';
		return
	}

	workers = array;
	const table = document.getElementById("result-creating-array-from-json");
	table.style.display = "flex";
	table.innerHTML = '';
	table.appendChild(createTable(workers, "Список работников"));
	document.getElementById("find-form").style.display = "flex";
	document.getElementById("delete-form").style.display = "flex";
	document.getElementById("add-form").style.display = "flex";
}

// находит работников по должности
function findWorkersByPost() {
	const result = document.getElementById("search-by-post-array");
	result.style.display = "flex";
	result.innerHTML = '';
	if (!workers || !Array.isArray(workers) || workers.length == 0) {
		result.textContent = "Ошибка: список работников пуст";
		return
	}
	const post = document.getElementById("post").value;
	if (post.trim() === '') {
		result.textContent = "Ошибка: введите должность для поиска";
		return
	}
	var array = workers.filter(worker => worker.laborInfo.post === post);
	if (array.length == 0) {
		result.textContent = "Работников с такой должностью не найдено";
		return
	}
	result.appendChild(createTable(array, `Список работников с должностью ${post}`));
}

// находит работников по разряду
function findWorkersByCategory() {
	const result = document.getElementById("search-by-category-array");
	result.style.display = "flex";
	result.innerHTML = '';
	if (!workers || !Array.isArray(workers) || workers.length == 0) {
		result.textContent = "Ошибка: список работников пуст";
		return
	}
	const category = parseInt(document.getElementById("category").value);
	var array = workers.filter(worker => worker.laborInfo.category === category);
	if (array.length == 0) {
		result.textContent = "Работников с таким разрядом не найдено";
		return
	}
	result.appendChild(createTable(array, "Список работников с нужным разрядом"));
}

// находит работников по диапазону стажа
function findWorkersByExperience() {
	const result = document.getElementById("search-by-experience-array");
	result.style.display = "flex";
	result.innerHTML = '';
	if (!workers || !Array.isArray(workers) || workers.length == 0) {
		result.textContent = "Ошибка: список работников пуст";
		return
	}
	var startExperience = parseInt(document.getElementById("start-experience").value);
	var endExperience = parseInt(document.getElementById("end-experience").value);
	if (!isFinite(startExperience) || !isFinite(endExperience) || startExperience < 0 || endExperience < 0) {
		result.textContent = "Ошибка: введите корректный стаж";
		return
	}
	if (startExperience > endExperience) {
		let buf = startExperience;
		startExperience = endExperience;
		endExperience = buf;
	}
	var array = workers.filter(worker => 
		worker.laborInfo.experience >= startExperience && 
		worker.laborInfo.experience <= endExperience);
	if (array.length == 0) {
		result.textContent = "Работников с таким стажем не найдено";
		return
	}
	result.appendChild(createTable(array, "Список работников с нужным стажем"));
}

// удаляет дату рождения, если стаж меньше заданного числа
function deleteWorkersDateBirth() {
	const result = document.getElementById("deleting-array");
	result.style.display = "flex";
	result.innerHTML = '';
	if (!workers || !Array.isArray(workers) || workers.length == 0) {
		result.textContent = "Ошибка: список работников пуст";
		return
	}
	const minExperience = parseInt(document.getElementById("min-experience").value);
	if (!isFinite(minExperience) || minExperience < 0) {
		result.textContent = "Ошибка: укажите корректный стаж";
		return
	}
	var newWorkers = copyArrayObjects(workers);
	newWorkers.forEach(
		worker => {
			if (worker.laborInfo.experience < minExperience) {
				delete worker.dateBirth;
			}
		}
	)
	result.appendChild(createTable(newWorkers, "Список работников после удаления"));
}

// добавляет информацию о возрасте сотрудникам с заданным годом рождения
function addWorkersAge() {
	const result = document.getElementById("editting-array");
	result.style.display = "flex";
	result.innerHTML = '';
	if (!workers || !Array.isArray(workers) || workers.length == 0) {
		result.textContent = "Ошибка: список работников пуст";
		return
	}
	const year = parseInt(document.getElementById("year").value);
	if (!isFinite(year) || year < 1900 || year > 2025) {
		result.textContent = "Ошибка: укажите корректный год рождения";
		return
	}
	var newWorkers = copyArrayObjects(workers);
	newWorkers.forEach(
		worker => {
			if (worker.dateBirth.year === year) {
				let dateBirth = new Date();
				let today = new Date();
				dateBirth.setFullYear(today.getFullYear());
				dateBirth.setMonth(worker.dateBirth.month - 1);
				dateBirth.setDate(worker.dateBirth.day);
				let age = today.getFullYear() - year - 1;
				if (today >= dateBirth) {
					age += 1;
				}
				worker.age = age;
			}
		}
	)
	result.appendChild(createTable(newWorkers, "Список работников после добавления возраста", true));
}
