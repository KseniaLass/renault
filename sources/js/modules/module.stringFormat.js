class stringFormatBase {
	constructor(options) {
		this.options = options;
	}
}
export default class stringFormat extends stringFormatBase {
	constructor(options) {
		super(options);

		this.el = {
			container: options.element || 'Элемент не задан'
		};

		this.$input = $(this.el.container).find('input');

		this.$input.on('keyup' , (e) => {
			let container = $(e.target).closest(this.el.container),
				value = $(e.target).val(),
				method = $(e.target).data('method'),
				string = '';
			switch(method) {
				case 'digits':
					string = this.__setDigits(value);
					break;
				case 'cut':
					string = this.__setCut(value);
					break;
				case 'declension':
					string = this.__setDeclension(value);
					break;
				case 'toText':
					string = this.__setToText(value);
					break;
			}
			this.__setResult(string, container);
		});
	}

	// Helpers
	__setPhraseIndex(number, phrase) {
		var numString = number.toString(),
			lastChar = numString.charAt(numString.length-1),
			titles;
		if (number >= 11 && number <=14){
			titles = phrase[2];
		} else if (lastChar == 1) {
			titles = phrase[0];
		} else if (lastChar >= 2 && lastChar <= 4) {
			titles = phrase[1];
		} else if (lastChar == 0 || lastChar >= 5) {
			titles = phrase[2];
		}
		return titles;
	}
	__setNumberSeparate(number) {
		let numString = number.toString(),
			string = numString.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
		return string;
	}
	__setTextDigit(digit, length) {
		let num = +digit,
			words,
			text = {
				a1 : ['', 'один','два','три','четыре','пять','шесть','семь','восемь','девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
				a2 : ['', 'одна','две'],
				a10 : ['одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'],
				a20 : ['', '', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'],
				a100 : ['', 'сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот']
			},
			first = digit.charAt(0),
			sec = digit.charAt(1),
			last = digit.charAt(digit.length - 1);

		if(num <= 19) {
			if((length == 2) && (num == 1 || num == 2)) {
				words = `${text.a2[num]}`;
			} else {
				words = `${text.a1[num]}`;
			}
		} else if (num >= 20 && num < 99) {
			words = `${text.a20[first]} ${text.a1[sec]}`
		} else if (num >= 100) {
			if(sec == 1) {
				words = `${text.a100[first]} ${text.a1[sec+last]}`
			} else {
				words = `${text.a100[first]} ${text.a20[sec]} ${text.a1[last]}`
			}
		} else if (num == 0) {
			words = ``;
		}
		return words;
	}

	//Work methods
	__setDigits(value) {
		let string = this.__setNumberSeparate(value);
		return string;
	}
	__setCut(value) {
		let string = value.slice(0, 14);
		if (string.length < value.length) {
			string += "..."
		}
		return string;
	}
	__setDeclension(value) {
		let index = this.__setPhraseIndex(value, ['штука', 'штуки','штук']);
		return `${value} ${index}`;
	}
	__setToText(value) {
		let separate = this.__setNumberSeparate(value),
			digit = separate.split(' '),
			result = [],
			phrase = '',
			thousend,
			million;
		for(let i = 0; i <digit.length; i++) {
			result.push(this.__setTextDigit(digit[i], digit.length));
			if(digit.length == 2) {
				thousend = this.__setPhraseIndex(digit[0], ["тысяча", "тысячи", "тысяч"]);
				phrase = `${result[0]} ${thousend} ${result[1]}`
			} else if (digit.length == 3) {
				thousend = this.__setPhraseIndex(digit[1], ["тысяча", "тысячи", "тысяч"]),
				million = this.__setPhraseIndex(digit[0], ["миллион", "миллиона", "миллионов"]);
				if(result[1] == '') {
					phrase = `${result[0]} ${million} ${result[1]} ${result[2]}`;
				} else {
					phrase = `${result[0]} ${million} ${result[1]} ${thousend} ${result[2]}`;
				}
			} else {
				phrase = result[0]
			}
		}
		return phrase;
	}

	__setResult(value, container) {
		$(container).find('.js-result').html(`<strong> ${value}</strong>`);
	}

}
