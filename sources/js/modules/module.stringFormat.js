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

		$('body').on('keyup', $(this.el.container).find('input'), (e) => {
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

	__setPhraseIndex(number) {
		var numString = number.toString(),
			lastChar = numString.charAt(numString.length-1),
			titles;
		if (number >= 11 && number <=14){
			titles = 3;
		} else if (lastChar == 1) {
			titles = 1;
		} else if (lastChar >= 2 && lastChar <= 4) {
			titles = 2;
		} else if (lastChar === 0 || lastChar > 5) {
			titles = 3;
		}
		return titles;
	}
	__setNumberSeparate(number) {
		let numString = number.toString(),
			string = numString.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
		return string;
	}


	__setDigits(value) {
		let string = this.__setNumberSeparate(value);
		return string;
		//this.__setResult(string.join(' '));
	}

	__setCut(value) {
		let string = value.slice(0, 14);
		if (string.length < value.length) {
			string += "..."
		}
		return string;
		//this.__setResult(string);
	}

	__setDeclension(value) {
		let index = this.__setPhraseIndex(value),
			phrase = '';
		switch(index) {
			case 1:
				phrase = 'штука';
				break;
			case 2:
				phrase = 'штуки';
				break;
			case 3:
				phrase = 'штук';
				break;
		}
		return phrase;
		//this.__setResult(phrase);
	}

	__setToText(value) {
		var stringArr = [],
			indexArr = [],
			string = '',
			rankStr = this.__setNumberSeparate(value),
			rank = rankStr.split(' '),

			a1 = ['', 'один','два','три','четыре','пять','шесть','семь','восемь','девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
			a2 = ['', 'одна','две','три','четыре','пять','шесть','семь','восемь','девять'],
			a10 = ['одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'],
			a20 = ['', '', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'],
			a100 = ['', 'сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'],
			thousand = ["", "тысяча", "тысячи", "тысяч"],
			million = ["", "миллион", "миллиона", "миллионов"];



			if(value != '') {
				for (let i = 0; i < rank.length; i++) {
					let num = +rank[i],
						first = rank[i].charAt(0),
						sec = rank[i].charAt(1),
						last = rank[i].charAt(rank[i].length - 1);
					indexArr.push(this.__setPhraseIndex(last));
					if(num < 20) {
						stringArr.push(a1[num])
					} else if (num < 99) {
						stringArr.push(`${a20[first]} ${a1[sec]}`)
					} else if (num > 100) {
						stringArr.push(`${a100[first]} ${a20[sec]} ${a1[last]}`)
					}
				}
				if(rank.length === 3) {
					string = `${stringArr[0]} ${million[indexArr[1]]} ${stringArr[1]} ${thousand[indexArr[0]]} ${stringArr[2]}`;
				}
				if(rank.length === 2) {
					string = `${stringArr[0]} ${thousand[indexArr[0]]} ${stringArr[1]}`;
				}
				if(rank.length === 1) {
					string = `${stringArr[0]}`;
				}
			}

		return string;
	}

	__setResult(value, container) {
		$(container).find('.js-result').html(`<strong> ${value}</strong>`);
	}

}
