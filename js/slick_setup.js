$(document).ready(function () {
    $(".slider-nav").slick({
      centerMode: true,
      centerPadding: "60px",
      slidesToShow: 3,
      lazyLoad: "ondemand",
      responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: "40px",
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: "40px",
            slidesToShow: 1
          }
        }
      ]
    });
});