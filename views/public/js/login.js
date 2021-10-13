function enableLoginButton() {
    $('#login-button').toggleClass('disabled');
    $('#login-button').toggleClass('clickable');
    $('#login-button').attr('disabled', false);
}

function disableLoginButton() {
    $('#login-button').toggleClass('disabled');
    $('#login-button').toggleClass('clickable');
    $('#login-button').attr('disabled', true);
}
