function goToPage(target) {
    location.href = `/${target}`;
}

function showPopup(title, context, callback) {
    $('#global-popup .popup-box .popup-title').html(title);
    $('#global-popup .popup-box .popup-context').html(context);

    $('#global-popup .popup-box .popup-footer .popup-submit').one(
        'click',
        function () {
            let inputs = document.getElementsByTagName('input');
            let values = new Array();
            for (let input of inputs) {
                values.push(input.value);
            }
            callback(values);
        }
    );
    $('#global-popup .popup-box .popup-footer .popup-cancel').one(
        'click',
        function () {
            hidePopup();
        }
    );

    if ($('#global-popup').css('display') === 'none') $('#global-popup').show();
}

function hidePopup() {
    if ($('#global-popup').css('display') !== 'none') $('#global-popup').hide();
}

$('#popup-user').hide();

$('.site-header .site-logo').on('click', function () {
    self.location.href = '/';
});

$('#user-popup').on('click', function () {
    if ($('#popup-user').css('display') === 'none') $('#popup-user').show();
    else $('#popup-user').hide();
});

if ($('.site-header #login').attr('href'))
    $('.site-header #login').attr(
        'href',
        `${$('.site-header #login').attr('href')}?redirect=${
            window.location.pathname
        }`
    );

if ($('#popup-user #logout').attr('href'))
    $('#popup-user #logout').attr(
        'href',
        `${$('#popup-user #logout').attr('href')}?redirect=${
            window.location.pathname
        }`
    );
