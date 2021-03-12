import Glide from '@glidejs/glide';
import 'lazysizes';
import SmoothScroll from 'smooth-scroll';
import Rellax from 'rellax';
import { Player, YouTubeProvider } from '@vime-js/lite';

/*---  GLIDE JS  --*/

// Glide
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

/*---  SCROLLING   --*/

// Scrolling
new SmoothScroll('a.js-scroll-trigger[href^="#"]:not([href="#"])', {
  easing: 'easeInQuart',
  speed: 1000,
  speedAsDuration: true,
  topOnEmptyHash: true,
  clip: true,
  updateURL: false
});

/*---  PARRALAX   --*/

// Parralax Rellax
const bgParallax = new Rellax('.rellax', {
  center: true
});

bgParallax.refresh();

/*---  VIME JS   --*/

const target = document.getElementById('video-container');

// Mount
const player = new Player({
  target,
  props: {
    src: 'youtube/EdRtj_xDohw',
    providers: [YouTubeProvider]
  }
});

// We receive updates on the state of the player here.
const off = player.$on('data', e => {
  const { info } = e.detail;

  /**
   * This will be an object containing all player properties such as
   * the currentTime, volume etc.
   **/
  console.log(info);
});

// Destroy
off();

/*--- LAZYLOAD BACKGROUND IMG ---*/

(function (window, factory) {
  var globalInstall = function () {
    factory(window.lazySizes);
    window.removeEventListener('lazyunveilread', globalInstall, true);
  };

  factory = factory.bind(null, window, window.document);

  if (typeof module == 'object' && module.exports) {
    factory(require('lazysizes'));
  } else if (typeof define == 'function' && define.amd) {
    require(['lazysizes'], factory);
  } else if (window.lazySizes) {
    globalInstall();
  } else {
    window.addEventListener('lazyunveilread', globalInstall, true);
  }
}(window, function (window, document, lazySizes) {
  /*jshint eqnull:true */
  'use strict';
  var bgLoad, regBgUrlEscape;
  var uniqueUrls = {};

  if (document.addEventListener) {
    regBgUrlEscape = /\(|\)|\s|'/;

    bgLoad = function (url, cb) {
      var img = document.createElement('img');
      img.onload = function () {
        img.onload = null;
        img.onerror = null;
        img = null;
        cb();
      };
      img.onerror = img.onload;

      img.src = url;

      if (img && img.complete && img.onload) {
        img.onload();
      }
    };

    addEventListener('lazybeforeunveil', function (e) {
      if (e.detail.instance != lazySizes) { return; }

      var tmp, load, bg;
      if (!e.defaultPrevented) {

        var target = e.target;

        if (target.preload == 'none') {
          target.preload = target.getAttribute('data-preload') || 'auto';
        }

        // handle data-script
        tmp = target.getAttribute('data-script');
        if (tmp) {
          addStyleScript(tmp);
        }

        // handle data-require
        tmp = target.getAttribute('data-require');
        if (tmp) {
          if (lazySizes.cfg.requireJs) {
            lazySizes.cfg.requireJs([tmp]);
          } else {
            addStyleScript(tmp);
          }
        }

        // handle data-bg
        bg = target.getAttribute('data-bg');
        if (bg) {
          e.detail.firesLoad = true;
          load = function () {
            target.style.backgroundImage = 'url(' + (regBgUrlEscape.test(bg) ? JSON.stringify(bg) : bg) + ')';
            e.detail.firesLoad = false;
            lazySizes.fire(target, '_lazyloaded', {}, true, true);
          };

          bgLoad(bg, load);
        }
      }
    }, false);
  }

  function addStyleScript(src, style) {
    if (uniqueUrls[src]) {
      return;
    }
    var elem = document.createElement(style ? 'link' : 'script');
    var insertElem = document.getElementsByTagName('script')[0];

    if (style) {
      elem.rel = 'stylesheet';
      elem.href = src;
    } else {
      elem.src = src;
    }
    uniqueUrls[src] = true;
    uniqueUrls[elem.src || elem.href] = true;
    insertElem.parentNode.insertBefore(elem, insertElem);
  }
}));

/*---  FOOTER COPYRIGHT YEAR   --*/

window.addEventListener('load', () => {
  (function () {
    let footerCopyrightYear = new Date();
    if (document.querySelector(".footer-copyright") !== null) {
      document.querySelector(".footer-copyright").innerText = footerCopyrightYear.getFullYear();
    }
  })();
});

console.log("sss");