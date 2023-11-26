function toggleTheme()
{
    var currentTheme = $('html').attr('data-bs-theme');
    var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    $('html').attr('data-bs-theme', newTheme);
}

function toggleThemeListener() {
    $('#modeToggle').on('click', function() {
        toggleTheme();
    });
}