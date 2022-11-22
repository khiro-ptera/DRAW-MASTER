function main() {
    console.log("hi");

    const themeToggleBtn = document.getElementById('theme-toggle');

    // REFERENCED FROM FCC
    themeToggleBtn.addEventListener('click', function() {
        console.log("click!");
        evt.preventDefault();
    });
}

document.addEventListener('DOMContentLoaded', main);



