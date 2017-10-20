class ValidFormBas {
	constructor(options) {
		this.options = options;
	}
}
export default class ValidForm extends ValidFormBas {
	constructor(options) {
		super(options);
		this.el = {
			$container: $('.js-modal'),
			$form: $('.js-form'),
			$input: $('.js-form-input'),
			$validItem: $('[data-validation]'),
			$btn: $('.js-form-submit-btn')
		};
		this.error = this.__valid();
		this.__submit();
	}
	__valid() {
		let error = false,
			self = this;
		this.el.$validItem.each(function() {
			let $curItem = $(this),
				dataItem = $curItem.data('validation'),
				curValue = $curItem.val(),
				$message = $curItem.closest('.form__row').find('.js-form-message');

			switch (dataItem) {
				case 'login':
				if (!self.__isLogin(curValue)) {
					self.__showError($curItem);
					$message.addClass('is-error');
					return (error = true);
					}
					break;
				case 'pass':
					if (!self.__isPassword(curValue)) {
						self.__showError($curItem);
						$message.addClass('is-error');
					return (error = true);
					}
				break;
			default:
					return (error = false);
			}
		});
		return error;
	}
	__isPassword(password) {
		let regExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
		return regExp.test(password);
	}
	__isLogin(login) {
		let regExp = /^[a-zA-Z]+$/;
		return regExp.test(login);
	}
	__showError(item) {
		item.addClass('animation-shakeError is-error');
	}
	__submit() {
		if (this.options['valid'] == true) {
			if (!this.error) {
				this.el.$container
					.addClass('resault-active')
					.removeClass('form-active');
			}
		} else {
			this.el.$container.addClass('resault-active').removeClass('form-active');
		}
	}
}
