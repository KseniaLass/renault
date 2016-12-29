class stringFormatBase {
	constructor(options) {
		this.options = options;
	}
}
export default class stringFormat extends stringFormatBase {
	constructor(options) {
		super(options);
		this.el = {
			$container: options.element || 'Элемент не задан'
		};

		this.input = this.el.$container.find('.js-input');
		this.result = this.el.$container.find('.js-result');

		$('body').on('keyup', this.input, (e) => {
			let method = $(e.target).data('method'),
				type = $(e.target).attr('type');
				switch(method) {
					case 'digits':
						this.__setDigits();
						break;
					case 'cut':
						this.__setCut();
						break;
					case 'declension':
						this.__setDeclension();
						break;
					case 'toText':
						this.__setToText();
						break;
				}
		});
	}

	__setDigits() {
		let inputValue = this.input.val(),
			string = inputValue.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
		this.__setResult(string);
	}

	__setCut() {
		let inputValue = this.input.val(),
			string = inputValue.slice(0, 14);
		if (string.length < inputValue.length) {
			string += "..."
		}
		this.__setResult(string);
	}
	__setDeclension() {
		let inputValue = this.input.val(),
			num = +inputValue,
			last = +inputValue.charAt(inputValue.length - 1),
			word,
			phrase = `${inputValue}  ${word}`;
		if (num >= 11 && num <= 14){
			word = 'штук';
		} else if (num === 1 || last === 1) {
			word = 'штука';
		} else if (last >= 2 && last <= 4) {
			word = 'штуки';
		} else {
			word = 'штук';
		}
		this.__setResult(phrase);
	}
	__setToText() {
		var valueStr = this.input.val(),
			valueNum = +valueStr,
			valueArr = (""+valueStr).split(""),
			valueStrLen = valueStr.length,
			string = '',

			a1 = ['', 'один','два','три','четыре','пять','шесть','семь','восемь','девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
			a2 = ['', 'одна','две','три','четыре','пять','шесть','семь','восемь','девять'],
			a10 = ['одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'],
			a20 = ['', '', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'],
			a100 = ['', 'сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'],

			unit = a1[valueArr[valueStr.length-1]], //переделать в сабстринг?
			decade = a20[valueArr[valueStr.length-2]],
			hundred = a100[valueArr[valueStr.length-3]],
			thousand = valueStrLen === 4 ? a1[valueArr[valueStrLen-4]],
			million = a1[valueArr[valueStr.length-5]];

		if(valueNum < 20) {
			string = a1[valueNum];
		} else if (valueStrLen === 2) {
			string = `${decade} ${unit}`;
		} else if (valueStrLen === 3) {
			string = `${hundred} ${decade} ${unit}`;
		} else if (valueStrLen === 4) {
			string = `${thousand} тысяча ${hundred} ${decade} ${unit}`;
		} else if (valueStrLen === 5) {
			string = `${thousand} тысяч ${hundred} ${decade} ${unit}`;
		}

		// if(num < 10) { //0-9
		// 	string = a1[num];
		// } else if (num >= 10 && num < 20) {//10-19
		// 	string = a10[inputValue.charAt(inputValue.length - 1)]
		// } else if (num > 20 && num < 100) {//20-99
		// 	string = `${a20[digits[0]]} ${a1[digits[1]]}`
		// } else if (num >= 100 && num < 1000) {//100-999
		// 	string = `${a100[digits[0]]} ${a20[digits[1]]} ${a1[digits[2]]}`
		// } else if (num >= 1000 && num < 2000) {//1000-1999
		// 	string = `${a2[digits[0]]} тысяча ${a100[digits[1]]} ${a20[digits[2]]} ${a1[digits[3]]}`
		// } else if (num >= 2000 && num < 5000) {//2000-4999
		// 	string = `${a2[digits[0]]} тысячи ${a100[digits[1]]} ${a20[digits[2]]} ${a1[digits[3]]}`
		// } else if (num >= 5000 && num < 10000) {//5000-9999
		// 	string = `${a2[digits[0]]} тысяч ${a100[digits[1]]} ${a20[digits[2]]} ${a1[digits[3]]}`
		// }

		this.__setResult(string);
	}

	__setResult(value) {
		this.result.html(`<strong> ${value}</strong>`);
	}

}
