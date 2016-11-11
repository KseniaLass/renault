class validFormBas {
	constructor(options) {
		this.options = options;
	}
}
export default class validForm extends validFormBas {
	constructor(options) {
		super(options);
		this.el = {
			$container: $('.js-modal'),
			$form: $('.js-form'),
			$input: $('.js-form-input'),
			$btn: $('.js-form-submit-btn')
		};
		this.error = this.__valid();
		this.__submit();
	}
	__valid() {
		let error = false;
		this.el.$input.each(function() {
			let $curInput = $(this),
				value = $curInput.val();
			if (value.length < 3) {
				$curInput.addClass('animation-shakeError is-error');
				return error = true;
			}
		});
		return error;
	}
	__submit() {
		if(this.options['valid'] == true) {
			if (!this.error) {
				this.el.$container.addClass('resault-active').removeClass('form-active')
			}
		} else {
			this.el.$container.addClass('resault-active').removeClass('form-active')
		}
	}
}