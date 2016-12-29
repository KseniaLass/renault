// main bundle >> main.bundle.js
import ValidForm from './modules/module.validForm';
import autocomplete from './modules/module.autocomplete';
import stringFormat from './modules/module.stringFormat'

$(function() {

    $('body')

    // Show mobile menu
    .on('click', '.js-header-mobile-button', function () {
        $('.wrapper').toggleClass('is-show-menu');
    })

    // Show tabs
    .on('click', '.js-tab-link', function () {
        let $li = $(this),
            $liParent = $li.closest('.js-tabs-list'),
            $liList = $liParent.find('.js-tab-link'),
            dataLink = $li.data('link'),
            $curTabs = $('.js-tab[data-link="' + dataLink + '"]');

        $li.addClass('is-active');
        $liList.not($li).removeClass('is-active');
        $curTabs.addClass('is-active').closest('.js-tabs-content').find('.js-tab').not($curTabs).removeClass('is-active');
        $liParent.toggleClass('open');
    })

    // Open/close modal
    .on('click', '.js-popup-link', function () {
        let $modal = $('.js-modal');

        $modal.addClass('animation-showModal is-on');
        $('.wrapper').addClass('is-show-modal');
        setTimeout(() => $modal.removeClass('animation-showModal'), 500);
    })
    .on('click', '.overlay', function () {
        let $modal = $('.js-modal');

        $modal.addClass('animation-hideModal');
        $('.wrapper').removeClass('is-show-modal');
        setTimeout(() => $modal.removeClass('animation-hideModal is-on'), 450);
    })

    // Form input label
    .on('focus', '.js-form-input', function () {
        let $input = $(this),
            $parent = $input.closest('.form__row');

        $parent.addClass('is-active');
    })
    .on('blur', '.js-form-input', function () {
        let $input = $(this),
            $parent = $input.closest('.form__row'),
            val = $input.val();

        if(val.length == 0) {
            $parent.removeClass('is-active');
        }
    })

    //  Remove error from input
    .on('focus', '.js-form-input', function () {
        $(this).removeClass('animation-shakeError is-error');
    })

    // Simple form validation
    .on('click', '.js-form-submit-btn', function () {
        let valid = new ValidForm({
            'valid': true
        });
    });

    let source = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    let lang = new autocomplete({
        element: $('.js-autocomplete'),
        length: 1,
        source: source,
        filter: 'direct',
        appendTo: $('.autocomplete-menu')
    });
    // StringFormat

    // let stringDigits = new stringFormat({
    //     "element": ".js-stringDigits"
    // });
	//
    // let stringCut = new stringFormat({
    //     "element": ".js-stringCut"
    // });
    // let stringDeclension = new stringFormat({
    //     "element": ".js-stringDeclension"
    // });
    let stringToText = new stringFormat({
        "element": ".js-stringToText"
    });

});