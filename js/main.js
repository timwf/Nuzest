/* Init object fit polyfill */
/* To make it work, add 'font-family: 'object-fit: cover;';' to image */
// if (window.objectFitImages) {
//   window.objectFitImages();
// }

/* Init svg polyfill */
// if (window.svg4everybody) {
//   window.svg4everybody();
// }

$(document).ready(() => {
  // let resizeId;
  let wWidth = $(window).width();
  let navState = false;
  const $header = $('.page-header');
  let isObserver = true;
  let observer;
  let isTouch;

  if (
    !('IntersectionObserver' in window) ||
    !('IntersectionObserverEntry' in window) ||
    !('isIntersecting' in window.IntersectionObserverEntry.prototype)
  ) {
    isObserver = false;
    $('html').removeClass('is-observer');
  }

  if (isObserver) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
  }

  function isTouchDevice() {
    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    const mq = (query) => {
      return window.matchMedia(query).matches;
    };

    if (
      'ontouchstart' in window ||
      // eslint-disable-next-line no-undef
      (window.DocumentTouch && document instanceof DocumentTouch)
    ) {
      return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
      ''
    );
    return mq(query);
  }

  if (isTouchDevice()) {
    isTouch = true;
    $('html').addClass('is-touch');
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  function debounce(func, wait, immediate, ...args) {
    let timeout;
    return function () {
      const context = this;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // function once(fn, context) {
  //   var result;

  //   return function() {
  //     if (fn) {
  //       result = fn.apply(context || this, arguments);
  //       fn = null;
  //     }

  //     return result;
  //   };
  // }

  // // Usage
  // var canOnlyFireOnce = once(function() {
  //   console.log('Fired!');
  // });

  function disableScrolling() {
    if ($(document).height() > $(window).height()) {
      const scrollTop = $('html').scrollTop()
        ? $('html').scrollTop()
        : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
      $('html').addClass('disable-scrolling').css('top', -scrollTop);
    }
  }

  function enableScrolling() {
    const scrollTop = parseInt($('html').css('top'), 10);
    $('html').removeClass('disable-scrolling');
    $('html,body').scrollTop(-scrollTop);
  }

  function bindEvents() {
    $('.hamburger').on('click', () => {
      if (navState) {
        $header.removeClass('is-opened');
        enableScrolling();
      } else {
        $header.addClass('is-opened');
        disableScrolling();
      }

      navState = !navState;
    });

    // FOCUS STYLING
    // Let the document know when the mouse is being used
    document.body.addEventListener('mousedown', () => {
      document.body.classList.remove('is-tab');
    });

    // Re-enable focus styling when Tab is pressed
    document.body.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('is-tab');
      }
    });
  }

  const doneResizing = debounce(() => {
    const width = $(window).width();

    initFlyOutNav()
    initfeaturedProductsHome()
    initHomeScrollingAnimation()
    initHomeTicker()
    initHomeReviews()
  

    if (wWidth !== width) {
      wWidth = width;
    }
  }, 500);

  function initFlyOutNav(){
    const $hamburger = $('.header__hamburger')
    const $flyout = $('.fly-out-nav')
    const $close = $('.fly-out-nav__close')
    const $collectionList = $('.fly-out-nav__collections a')
    const $collections = $('.fly-out-collection')
    const $hiddenImage = $('.js-header-product-image')
    const $productListItems = $('.fly-out-collection__items a')
    const $mobBack = $('.fly-out-collection__back')



    $hamburger.on('click', function(){
      $flyout.addClass('active');
      disableScrolling()
    })

    $close.on('click', function(){
      $flyout.removeClass('active');
      $collections.each(function(){ $(this).removeClass('active');})
      enableScrolling()
    })

    $collectionList.on('mouseenter', function(){
      let hoveredCollection = $(this).attr('data-collection') 

      $collections.each(function(){
        if($(this).attr('data-collection') == hoveredCollection){
          $(this).addClass('active');
        }
        else{
          $(this).removeClass('active');
        }
      })
    })

    $productListItems.on('mouseenter', function(){
      let imageSrc = $(this).find('img').attr('src') 
      console.log($(this).parent());
      $(this).parent().parent().find('.js-header-product-image').attr('src', imageSrc)    
    })

    $mobBack.on('click', function(){
      $collections.each(function(){ $(this).removeClass('active');})
    })
  }


  function initfeaturedProductsHome(){
    const $card = $('.home-featured-product__item')



    $card.on('mouseenter', function(){
      $(this).find('.btn').addClass('active')
      $(this).find('.home-featured-product__product-options').addClass('active')
      
    })

    $card.on('mouseleave', function(){
      $(this).find('.btn').removeClass('active')
      $(this).find('.home-featured-product__product-options').removeClass('active')
    })


    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 1.25,
      speed: 400,
      spaceBetween: 27,
      // loop: true,
      navigation: {
        prevEl: '.home-featured-product__nav .slidePrev-btn',
        nextEl: '.home-featured-product__nav .slideNext-btn'
      },
      breakpoints: {
        400: {
          slidesPerView: 1.45,
          spaceBetween: 27
        },
        600: {
          slidesPerView: 1.75,
          spaceBetween: 27
        },
        800: {
          slidesPerView: 1.25,
          spaceBetween: 90
        },
        1100: {
          slidesPerView: 2.25,
          spaceBetween: 90
        },
        1300: {
          slidesPerView: 2.5,
          spaceBetween: 90
        },
        1500: {
          slidesPerView: 2.75,
          spaceBetween: 90
        },
        1700: {
          slidesPerView: 3.1,
          spaceBetween: 90
        },
        // when window width is >= 640px
      }
    });
  }

  function initHomeScrollingAnimation(){
    console.log('asdfsdg');
    const section = $('.scrolling-animation')
    console.log('hiya');
    let startPoint
    let width = $(window).width()

    width >= 1280 ? startPoint = "0% 35%" : startPoint = "160px 35%"

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: startPoint,
        // markers: true,
        end: "250% 0%",
        pin: true, 
        scrub: true
      }
    })
    .to(".scrolling-animation__copy-one",  { opacity: 0 }, 1)
    .to(".scrolling-animation__image-one",  { opacity: 0 }, 1)
    .to(".scrolling-animation__image-two",  { opacity: 1 }, 1)
    .to(".scrolling-animation__copy-two",  { opacity: 1 }, 1)
    .to(".scrolling-animation__num-one",  { backgroundColor:"#fff" }, 1)
    .to(".scrolling-animation__num-two",  { backgroundColor:"#00e132" }, 1)   

    .to(".scrolling-animation__image-two",  { opacity: 0 }, 2)
    .to(".scrolling-animation__copy-two",  { opacity: 0 }, 2)
    .to(".scrolling-animation__image-three",  { opacity: 1 }, 2)
    .to(".scrolling-animation__copy-three",  { opacity: 1 }, 2)
    .to(".scrolling-animation__num-two",  { backgroundColor:"#fff" }, 2)
    .to(".scrolling-animation__num-three",  { backgroundColor:"#00e132" }, 2)

    .to(".scrolling-animation__image-three",  { opacity: 0 }, 3)
    .to(".scrolling-animation__copy-three",  { opacity: 0 }, 3)
    .to(".scrolling-animation__image-four",  { opacity: 1 }, 3)
    .to(".scrolling-animation__copy-four",  { opacity: 1 }, 3)
    .to(".scrolling-animation__num-three",  { backgroundColor:"#fff" }, 3)
    .to(".scrolling-animation__num-four",  { backgroundColor:"#00e132" }, 3)
  } 

  function initHomeTicker(){
    let numSlides
    let width = $(window).width()
    let $item = $('.scrolling-ticker')

    width >= 1024 ? numSlides = 6 : numSlides = 3

    const swiper = new Swiper('.scrolling-ticker', {
      loop: true,
      autoplay: {
        delay: 1,
        disableOnInteraction: false,
      },
      simulateTouch: false,
      slidesPerView: numSlides,
      speed: 4000,
    });

    // $item.on('mouseenter', function(){
    //   console.log('enter');
    //   swiper.speed = 0
    //   swiper.autoplay.stop();
    // })

    // $item.on('mouseleave', function(){
    //   swiper.autoplay.start();
    //   console.log('stop');
    // })
  }

  function initHomeReviews(){
    let numSlides
    let width = $(window).width()

    width >= 1024 ? numSlides = 2 : numSlides = 1

    const swiper = new Swiper('.home-reviews', {
      slidesPerView: numSlides,
      loop: true,
      navigation: {
        prevEl: '.home-reviews__nav .slidePrev-btn',
        nextEl: '.home-reviews__nav .slideNext-btn'
      },
    });
  }

  function initHomeFeaturedBlog(){

    const swiper = new Swiper('.featured-blog__inner', {
      slidesPerView: 1.25,
      speed: 400,
      spaceBetween: 27,
      // loop: true,
      navigation: {
        prevEl: '.featured-blog .slidePrev-btn',
        nextEl: '.featured-blog .slideNext-btn'
      },
      breakpoints: {
        400: {
          slidesPerView: 1.1,
          spaceBetween: 27
        },
        600: {
          slidesPerView: 1.1,
          spaceBetween: 27
        },
        800: {
          slidesPerView: 1.25,
          spaceBetween: 90
        },
        1100: {
          slidesPerView: 1.7,
          spaceBetween: 90
        },
        1300: {
          slidesPerView: 1.7,
          spaceBetween: 90
        },
        1500: {
          slidesPerView: 1.7,
          spaceBetween: 90
        },
        1700: {
          slidesPerView: 2.0,
          spaceBetween: 90
        },
        // when window width is >= 640px
      }
    });
  }

  



  /* FUNCTION CALLS */
  /* ============= */
  bindEvents();
  initFlyOutNav()
  initfeaturedProductsHome()
  initHomeScrollingAnimation()
  initHomeTicker()
  initHomeReviews()
  initHomeFeaturedBlog()

  if (isObserver) {
    $('.js-visibility').each((i, el) => {
      observer.observe(el);
    });
  }

  $(window).on('scroll', () => {});
  $(window).on('load', () => {});
  $(window).on('resize', doneResizing);
});
