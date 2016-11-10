// main bundle >> main.bundle.js

$(function() {

    $('body')

    // Show mobile menu
    .on('click', '.js-header-mobile-button', function () {
        $('.wrapper').toggleClass('is-show-menu');
    })

    // Show mobile list on tabs
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
        setTimeout(() => $modal.removeClass('animation-hideModal is-on'), 500);
    })

    // Form input label
    .on('focus', '.js-form-input', function () {
        let $input = $(this),
            $parent = $input.closest('.modal__for-row');

        $parent.addClass('is-active');
    })
    .on('blur', '.js-form-input', function () {
        let $input = $(this),
            $parent = $input.closest('.modal__for-row'),
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
    .on('click', '.js-modal-submit-btn', function () {
        let $btn = $(this),
            $modal = $btn.closest('.js-modal'),
            $formContainer = $modal.find('.modal__form-container'),
            $input = $formContainer.find('.js-form-input'),
            error = false;

        $input.each(function () {
            let $curInput = $(this),
                value = $curInput.val();
            if (value.length < 3) {
                $curInput.addClass('animation-shakeError is-error');
                error = true;
            }
        });
        if (!error) {
            $modal.addClass('resault-active').removeClass('form-active')
        }
    })
});