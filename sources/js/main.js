// main bundle >> main.bundle.js

console.log('ok')


// Show mobile menu

$(document).on('click','.mobile-button', (e) => {
    $('.wrapper').toggleClass('show-menu');
});

// Show mobile list on collection

function collectionList() => {
    $('.tabs ul').toggleClass('open');
    console.log('fff')
}

$(document).on('click', '.tabs ul li.active', (e) => {
    collectionList();
})

// Change tabs on collection

$(document).on('click', '.tabs ul li', (e) => {
    let li = $(e.target).closest('li'),
        li_list = $(li).siblings('li'),
        li_first = li_list[0];

    if (!$(li).hasClass('active')) {
        $(li).addClass('active').siblings('li').removeClass('active');
        collectionList();

        if ($(window).width() < 1024) {
            $(li).insertBefore($(li_first));
        }
    }


})