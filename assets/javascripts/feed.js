$(function() {

  $('.js-news-load').click(function() {

    var _this = this;

    $.ajax({
      url: '/data/news.html',
      data: {},
      success: function(response) {
        var $response = $(response);

        if ($response.length > 0) {

          $('.js-news').append($response);

        } else {

          $(_this).remove();

        }

      },
      error: function() {
        alert('Error load materials');
      }
    });

    return false;
  });

});