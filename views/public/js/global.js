function goToPage(target) {
    location.href = `/${target}`;
}

$('#popup-user').hide();

$('.site-header .site-logo').on('click', function () {
    self.location.href = '/';
});

$('#user-popup').on('click', function () {
    if ($('#popup-user').css('display') === 'none') $('#popup-user').show();
    else $('#popup-user').hide();
});

$(document).on('ready', function () {
    alert('asdf');
});
