(function (){

	const timers = document.querySelectorAll('.timer-values');
	const timersBoxes = document.querySelectorAll('.section-timer');
	const timeIsOverBoxes = document.querySelectorAll('.section-timer-off');
	const discountProductsCount = document.querySelectorAll('.left-count span');

	discountTimer(timers, timersBoxes, timeIsOverBoxes, discountProductsCount);

	formValidarot();

})();

function discountTimer(timers, timersBoxes, timeIsOverBoxes, discountProductsCount){
	let now = Date.now();
	let endTime = +localStorage.getItem('ltm');
	if (endTime && now > endTime)
		// таймер задан, но просрочен менее 5 минут назад / более 5 минут
		if (endTime + 300 * 1000 > now) return timeIsOver();
		else endTime = null;
	if (!endTime) localStorage.setItem('ltm', endTime = now + rndTime());

	showTime();
	const timerId = setInterval(() => {
		now = Date.now();
		if (now >= endTime) {
			clearInterval(timerId);
			timeIsOver();
		} else showTime();
	}, 1000);

	function rndTime(){
		// задаём случайное значение 19-22 часа, 7-50 мин, 11-42 сек
		let result = ((r(19, 22) * 60 + r(7, 50)) * 60 + r(11, 42)) * 1000;
		// генерим массив времён для discountProductsCount
		let arr = [result + now], n = r(12, 17), t = result;
		for (let i = 0; i < n; i++) {
			let k = Math.round((Math.random() / 4 + 0.25) * t);
			arr.push(k + now);
			t -= k;
		}
		localStorage.setItem('dpc', JSON.stringify(arr));
		return result;
		function r(min, max) {
			return Math.floor(min + Math.random() * (max + 1 - min));
		}
		
	}
	function timeIsOver(){
		timeIsOverBoxes.forEach(div => div.style.display = 'block');
		timersBoxes.forEach(div => div.style.display = 'none');
	}
	function showTime(){
		let s = Math.floor((endTime - now) / 1000);
		let h = Math.trunc(s / 3600);
		s %= 3600;
		let m = Math.trunc(s / 60);
		s %= 60;
		timers.forEach(function (timer){
			timer.children[0].innerText = Math.trunc(h / 10);
			timer.children[1].innerText = h % 10;
			timer.children[2].innerText = Math.trunc(m / 10);
			timer.children[3].innerText = m % 10;
			timer.children[4].innerText = Math.trunc(s / 10);
			timer.children[5].innerText = s % 10;
		});
		showDiscountProductCount();
	}
	function showDiscountProductCount(){
		let count = 0;
		let arr = localStorage.getItem('dpc');
		if (arr) {
			arr = JSON.parse(arr);
			while (arr.length && arr[0] < now) arr.shift();
			localStorage.setItem('dpc', JSON.stringify(arr));
			count = arr.length;
		}
		discountProductsCount.forEach(span => span.innerText = count);
	}
}

function formValidarot(){
	const form = document.querySelector('.order-form form');
	const textInputs = form.querySelectorAll('.js-validation');
	const inputName = form.querySelector('[name="name"]');
	const inputPhone = form.querySelector('[name="phone"]');
	const inputPlace = form.querySelector('[name="place"]');
	const inputPostoffice = form.querySelector('[name="postoffice"]');
	const sizes = form.querySelectorAll('.product-size input');
	const inputSubmit = form.querySelector('[type="submit"]');
	inputPhone.addEventListener('input', function (){
		// только цифры, пробелы, минусы, вначале может быть плюс
		let val = this.value;
		let start = val[0] === '+' ? '+' : '';
		val = val.replace(/[^\d -]/g, '');
		this.value = start + val;
	});
	inputPostoffice.addEventListener('input', function (){
		// только цифры, вначале может быть номер или решетка
		let val = this.value;
		let start = val[0] === '№' || val[0] === '#' ? val[0] : '';
		val = val.replace(/[^\d -]/g, '');
		this.value = start + val;
	});
	textInputs.forEach(input => input.addEventListener('input', checkSubmit));
	sizes.forEach(input => input.addEventListener('change', checkSubmit));

	function checkSubmit(){
		inputSubmit.disabled = !(
				inputName.value.length >= 2
				&&
				inputPhone.value.length >= 7
				&&
				inputPlace.value.length >= 3
				&&
				inputPostoffice.value.length
				&&
				Array.prototype.some.call(sizes, checkbox => checkbox.checked)
			);
	}
	form.addEventListener('submit', function (e){
		e.preventDefault();
		let body = Array.prototype.map.call(textInputs, input => input.name + '=' + encodeURIComponent(input.value)).join('&');
		sizes.forEach(checkbox => { if (checkbox.checked) body += '&' + checkbox.name + '=' + checkbox.value; });
		console.log(body);
		let options = { method: 'POST', body };
		inputSubmit.style.visibility = 'false';
		fetch(form.getAttribute('action'), options)
			.then(response => response.text())
			.then(text => alert(text));
	});
}
