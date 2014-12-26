//****************************************************************************************************
//
// .. READY
//
//****************************************************************************************************
$(function() {

  //
  // .. Item gallery
  //
  $('.js-item-gallery').owlCarousel({
    items: 1,
    nav: true,
    navText: false,
    mouseDrag: false
  });

  //
  // .. Items carousel
  //
  $('.js-carousel-items').owlCarousel({
    items: 2,
    nav: false,
    navText: false,
    margin: 10,
    mouseDrag: false
  });
 


  //****************************************************************************************************
  //
  // .. SCROLL
  //
  //****************************************************************************************************
  $(window).scroll(function() {});



  //****************************************************************************************************
  //
  // .. RESIZE
  //
  //****************************************************************************************************
  $(window).smartresize(function() {});
  
});



//****************************************************************************************************
//
// .. LOAD
//
//****************************************************************************************************
$(window).load(function() {});