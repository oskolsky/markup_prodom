//****************************************************************************************************
//
// .. INIT
//
//****************************************************************************************************
//
// .. arcticModal
//
$.arcticmodal('setDefault', {
  overlay: {
    css: {
      backgroundColor: '#000',
      opacity: 0.66
    }
  },
  openEffect: {
    speed: 200
  },
  closeEffect: {
    speed: 200
  }
});

//
// .. Accounting
//
accounting.settings = {
  currency: {
    decimal: '.',
    thousand: ' ',
    precision: 2
  },
  number: {
    decimal : '.',
    thousand: ' ',
    precision: 0
  }
};



//****************************************************************************************************
//
// .. FUNCTIONS
//
//****************************************************************************************************
//
// .. Accounting
//
function formatNumber() {
  $('.format-number').each(function() {
    var
      number = parseInt($(this).text().replace(new RegExp(' ', 'g'), '')),
      formatNumber = accounting.formatNumber(number);

    $(this).text(formatNumber);
  });
}

function formatMoney() {
  $('.format-money').each(function() {
    var c = accounting.settings.currency;

    if ($(this).hasClass('format-money__rub')) {
      c.format = '%v';
    } else if ($(this).hasClass('format-money__usd')) {
      c.symbol = '$';
      c.format = '%s %v';
    } else if ($(this).hasClass('format-money__eur')) {
      c.symbol = '€';
      c.format = '%s %v';
    }

    var
      money = parseFloat($(this).text().replace(new RegExp(' ', 'g'), '')),
      formatMoney = accounting.formatMoney(money);
    
    if ($(this).hasClass('format-money__rub')) {
      $(this).text(formatMoney).append('&nbsp;<span class=\'rub\'>Р</span>');
    } else {
      $(this).text(formatMoney);
    }
  });
}



//****************************************************************************************************
//
// .. EVENTS
//
//****************************************************************************************************
//
// .. Open dialog
//
$(document).on('touchend click', '[data-dialog=\'open\']', function() {
  var url = $(this).data('url');

  $.arcticmodal('close');

  $.arcticmodal({
    type: 'ajax',
    url: url
  });
  
  return false;
});

//
// .. Close dialog
//
$(document).on('touchend click', '[data-dialog=\'close\']', function() {
  $.arcticmodal('close');

  return false;
});



//****************************************************************************************************
//
// .. READY
//
//****************************************************************************************************
$(function() {

  //****************************************************************************************************
  //
  // .. DOUBLE HOVER
  //
  //****************************************************************************************************
  doubleHover('.double-hover', 'hover');



  //****************************************************************************************************
  //
  // .. FORMS
  // .. $('#checkbox').customForm() to init single element; $('body').customForm() to init all elements
  //
  //****************************************************************************************************
  $('.js-form').customForm();



  //****************************************************************************************************
  //
  // .. ACCOUNTING
  //
  //****************************************************************************************************
  formatNumber();
  formatMoney();
  


  //****************************************************************************************************
  //
  // .. RESIZE
  //
  //****************************************************************************************************
  $(window).smartresize(function() {

    if (!Modernizr.touch) {
      $('#header').stickyHeader();
    }
    $('#footer').stickyFooter();

  });
  
});



//****************************************************************************************************
//
// .. LOAD
//
//****************************************************************************************************
$(window).load(function() {

  if (!Modernizr.touch) {
    $('#header').stickyHeader();
  }
  $('#footer').stickyFooter();

});