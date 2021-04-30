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
    initTheDigestFeaturedBlogs()
    initHomeHero()
  

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
      $(this).parent().parent().find('.js-header-product-image').attr('src', imageSrc)    
    })

    $mobBack.on('click', function(){
      $collections.each(function(){ $(this).removeClass('active');})
    })
  }


  function initfeaturedProductsHome(){

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

  //changes height of image on hero without effecting copy so this section is always 100vh
  function initHomeHero(){
    const $imageContainer = $('.home-hero__right');
    let $texxtContainerHeight = $('.home-hero__left').outerHeight() + 60 //offset for header
    let wWidth = $(window).width()

    if(wWidth < 768){
      $imageContainer.css('height', `calc(100vh - ${$texxtContainerHeight}px)`) 
    }
  }

  function initHomeScrollingAnimation(){
    const section = $('.scrolling-animation')
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
    const $bag = $('.js-open-cart')

    $bag.on('click', function(){
      $('.cart-drawer').addClass('active')
    })


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

      //closes active container if already active
      if($(this).parent().find('ul').hasClass('active')){
        $(this).parent().find('ul').removeClass('active');
        return;
      }

      $containers.each(function(){ 
        $(this).removeClass('active')
      })

      $(this).parent().find('ul').addClass('active')
    })

    $footerBannerBtn.on('click', function(){
      $(this).parent().hide()
    })

    //banner animation
    const $bannerCopy = $('.footer-banner--animation p')
    let maxCount = $bannerCopy.length
    let count = 0
    $bannerCopy.eq(0).fadeIn(); 

    setInterval(changeCopy, 4000);

    function changeCopy(){
      //starts from zero index when reaches max length
      if(count >= maxCount){
        $bannerCopy.eq(count-1).fadeOut(function(){ 
          count = 0 
          $bannerCopy.eq(count).fadeIn(); 
        })
      }

      $bannerCopy.eq(count-1).fadeOut(function(){ 
        $bannerCopy.eq(count).fadeIn(); 
        count ++ 
      })       
    }
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
    let $slider = $('.featured-blogs__slider')

    $slider.each(function(i){
      const swiper = new Swiper('#featured-blogs__slider' + "-" + (i + 1), {
        slidesPerView: 1.2,
        spaceBetween: 27,
        breakpoints: {
          400: {
            slidesPerView: 1.2
          },
          800: {
            slidesPerView: 1.5
          },
          1100: {
            slidesPerView: 2
          }
        },
        navigation: {
          prevEl: '#featured-blogs__prev' + "-" + (i + 1),
          nextEl: '#featured-blogs__next' + "-" + (i + 1)
        },
      });
    })
  }

  function initProductCard(){
    const $card = $('.product-card__item')

    $card.each(function(){
      initVaraintCalc(this)
    })

    $card.on('mouseenter', function(){
      $(this).find('.btn').addClass('active')
      $(this).find('.product-card__product-options').addClass('active')

      if ($(this).find('.js-product-second-image').length) {
        $(this).find('.js-product-first-image').removeClass('active')
        $(this).find('.js-product-second-image').addClass('active')    
      }
    })

    $card.on('mouseleave', function(){
      $(this).find('.btn').removeClass('active')
      $(this).find('.product-card__product-options').removeClass('active')
      if ($(this).find('.js-product-second-image').length) {
        $(this).find('.js-product-first-image').addClass('active')
        $(this).find('.js-product-second-image').removeClass('active')
      }
    })
  }



  function initVaraintCalc(card){

    const $selects = $(card).find('.js-product-varient-select')
    const $hiddenVars = $(card).find('.js-variant')
    let variantString = ""
    const $submitBtn = $(card).find('.js-product-card-add-to-cart')
    updateVariant()


    $selects.on('change', function(){
      updateVariant()
    })

    $submitBtn.on('click', function(){
      let id = $(this).attr('data-variant-id')
      let qty
      let sellingplan = $(this).attr('data-selling-plan-id')
      $(this).attr('data-quantity') ? qty = $(this).attr('data-quantity') : qty = 1
      addToCart(id, qty, sellingplan)
      $('.loader').fadeIn()
    })

    function updateVariant(){
      variantString = "";
      let match = false;
      console.log('updating vars?');

      //if no options return
      if(!$selects.length){
        return;
      }

      $selects.each(function(){
        let optionSelected = $("option:selected", this).val();
        variantString += optionSelected
      })

      $hiddenVars.each(function(){
        let hiddenVarTitle = $(this).attr('data-title').replace(/\s+|[\/]/g, "")
        let selected = variantString.replace(/\s+|[\/]/g, "")

        if(hiddenVarTitle == selected){
          $submitBtn.attr("disabled", false)
          $submitBtn.attr('data-variant-id', $(this).attr('data-id'))
          $submitBtn.find('p').text('Add to Your Cart - ' + $(this).attr('data-price'))
          let varImage = $(this).attr('data-image')
          match = true;

          if($('.product-template__right').length){               
            //product page slider - var selects
            const productTemplateSlider = new Swiper('.product-template__right', {
              slidesPerView: 1.25,
              spaceBetween: 19,
              navigation: {
                prevEl: '.product-template__slider-arrows .slidePrev-btn',
                nextEl: '.product-template__slider-arrows .slideNext-btn'
              },
              breakpoints: {
                600: {
                  slidesPerView: 2.25,
                  spaceBetween: 20
                },
                900: {
                  slidesPerView: 1.1,
                  spaceBetween: 20
                },
                1200: {
                  slidesPerView: 1.65,
                  spaceBetween: 70
                },
                1700: {
                  slidesPerView: 2.55,
                  spaceBetween: 70
                }
              }
            });

            //moves slider to correct variant
            $('.swiper-slide').each(function (i){
              if(varImage == $(this).find('img').attr('src')){
                productTemplateSlider.slideTo(i)
              }
            })
          }
        }
      })

      if(!match){
          $submitBtn.find('p').text('Sorry - Out of Stock')
          $submitBtn.attr("disabled", true)
      }
    }
  }


  function addToCart(id, qty, sellingplan){

    $.ajax({
      type: 'POST', 
      url: '/cart/add.js',
      dataType: 'json', 
      data: {
        'items': [{
          'id': id,
          'quantity': qty,
          "selling_plan": sellingplan        
          // "properties": {
          //   "shipping_interval_unit_type": "Weeks",
          //   "shipping_interval_frequency": "2",
          //   "test": "this",
          // },
          }]
      },
      success: addToCartOk,
      error: addToCartFail
   }); 
  }

  function updateCartQty(id, qty){

    //TODO find a way to show 422 error when item out of stock (shows on add but not change!!!)

    $.ajax({
      type: 'POST', 
      headers: {
        'X-Requested-With':'XMLHttpRequest'
      },
      url: '/cart/change.js',
      dataType: 'json', 
      data: {'id': id,'quantity': qty},
      success: addToCartOk,
      error: addToCartFail
    }); 
  }


  function addToCartOk(){
    $('.cart-drawer').addClass('active')
    initCartDrawer()
  }

  function addToCartFail(){
    console.log(' not okay!');
    //TODO add 402 inventry error toast?
    $('.loader').fadeOut()
    toastActive("hh")
  }

  function initCartDrawer(){   
    const $closeBtn = $('.cart-drawer__header svg')     

    $closeBtn.on('click', function(){
      $('.cart-drawer').removeClass('active')
    })

    //get the cart and update the items
    jQuery.getJSON('/cart.js', function(cart) {
      updateCartDrawer(cart)
    })

    function updateCartDrawer(cart){      
      
      if(!cart.items.length){
        //removal all and append empty cart message
        $('.cart-drawer__checkout').hide()
        $('.cart-drawer__items').empty()  
        $('.cart-drawer__items').append(
          `<p class="body-bold" style="margin-top: 20px">Nothing in your bag</p>`
        )
        $('.loader').fadeOut()
      }
      else{
        //apend cart items to drawer
        $('.cart-drawer__items').empty()  
        $('.cart-drawer__checkout').show()
        $(cart.items).each(function(){
          // console.log(this.selling_plan_allocation.selling_plan.name);
          $('.cart-drawer__items').append(
            `
            <div class="cart-drawer__item">
              <div class="cart-drawer__item-left">
                <a href="${this.url }">
                  <img src="${this.image }" alt="">
                </a>
                <p class="body-small js-cart-drawer__remove" data-variant-id="${this.variant_id}">Remove</p>
              </div>
              <div class="cart-drawer__item-right">
                <h3 class="body-bold">${this.product_title}</h3>
                <h4 class="body-small">£${this.final_price / 100 }</h4>` +
                (this.variant_options[0] ? `<h5 class="body-small">${this.variant_options[0]}</h5>` : "") +
                (this.variant_options[1] ? `<h5 class="body-small">${this.variant_options[1]}</h5>` : "") +
                (this.variant_options[2] ? `<h5 class="body-small">${this.variant_options[2]}</h5>` : "") +
                (this.selling_plan_allocation ? `
                <div style="display: flex; " >
                  <svg style="margin-right: 10px; margin-top: 3px" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                    <path d="M17.0004 2.17969V6.54332H12.6367" stroke="#07272D" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1 13.816V9.45239H5.36364" stroke="#07272D" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.82545 5.81577C3.1943 4.77343 3.82119 3.84152 4.64761 3.10699C5.47404 2.37245 6.47307 1.85924 7.55148 1.61523C8.6299 1.37123 9.75255 1.40438 10.8147 1.71161C11.8768 2.01883 12.8438 2.59011 13.6255 3.37214L17 6.54305M1 9.45214L4.37455 12.623C5.15618 13.4051 6.12318 13.9764 7.18532 14.2836C8.24745 14.5908 9.3701 14.624 10.4485 14.3799C11.5269 14.1359 12.526 13.6227 13.3524 12.8882C14.1788 12.1537 14.8057 11.2217 15.1745 10.1794" stroke="#07272D" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                  </svg>                 
                  <h5 class="body-small">${this.selling_plan_allocation.selling_plan.name}</h5>
                </div>
                ` : "") +
                `<div class="cart-drawer__qty-selector-wrap">
                  <div class="cart-drawer__qty-selector-copy">
                    <p class="body-small">Qty.</p>
                  </div>
                  <div class="cart-drawer__qty-selector">
                    <div class="cart-drawer__qty-selector-btn js-cart-drawer__qty-minus" data-variant-id="${this.variant_id}" data-qty="${this.quantity}">
                      <svg width="14" height="2" viewBox="0 0 14 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="1" x2="13" y2="0.999999" stroke="#07272D" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <p>${this.quantity }</p>
                    <div class="cart-drawer__qty-selector-btn js-cart-drawer__qty-plus" data-variant-id="${this.variant_id}" data-qty="${this.quantity}">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="7" x2="13" y2="7" stroke="#07272D" stroke-width="2" stroke-linecap="round"/>
                        <line x1="7" y1="1" x2="7" y2="13" stroke="#07272D" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>     
            `
          )
        })

        $('.loader').fadeOut()
      }

      //update bag totals header
      if(cart.item_count){
        $('.header__cart-total').each(function(){
          $(this).text(cart.item_count)
        })
      }
      else{
        $('.header__cart-total').each(function(){
          $(this).text("")
        })
      }


      //update cart total
      $('.js-cart-drawer-total').text("£" + cart.total_price / 100)


      //qty add/minus cart drawer
      let $minusBtn = $('.js-cart-drawer__qty-minus')
      let $plusBtn = $('.js-cart-drawer__qty-plus')
      let $removeItem = $('.js-cart-drawer__remove')
  
      $minusBtn.on('click', function(){
        let id = parseInt($(this).attr('data-variant-id'))
        let qty = parseInt($(this).attr('data-qty')) - 1
        updateCartQty(id, qty)
        $('.loader').fadeIn()
      })
  
      $plusBtn.on('click', function(){
        let id = parseInt($(this).attr('data-variant-id'))
        let qty = parseInt($(this).attr('data-qty')) + 1
        updateCartQty(id, qty)
        $('.loader').fadeIn()     
      })

      $removeItem.on('click', function(){
        let id = parseInt($(this).attr('data-variant-id'))
        let qty = 0
        updateCartQty(id, qty)
        $('.loader').fadeIn()
      })
    }
  }

  //genral toas - TODO make dynanmic messaging
  function toastActive(text){
    $('.toast').addClass('active')    
    setTimeout(function(){ $('.toast').removeClass('active')}, 3000);
  }



  //for product page
  function initProductBuyBtn(){
    const $product = $('.product-template__left')
    const $plusBtn = $('.js-product-template-qty-plus')
    const $minusBtn = $('.js-product-template-qty-minus')
    const $qtyInput = $('.js-product-template-qty-amount')
    let qty = $qtyInput.text()

    $plusBtn.on('click', function(){
      qty ++
      $qtyInput.text(qty)
      $('.js-product-card-add-to-cart').attr('data-quantity', qty)
    })

    $minusBtn.on('click', function(){
      if(qty > 1){
        qty --
        $qtyInput.text(qty)
        $('.js-product-card-add-to-cart').attr('data-quantity', qty)
      }
    })

    // sort out the variants! (also images changed on select)
    initVaraintCalc($product)
  }

  function initAboutSecience(){
    const $items = $('.about-science-based__item')

    $items.each(function(){
      gsap.timeline({
        scrollTrigger: {
          trigger: this,
          start: "75% center",
          end: "90%",
          // markers: true,
        }
      })
      .to(this,  { opacity: 1 })
      .set(this, { className: "about-science-based__item active"})
    })
  }

  function initAccordian(){
    const $accordianBtn = $('.accordian__accordian-item')

    $accordianBtn.on('click', function(){
      if ($(this).hasClass('active')) {
        $(this).removeClass('active')
      }
      else{        
        $accordianBtn.each(function(){$(this).removeClass('active')})
        $(this).addClass('active') 
      }
    })
  }

  function initAboutPeople(){

    const swiper = new Swiper('.about-people__inner', {
      slidesPerView: 1.25,
      spaceBetween: 10,
      navigation: {
        prevEl: '.about-people__nav .slidePrev-btn',
        nextEl: '.about-people__nav .slideNext-btn'
      },
      breakpoints: {
        700: {
          slidesPerView: 1.95,
          spaceBetween: 50
        },
        1100: {
          slidesPerView: 3,
          spaceBetween: 137
        }
      }
    });
  } 

  function initSubscriptionOptions(){
    const $subOptions = $('.subscription-options__radio input')
    const $durationOptions = $('.subscription-options__option')
    const $sellingPlanOption = $('.subscription-options__option select')
    const $buyBtn = $('.js-product-card-add-to-cart')
    let $originalPrice = $('.js-product-card-add-to-cart').attr('data-price')
    const $tooltipTrigger = $('.js-tooltip')
    const $tooltip = $('.subscription-options__tooltip')

    $tooltipTrigger.on('mouseenter', function(){
      $tooltip.addClass('active')

      $(document).mousemove(function(event) {
        let x = event.pageX;        
        let y = event.pageY;   
        $tooltip.css({"top": `${y - 140}px`, "left": `${x - 205}px`});
      });  
    })

    $tooltipTrigger.on('mouseleave', function(){
      $tooltip.removeClass('active')
    })

    $subOptions.on('change', function(){   

      $subOptions.each(function(){
        $(this).prop('checked', false);
        $(this).parent().removeClass('active')
      })

      $(this).prop('checked', true);
      $(this).parent().addClass('active')

      if ($(this).prop('value') == 'subscribe') {
        $durationOptions.css("display", "flex")
        $buyBtn.attr('data-selling-plan-id', $sellingPlanOption.find(":selected").attr('data-selling-plan-id'))
        let discount = $sellingPlanOption.find(":selected").attr('data-discount')
        let discountedPrice = $originalPrice / 100 -  ($originalPrice /100) * (discount /100)
        $buyBtn.find('p').text(`Add to Your Cart - £${discountedPrice}`)
      }
      else{
        $durationOptions.hide()
        $buyBtn.attr('data-selling-plan-id', "")
        $buyBtn.find('p').text(`Add to Your Cart - £${$originalPrice/100}`)
      }
    })

    $sellingPlanOption.on('change', function(){
      $buyBtn.attr('data-selling-plan-id', $sellingPlanOption.find(":selected").attr('data-selling-plan-id'))
    })
  }



  /* FUNCTION CALLS */
  /* ============= */
  bindEvents();
  initFlyOutNav()
  initfeaturedProductsHome()
  initHomeScrollingAnimation()
  initHomeHero()
  initHomeTicker()
  initHomeReviews()
  initHomeFeaturedBlog()
  initHeader()
  initFooter()
  initTheDigestHeader()
  initTheDigestSearch()
  initTheDigestFeaturedBlogs()
  initProductCard()
  initCartDrawer()
  initProductBuyBtn()
  initAboutSecience()
  initAccordian()
  initAboutPeople()
  initSubscriptionOptions()


  if (isObserver) {
    $('.js-visibility').each((i, el) => {
      observer.observe(el);
    });
  }

  $(window).on('scroll', () => {});
  $(window).on('load', () => {});
  $(window).on('resize', doneResizing);
});
