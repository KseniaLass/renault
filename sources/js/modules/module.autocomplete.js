class autocompleteBase {
	constructor(options) {
		this.options = {
			element: options.element,
			length: 0,
			source: '',
			filter: 'direct',
			appendTo: '',
			menuItem: ''
		};
	}
}
export default class autocomplete extends autocompleteBase {
	constructor(options) {
		super(options);

		this.param = $.extend({}, this.options, options);

		let $autoInput = this.param.element,
			length = this.param.length,
			source = this.param.source,
			filter = this.param.filter;

		$autoInput.on('keyup', e => {
			if ($autoInput.val().length >= length && e.which !== 16) {
				this.__clearResault($autoInput.val());
				this.__filterArray($autoInput.val(), source, filter);
			} else if ($autoInput.val().length == 0) {
				this.__clearResault($autoInput.val());
				this.__hideMenu();
			}
		});
		$('body').on('click', e => {
			if (!$autoInput.is(e.target)) {
				this.__hideMenu();
			} else {
				this.__showMenu();
			}
		});
	}
	__filterArray(value, source, filter) {
		let curVal = value,
			curFilter = filter;
		$.each(source, (index, value) => {
			let reg;
			if (curFilter == 'direct') {
				reg = value.match(new RegExp('^' + curVal, 'i'));
			} else {
				reg = value.match(new RegExp(curVal, 'i'));
			}
			if (reg) {
				this.__appendToHtml(reg.input);
			}
		});
	}
	__appendToHtml(value) {
		let $append = this.param.appendTo,
			markup = `<span class="autocomplete-item" value="${value}">${value}</span>`;
		$append.addClass('is-active').append(markup);
		$('.autocomplete-item').on('click', e => {
			this.param.element.val($(e.target).text());
			this.__hideMenu();
		});
	}
	__clearResault() {
		this.param.appendTo.find($('.autocomplete-item')).remove();
	}
	__hideMenu() {
		this.param.appendTo.removeClass('is-active');
	}
	__showMenu() {
		this.param.appendTo.addClass('is-active');
	}
}
