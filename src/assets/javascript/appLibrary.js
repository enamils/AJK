import Glide from '@glidejs/glide';
// import Glide, { Swipe } from '@glidejs/glide/dist/glide.modular.esm';
import 'lazysizes';
import SmoothScroll from 'smooth-scroll';

const glideClass = document.querySelectorAll('.glide');
const glideConfig = {
  type: 'carousel',
  touchAngle: 45,
  touchRatio: 0.5,
  focusAt: 'center',
  gap: 30,
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
  animationDuration: 800
}

for (let el of glideClass) {
  new Glide(el, glideConfig).mount();
}

let scroll = new SmoothScroll('a.js-scroll-trigger[href^="#"]:not([href="#"])', {
  easing: 'easeInQuart',
  speed: 1000,
  speedAsDuration: true,
  topOnEmptyHash: true,
  clip: true,
  updateURL: false
});