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