function goToPage(target) {
    location.href = `/${target}`;
}

$('.site-header .site-logo').on('click', function () {
    self.location.href = '/';
});

$(document).on('ready', function () {
    alert('asdf');
});
