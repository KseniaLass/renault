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
		} else if (lastChar === 0 || lastChar >= 5) {
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
		let phrase,
			num = +digit,
			words,
			//unit,
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
		} else if (num > 100) {
			if(sec == 1) {
				words = `${text.a100[first]} ${text.a1[sec+last]}`
			} else {
				words = `${text.a100[first]} ${text.a20[sec]} ${text.a1[last]}`
			}
		}
		return words;
	}

	__setGenderIndex(index, phrase) {

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
		var string = '',
			textArr = [],
			rankStr = this.__setNumberSeparate(value),
			rank = rankStr.split(' '),
			num = +rank,
			thousend,
			million,
			unit = '';
		if(value != '') {
			for (let i = 0; i < rank.length; i++) {
				let num = +rank;
				textArr.push(this.__setTextDigit(rank[i], rank.length));
			}
		}
		if(textArr.length == 2) {
			thousend = this.__setPhraseIndex(rank, ["тысяча", "тысячи", "тысяч"]);
			textArr.splice(0, 0, thousend);
		} else if(length == 3) {
			million = this.__setPhraseIndex(rank, ["миллион", "миллиона", "миллионов"]);
			textArr.splice(1, 0, million);
		}
		console.log(textArr)
		return string;
	}

	__setResult(value, container) {
		$(container).find('.js-result').html(`<strong> ${value}</strong>`);
	}

}
