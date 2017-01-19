/**
 * Модуль обработки строк.
 *
 * * * * Вспомогательные методы
 *
 * __setPhraseIndex(number, phrase) - функция склонения существительного. (number) - число. (phrase) - массив существительного в трех склонениях.-> получаем строку со значением. Пример вызова: __setPhraseIndex(1, ['штука', 'штуки','штук']) -> 'штука';
 * __setNumberSeparate(number) - функция разделения по разрядам. (number) - число для преобразования. Пример вызова: __setNumberSeparate(123456) -> '123 456';
 * __setTextDigit(digit, length) - функция перевода числовых значений в слова. (digit) - массив с числом, разбитым на разряды. (gender) - определение рода (true/false). true - женский род. Пример вызова: __setTextDigit(['121', '456'], true) -> ['сто двадцать одна', 'четыреста пятьдесят шесть'];
 * __setArrayDigit(digit) - функция получения готовых строк с буквенным значением. Получаем массив с буквенными значениями из __setTextDigit, подставляем названия разрядов (тысячи, миллионы). (digit) - массив с буквенным обозначением по разрядам (см.__setTextDigit).  Пример вызова: __setArrayDigit(['сто двадцать одна', 'четыреста пятьдесят шесть']) -> 'сто двадцать одна тысяча четыреста пятьдесят шеть';
 *
 * * * * Рабочие методы
 *
 * __setDigits(value) - добавление пробелов между разрядами (см. __setNumberSeparate());
 * __setCut(value) - замена слишком длинных строк "...". (value) -строка, значение;
 * __setDeclension(value) - склонение существительного (см. __setNumberSeparate());
 * __setToText(value) - перевод числового значения в слова. Разбиваем значние на разряды (__setNumberSeparate()), вызываем __setArrayDigit();
 * __setResult(value, container) - вывод результатов. (value) - значение, полученое из рабочих методов;
 *
 */
class stringFormatBase {
	constructor(options) {
		this.options = options;
	}
}
export default class stringFormat extends stringFormatBase {
	constructor(options) {
		super(options);

		this.el = {
			container: options.container || 'Элемент не задан',
			result: options.result || $('body')
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
					if (value.length < 9) {
						string = this.__setToText(value);
					} else {
						this.__setResult('Значение должно быть меньше 9 символов', this.el.container);
						return false;
					}
					break;
			}
			this.__setResult(string, container);
		});
	}

	// Helpers
	__setPhraseIndex(number, phrase) {
		var numString = number.toString(),
			lastChar = numString.substr(numString.length-1),
			twoLast = numString.substr(numString.length-2),
			titles;
		if (twoLast >= 11 && twoLast <=14){
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
	__setTextDigit(digit, gender) {
		let num = +digit,
			words,
			text = {
				a1 : ['', 'один','два','три','четыре','пять','шесть','семь','восемь','девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
				a2 : ['', 'одна','две','три','четыре','пять','шесть','семь','восемь','девять', 'десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'],
				a10 : ['одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'],
				a20 : ['', '', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'],
				a100 : ['', 'сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот']
			},
			first = digit.charAt(digit.length-3),
			sec = digit.charAt(digit.length-2),
			last = digit.charAt(digit.length-1),

			tens;

			if(gender == true) {
				tens = text.a2;
			} else {
				tens = text.a1;
			}

			if(num > 0 && num <= 19) {
				words = `${tens[num]}`;
			} else if (num >= 20 && num < 99) {
				if(last == 0) {
					words = `${text.a20[sec]} ${text.a20[last]}`
				} else {
					words = `${text.a20[sec]} ${tens[last]}`
				}
			} else if (num >= 100) {
				if(sec == 1) {
					words = `${text.a100[first]} ${tens[sec+last]}`
				} else {
					words = `${text.a100[first]} ${text.a20[sec]} ${tens[last]}`
				}
			} else if (num == 0) {
				words = ``;
			}
		return words;
	}
	__setArrayDigit(digit) {
		let phrase,
			thousend,
			million;
		if(digit.length == 1) {
			phrase = `${this.__setTextDigit(digit[0])}`;
		} else if (digit.length == 2) {
			thousend = this.__setPhraseIndex(digit[0], ["тысяча", "тысячи", "тысяч"]);
			phrase = `${this.__setTextDigit(digit[0], true)} ${thousend} ${this.__setTextDigit(digit[1])}`;
		} else if (digit.length == 3) {
			thousend = digit[1] > 0 ? this.__setPhraseIndex(digit[1], ["тысяча", "тысячи", "тысяч"]) : '';
			million = this.__setPhraseIndex(digit[0], ["миллион", "миллиона", "миллионов"]);
			phrase = `${this.__setTextDigit(digit[0])} ${million} ${this.__setTextDigit(digit[1], true)} ${thousend} ${this.__setTextDigit(digit[2])}`
		}
		return phrase;
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
		let index = this.__setPhraseIndex(value, ['штука', 'штуки', 'штук']),
			phrase;
		if (value != '') {
			phrase = `${value} ${index}`;
		} else {
			phrase = '';
		}
		return phrase;
	}
	__setToText(value) {
		let separate = this.__setNumberSeparate(value),
			digit = separate.split(' '),
			phrase = this.__setArrayDigit(digit);
		return phrase;
	}

	__setResult(value) {
		$(this.el.container).find(this.el.result).html(`<strong> ${value}</strong>`);
	}
}
