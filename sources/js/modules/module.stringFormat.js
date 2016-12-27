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
		let inputValue = this.input.val(),
			num = +inputValue,
			string,
			a1 = ['', 'один','два','три','четыре','пять','шесть','семь','восемь','девять'],
			a2 = ['', 'одна','две','три','четыре','пять','шесть','семь','восемь','девять'],
			a10 = ['десять','одиннадцать','двенадцать','тринадцать','четырнадцать','пятнадцать','шестнадцать','семнадцать','восемнадцать','девятнадцать'],
			a20 = ['', 'двадцать','тридцать','сорок','пятьдесят','шестьдесят','семьдесят','восемьдесят','девяносто'],
			a100 = ['', 'сто','двести','триста','четыреста','пятьсот','шестьсот','семьсот','восемьсот','девятьсот'];

			//digits = (""+inputValue).split("");

		if(num < 10) {
			string = a1[num];
		} else if (num > 10 && num < 20) {
			string = a10[inputValue.charAt(inputValue.length - 1)]
		}

		this.__setResult(string);
	}

	__setResult(value) {
		this.result.html(`<strong> ${value}</strong>`);
	}

}
