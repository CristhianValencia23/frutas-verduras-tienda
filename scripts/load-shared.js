
// Mostrar el botón flotante cuando el usuario hace scroll hacia abajo
window.onscroll = function() {
    var myBtn = document.getElementById("myBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        myBtn.style.display = "block";
    } else {
        myBtn.style.display = "none";
    }
};

// Al hacer clic en el botón, vuelve al principio de la página
document.getElementById("myBtn").onclick = function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

// Slider de imágenes
let index = 0;

function showSlide() {
    const slides = document.querySelectorAll('.slider .slides img');
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
    });
    index = (index + 1) % slides.length;
}

setInterval(showSlide, 3000);
