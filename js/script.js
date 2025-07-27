const menuBtn = document.getElementById('menu-btn');
const navbar = document.querySelector('.header .navbar');

if(menuBtn) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('fa-times');
    navbar.classList.toggle('active');
  });
}

window.addEventListener('scroll', () => {
  menuBtn.classList.remove('fa-times');
  navbar.classList.remove('active');
});

var swiper = new Swiper(".home-slider", {
  loop: true,
  grabCursor: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
