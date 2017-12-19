// main bundle >> main.bundle.js


$(document).ready(function(){
	// Selectbox
	$('.js-dropdown').click(function(e){
		e.stopPropagation();
		//e.preventDefault();
		var $list = $(this).closest('.selectbox').find('.selectbox__dropdown');
		$(this).closest('.form__row').removeClass('error');
		if($(this).hasClass('is-open')) {
			$list.removeClass('is-active');
			$(this).removeClass('is-open');
		} else {
			$list.addClass('is-active');
			$(this).addClass('is-open');
		}

	});
	$('body').click(function(e){
		$('.selectbox__dropdown').removeClass('is-active');
		$('.js-dropdown').removeClass('is-open');
	});
	$('.selectbox__dropdown').click(function(e){
		e.stopPropagation();
		var value = $(e.target).text();
		var id = $(e.target).data('salon');
		var $input = $(this).closest('.selectbox').find('.selectbox__input');
		$input.text(value).attr('data-salon', id);
		$(this).removeClass('is-active');

		var tabs = $(this).data('tabs');

		if(tabs === 'contacts') {
			var target = $(e.target).data('target');
			$('.contacts__addr').removeClass('is-active');
			$('.contacts__form').find(target).addClass('is-active');
		}

	});

	// Input label
	$('input[type="tel"]').focus(function(e){
		$(this).closest('.form__row').removeClass('error');
		$(this).closest('.form__input').addClass('is-focus');
	});
	$('input[type="tel"]').blur(function(e){
		if($(this).val().length === 0 || $(this).val() === '+7 (___) ___-__-__') {
			$(this).closest('.form__input').removeClass('is-focus');
		}
	});

	//Masked Input
	$('input[type="tel"]').mask('+7 (999) 999-99-99',{autoclear: false});

	//Video tabs
	$('.js-video-tabs').click(function(e){
		e.preventDefault();
		var target = $(this).data('video');
		$('.js-video-tabs').removeClass('is-active');
		$(this).addClass('is-active');
		$('#video').attr('src', 'https://www.youtube.com/embed/'+target);
	});

	// Popup
	$('.js-close-popup').click(function(e) {
		e.preventDefault();
		$('.popup').removeClass('is-active');
		$('html, body').css('overflow', 'auto');
	});
	$('.js-open-popup').click(function(e){
		e.preventDefault();
	   var popup = $(this).data('popup');
		showPopup(popup);
	});

	// Maps
	ymaps.ready(init);
	var myMap,
		myPlacemark;
	function init() {
		myMap = new ymaps.Map('map', {
			center: [59.952529, 30.374233],
			zoom: 9
		});
		var coords = {
			'leninsky': { ballon: 'Ленинский пр., 101, к. 3', coord: [59.850988, 30.224321]},
			'rustavely': { ballon: 'ул. Руставели, д. 31, корп. 3', coord: [60.008378, 30.436575]},
			'sof': { ballon: 'ул. Софийская, 87', coord: [59.844981, 30.430035]}
		};

		var myCollections = new ymaps.GeoObjectCollection(null,{});

		for(var prop in coords) {
			//yellowCollection.add(new ymaps.Placemark(yellowCoords[i]));
			myCollections.add(new ymaps.Placemark(coords[prop].coord,
				{
					hintContent: 'ПЕТРОВСКИЙ АВТОЦЕНТР',
					balloonContent: coords[prop].ballon
				},
				{
					iconLayout: 'default#image',
					iconImageHref: '../img/logomap.png',
					iconImageSize: [40, 40]
				})
			)

		}

		myMap.geoObjects.add(myCollections);
		myMap.controls.remove('rulerControl');
		myMap.controls.remove('searchControl');
		myMap.controls.remove('trafficControl');
		myMap.controls.remove('layoutControl');
		//myMap.behaviors.disable('scrollZoom');
	}
	function showPopup(popup) {
		$('.popup').removeClass('is-active');
		$('#'+popup).addClass('is-active');
		$('html, body').css('overflow', 'hidden');
	}

	// Ajax

	$('.js-ajax').submit(function(e){
		e.preventDefault();
		var $salon = $(this).find('.selectbox__input'),
			salonValue = $salon.text(),
			salonID = $salon.attr('data-salon');

		var $phone = $(this).find('input[name="phone"]'),
			phoneValue = $phone.val();

		var form = $(this).find('input[name="form"]').val();

		var error;

		if (salonValue === 'Выберите салон' || salonValue === '') {
			$salon.closest('.form__row').addClass('error');
			error = true;
		}
		if (phoneValue === '+7 (___) ___-__-__' || phoneValue === '') {
			$phone.closest('.form__row').addClass('error');
			error = true;
		}
		if(error) {
			return false;
		}

		var data = {
			salon: salonValue,
			phone: phoneValue,
			form: form,
			id: salonID
		};

		$.ajax({
			type: "POST",
			url: 'mail.php',
			data: data,
			success: function success(data) {
				if (data == 'ok') {
					showPopup('success-popup');
					$('input[type="tel"]').val('').trigger('blur');
				}
			},
			error: function error() {
				showPopup('fail-popup');
				$('input[type="tel"]').val('').trigger('blur');
			}
		});

	})

});
