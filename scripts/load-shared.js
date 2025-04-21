window.addEventListener('DOMContentLoaded', () => {
    fetch('/shared/header.html')
        .then(res => res.text())
        .then(data => document.getElementById('header').innerHTML = data);

    fetch('/shared/footer.html')
        .then(res => res.text())
        .then(data => document.getElementById('footer').innerHTML = data);
});
