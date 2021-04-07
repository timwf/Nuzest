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


  function disableScrolling() {
    if ($(document).height() > $(window).height()) {
      const scrollTop = $('html').scrollTop()
        ? $('html').scrollTop()
        : $('body').scrollTop(); // Works for Chrome, Firefox, IE...
      $('html').addClass('disable-scrolling');
    }
  }

  function enableScrolling() {
    const scrollTop = parseInt($('html').css('top'), 10);
    $('html').removeClass('disable-scrolling');
    // $('html,body').scrollTop(-scrollTop);
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

      if ($(this).find('.js-product-second-image').length) {
        $(this).find('.js-product-first-image').removeClass('active')
        $(this).find('.js-product-second-image').addClass('active')    
      }
    })

    $card.on('mouseleave', function(){
      $(this).find('.btn').removeClass('active')
      $(this).find('.home-featured-product__product-options').removeClass('active')
      if ($(this).find('.js-product-second-image').length) {
        $(this).find('.js-product-first-image').addClass('active')
        $(this).find('.js-product-second-image').removeClass('active')
      }
    })


    const swiper = new Swiper('.home-featured-product__inner', {
      slidesPerView: 1.25,
      speed: 400,
      spaceBetween: 7,
      // loop: true,
      navigation: {
        prevEl: '.home-featured-product__nav .slidePrev-btn',
        nextEl: '.home-featured-product__nav .slideNext-btn'
      },
      breakpoints: {
        400: {
          slidesPerView: 1.45,
          spaceBetween: 7
        },
        600: {
          slidesPerView: 1.75,
          spaceBetween: 7
        },
        800: {
          slidesPerView: 1.25,
          spaceBetween: 70
        },
        1100: {
          slidesPerView: 2.25,
          spaceBetween: 70
        },
        1300: {
          slidesPerView: 2.5,
          spaceBetween: 70
        },
        1500: {
          slidesPerView: 2.75,
          spaceBetween: 70
        },
        1700: {
          slidesPerView: 3.1,
          spaceBetween: 70
        },
      }
    });
  }

  function initHomeScrollingAnimation(){
    console.log('asdfsdg');
    const section = $('.scrolling-animation')
    console.log('hiya');
    let startPoint
    let width = $(window).width()

    width >= 1280 ? startPoint = "0% 35%" : startPoint = "-20px 0%"

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: startPoint,
        // markers: true,
        end: "450% 0%",
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
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },
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
          slidesPerView: 1,
          spaceBetween: 10
        },
        800: {
          slidesPerView: 1.2,
          spaceBetween: 27
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

  function initHeader(){
    const header = $('.header');


    var lastScrollTop = 0;
    $(window).scroll(function(event){
      var st = $(this).scrollTop();
      if (st > lastScrollTop){
          $(header).css("transform", "translate(0px, -120px)")
      } else {
        $(header).css("transform", "translate(0px, 0px)")
      }
      lastScrollTop = st;

      if (st < 100){
        $(header).css("transform", "translate(0px, 0px)")   
      }
    });
  }

  function initFooter(){
    const $btn = $('.footer__column-menu-header')
    const $containers = $('.footer__column ul')
    const $footerBannerBtn = $('.footer-banner svg')

    $btn.on('click', function(){
      $containers.each(function(){        
        $(this).removeClass('active')
      })
      $(this).parent().find('ul').addClass('active')
    })

    $footerBannerBtn.on('click', function(){
      $(this).parent().hide()
    })
  }

  function initTheDigestHeader(){

    // fetch("https://community-open-weather-map.p.rapidapi.com/weather?q=London%2Cuk&lat=0&lon=0&callback=test&id=2172797&lang=null&units=%22metric%22%20or%20%22imperial%22&mode=xml%2C%20html", {
    //   "method": "GET",
    //   "headers": {
    //     "x-rapidapi-key": "0b911cd569mshd39b131cb496edbp1efd51jsn53903dae144a",
    //     "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
    //   }
    // })
    // .then(response => {
    //   console.log(response);
    // })
    // .catch(err => {
    //   console.error(err);
    // });
  }

  function initTheDigestSearch(){
    const $searchBtn = $('.digest-search__search svg')
    const $searchContainer = $('.digest-search__search')    
    const $filterBtn = $('.digest-search__filter-item')
    const $categories = $('.filter-results')
    const $searchInput = $('.digest-search__search input')
    const $articleItems = $('.article-grid__item')
    const $searchConatiner = $('.search-results')

    $searchBtn.on('click', function(){
      $('.digest-search__filter').hide()
      $('.filter-results__wrap').show()
      $('.digest-featured').hide()
      $searchContainer.addClass('active')    
      $categories.each(function(){ $(this).fadeOut() })
      $searchConatiner.fadeIn()
      $filterBtn.each(function(){$(this).removeClass('active')})

      //removes active class when clicked out side
      $(document).on('mouseup', function(e){
        if (!$searchContainer.is(e.target) && $searchContainer.has(e.target).length === 0){
          $('.digest-search__filter').show()
          $searchContainer.removeClass('active')
          $searchConatiner.fadeOut()
          $('.filter-results__wrap').hide()
          $('.digest-featured').show()
          $(this).unbind('mouseup');
        }
      })
    })

    $searchInput.on('keyup', function(){
      let inputVal = $(this).val().toLowerCase()
      let anyFound = false
      $('.filter-results__wrap').show()

      $searchConatiner.each(function(){
        let $searchItem = $(this).find('.article-grid__item')
        let foundItem = false

        $searchItem.each(function(){
          let self = this
          if($(this).find('h3').text().toLowerCase().includes(inputVal)){
            $(self).show()
            foundItem = true
            anyFound = true
          }
          else{
            $(self).hide()
          }       
        })
        foundItem ? $(this).show() : $(this).hide()
      })

      if (anyFound) {
        $('.js-no-results').hide()
      }
      else{
        $('.js-no-results').text('Sorry - no results found for ' + inputVal)
        $('.js-no-results').show()
      }   
    })

    function filterTheCategories(handle){
      $('.filter-results__wrap').show()
      $('.digest-featured').hide()

      $filterBtn.each(function(){
        if($(this).attr('data-handle') == handle){
          $(this).addClass('active')         
        }
      })

      $categories.each(function(){
        if($(this).attr('data-handle') == handle){
          let self = this
          setTimeout(function(){ $(self).fadeIn() }, 500);            
        }
        else{
          let self = this
          $(self).fadeOut()            
        }
      })
    }


    //deals with the pagination refresh
    if ($(location).attr('href').toString().includes('page=')) {
      let catergoryChosen = localStorage.getItem("blogtype")
      let originalWithoutQ = $(location).attr('href').split('?')[0]
      $('.digest-featured').hide()
      filterTheCategories(catergoryChosen)       
      $filterBtn.on('click', function(){
        window.location.href = originalWithoutQ;
      })
    }else{
      localStorage.setItem("blogtype", '');
    }

    if (localStorage.getItem("blogtype")) {
      filterTheCategories(localStorage.getItem("blogtype"))      
    }

    $filterBtn.on('click', function(){
      localStorage.setItem("blogtype", $(this).attr('data-handle'));

      if($(this).hasClass('active')){
        $(this).removeClass('active')
        $categories.each(function(){$(this).hide()})
        $('.filter-results__wrap').hide()
        $('.digest-featured').show()
      }
      else{
        $filterBtn.each(function(){$(this).removeClass('active')})
        $(this).addClass('active')
        let selection = $(this).attr('data-handle')
        $('.filter-results__wrap').show()
        $('.digest-featured').hide()

        $categories.each(function(){
          if($(this).attr('data-handle') == selection){
            let self = this
            setTimeout(function(){ $(self).fadeIn() }, 500);            
          }
          else{
            let self = this
            $(self).fadeOut()            
          }
        })
      }
    })
  }

  function initTheDigestFeaturedBlogs(){
    let numSlides
    let width = $(window).width()
    let $item = $('.scrolling-ticker')
    let $slider = $('.featured-blogs__slider')

    width >= 749 ? numSlides = 2 : numSlides = 1


  

    $slider.each(function(i){
      const swiper = new Swiper('#featured-blogs__slider' + "-" + (i + 1), {
        slidesPerView: numSlides,
        navigation: {
          prevEl: '#featured-blogs__prev' + "-" + (i + 1),
          nextEl: '#featured-blogs__next' + "-" + (i + 1)
        },
      });
    })


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
  initHeader()
  initFooter()
  initTheDigestHeader()
  initTheDigestSearch()
  initTheDigestFeaturedBlogs()

  if (isObserver) {
    $('.js-visibility').each((i, el) => {
      observer.observe(el);
    });
  }

  $(window).on('scroll', () => {});
  $(window).on('load', () => {});
  $(window).on('resize', doneResizing);
});
