import Glide from '@glidejs/glide';

const glideClass = document.querySelectorAll('.glide');

Array.prototype.forEach.call(glideClass, function (el) {
  new Glide(el, {
    type: 'carousel',
    touchAngle: 45,
    touchRatio: 0.5,
    startAt: 1,
    perView: 3,
    breakpoints: {
      768: {
        perView: 2
      },
      480: {
        perView: 1
      },
    },
    animationDuration: 800,
    animationTimingFunc: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)'
  }).mount();
});