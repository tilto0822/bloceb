let idValue = '';
let pwValue = '';

let idRegExp = /([A-Za-z0-9])\w+/g;

let $loginButton = document.getElementById('login-button');

function checkValue() {
    if (
        idValue.length >= 4 &&
        idValue.length <= 12 &&
        pwValue.length >= 8 &&
        pwValue.length <= 20
    ) {
        if (!$loginButton.classList.contains('clickable'))
            $loginButton.classList.add('clickable');
        $loginButton.disabled = false;
    } else {
        if ($loginButton.classList.contains('clickable'))
            $loginButton.classList.remove('clickable');
        $loginButton.disabled = true;
    }
}

$('#id-input').on('propertychange change keyup paste input', function () {
    idValue = $(this).val();
    checkValue();
});

$('#pw-input').on('propertychange change keyup paste input', function () {
    pwValue = $(this).val();
    checkValue();
});
