// main bundle >> main.bundle.js

// Show mobile menu
$(function() {
    $('.mobile-button').on('click', () => {
        $('.wrapper').toggleClass('show-menu');
    });
});

// Show mobile list on tabs
$(function() {
    $('.tabs ul li').on('click', (e) => {
        let li = $(e.target).closest('li'),
            li_list = $(li).siblings('li'),
            li_first = li_list[0],
            data_link = $(li).data('link');

        $(li).addClass('active').siblings('li').removeClass('active');
        $('.tab[data-link="'+data_link+'"]').addClass('active').siblings().removeClass('active');
        $('.tabs ul').toggleClass('open');
        if ($(window).width() < 1024) {
            $(li).insertBefore($(li_first));
        }
    })
});

// Form input
$(function() {
   $('.for-input input').on('focus', (e) => {
       let input = $(e.target),
           parent = $(input).closest('.for-input');
       $(parent).addClass('active');
   });
    $('.for-input input').on('blur', (e) => {
        let input = $(e.target),
            parent = $(input).closest('.for-input'),
            label = $(parent).find('label'),
            val = $(input).val();
        if(val.length == 0) {
            $(parent).removeClass('active');
        }
    });
});

// Open/close modal
$(function() {
    $('.popup-link').on('click', (e) => {
        let modal = $('.modal'),
            overlay = $('.overlay');
        $(modal).addClass('showModal on');
        $('.wrapper').addClass('show-modal');
        setTimeout(() => $(modal).removeClass('showModal'), 500);
    });
    $('.overlay').on('click', (e) => {
        let modal = $('.modal'),
            overlay = $('.overlay');
        $(modal).addClass('hideModal');
        $('.wrapper').removeClass('show-modal');
        setTimeout(() => $(modal).removeClass('hideModal on'), 500);
    });
});

// Form validation
$(function(){
    let removEr = () => {
        $('input').focus(function(){
            $(this).removeClass('shakeError error');
        });
    };
    $('.reg-form').on('submit', (e) => {
        let form = $(e.target),
            login = $(form).find('input[name="login"]'),
            pass = $(form).find('input[name="pass"]'),
            error = false;

        if(login.val().length < 3) {
            $(login).addClass('shakeError error');
            removEr();
            error = true;
        }
        if(pass.val().length < 3) {
            $(pass).addClass('shakeError error');
            removEr();
            error = true;
        }
        if (error) {
            console.log('err')
            return false;
        } else {
            console.log('ok')
        }
    })
})