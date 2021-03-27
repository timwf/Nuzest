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

  /* FUNCTION CALLS */
  /* ============= */
  bindEvents();
  initFlyOutNav()

  if (isObserver) {
    $('.js-visibility').each((i, el) => {
      observer.observe(el);
    });
  }

  $(window).on('scroll', () => {});
  $(window).on('load', () => {});
  $(window).on('resize', doneResizing);
});
