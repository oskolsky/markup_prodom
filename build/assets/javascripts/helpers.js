//****************************************************************************************************
//
// .. MASONRY
// .. https://github.com/desandro/masonry/issues/475#issuecomment-40475689
//
// $('.masonry').masonry({
//   itemSelector: '.item',
//   columnWidth: function() {
//     // 5 columns
//     return this.size.innerWidth / 5;
//   }
// });
//
//****************************************************************************************************
// add columnWidth function to Masonry
Masonry.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else if ( typeof option === 'function' ) {
    this[ measurement ] = option.call( this );
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};



//****************************************************************************************************
//
// .. SMARTRESIZE
//
//****************************************************************************************************
(function($,sr) {
  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced () {
      var
        obj = this,
        args = arguments;
      
      function delayed () {
        if (!execAsap) func.apply(obj, args);
        timeout = null;
      }

      if (timeout) clearTimeout(timeout);
      else if (execAsap) func.apply(obj, args);

      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  jQuery.fn[sr] = function(fn) {return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);};
})(jQuery,'smartresize');



//****************************************************************************************************
//
// .. DOUBLE HOVER
//
//****************************************************************************************************
function doubleHover(selector, hoverClass) {
  $(document).on('mouseover mouseout', selector, function(e) {
    $(selector)
      .filter('[href=\'' + $(this).attr('href') + '\']')
      .toggleClass(hoverClass, e.type == 'mouseover');
  });
}



//****************************************************************************************************
//
// .. SCROLLBAR SIZE
//
//****************************************************************************************************
function getBrowserScrollSize() {
  var css = {
    'border':  'none',
    'height':  '200px',
    'margin':  '0',
    'padding': '0',
    'width':   '200px'
  };

  var inner = $('<div>').css($.extend({}, css));
  var outer = $('<div>').css($.extend({
    'left':     '-1000px',
    'overflow': 'scroll',
    'position': 'absolute',
    'top':      '-1000px'
  }, css)).append(inner).appendTo('body')
  .scrollLeft(1000)
  .scrollTop(1000);

  var scrollSize = {
    'height': (outer.offset().top - inner.offset().top) || 0,
    'width':  (outer.offset().left - inner.offset().left) || 0
  };

  outer.remove();
  
  return scrollSize;
}



//****************************************************************************************************
//
// .. SCROLL TO
//
//****************************************************************************************************
$(document).on('touchend click', '[data-scroll]', function() {
  var
    anchor = $(this).data('scroll'),
    offset = $(this).data('offset') || 0,
    speed = $(this).data('speed') || 0,
    destination = $(anchor).offset().top - offset;
  
  if (speed) {
    $('html, body').animate({scrollTop: destination}, speed);
  } else {
    $('html, body').animate({scrollTop: destination}, $(document).height() / 10);
  }
  
  return false;
});



//****************************************************************************************************
//
// .. SUBSTRING TEXT
//
//****************************************************************************************************
$(function() {
  $('[data-substring]').each(function() {
    var 
      text = $(this).text(),
      count = $(this).data('substring'),
      substr = $(this).text().toString().substring(0, count);
    
    if (text.length > count) {
      $(this).text(substr += '...');
    }
  });
});



//****************************************************************************************************
//
// .. STICKY HEADER
//
//****************************************************************************************************
$.fn.stickyHeader = function() {
  if (this.length) {
    var
      $header = this,
      $page = $('#page'),
      headerOuterHeight = $header.outerHeight(),
      headerPositionTop = $header.position().top,
      headerOffsetTop = $header.data('offset-top'),
      windowScrollTop = $(window).scrollTop();
        
    $header.data('offset-top', $header.offset().top);

    if (windowScrollTop > headerPositionTop) {
      $page.css({'padding-top': headerOuterHeight + 'px'});
      $header.addClass('header__sticky');
    }

    $(window).scroll(function() {
      windowScrollTop = $(window).scrollTop();
      headerOffsetTop = $header.data('offset-top');

      if (windowScrollTop > headerOffsetTop) {
        $page.css({'padding-top': headerOuterHeight + 'px'});
        $header.addClass('header__sticky');
      } else {
        $header.removeClass('header__sticky');
        $page.css({'padding-top': '0'});
      }
    });

    return this;
  }
};



//****************************************************************************************************
//
// .. STICKY FOOTER
//
//****************************************************************************************************
$.fn.stickyFooter = function() {
  if (this.length) {
    var
      $footer = this,
      footerHeight = $footer.outerHeight();
   
    $('#page').css({'position': 'relative', 'min-height': '100%'});
    $('#main').css({'padding-bottom': footerHeight + 'px'});
    $footer.css({'position': 'absolute', 'right': '0', 'bottom': '0', 'left': '0', 'z-index': '999'});
   
    return this;
  }
};