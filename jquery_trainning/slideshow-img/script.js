(function ($) {
  $.fn.slider = function (parent) {
    let $sliderItems = $(`.${parent} .slide-img`);
    let $paginationItems;
    let imageWidth = $sliderItems.first().width();
    let endMargin = -(($sliderItems.length - 1) * imageWidth);
    let $slideButton = $(`.${parent} .link`);

    let renderPagination = function () {
      let renderString = '';
      for (let i = 1, len = $sliderItems.length; i <= len; i++) {
        renderString += `<span class="dot" id="dot-${i}"></span>`;
      }
      $(`.${parent} .dot-container`).html(renderString);
      $paginationItems = $(`.${parent} .dot`);
      $(`.${parent} .dot:nth-child(1)`).addClass('active');
    };
    renderPagination();

    let getCurrentImage = function () {
      return Math.abs(getLeftMargin() / imageWidth);
    };

    let changeActive = function () {
      for (let i = 1, len = $('.dot').length; i <= len; i++) {
        if ($(`.${parent} .dot:nth-child(${i})`).hasClass('active')) {
          $(`.${parent} .dot:nth-child(${i})`).removeClass('active');
        }
      }
      $(`.${parent} .dot:nth-child(${getCurrentImage() + 1})`).addClass('active');
    };

    let getLeftMargin = function () {
      return parseInt($(`.${parent} .slider`).css('margin-left'), 10);
    };

    let goNext = function () {
      leftMargin =
        getLeftMargin() == endMargin
          ? 0
          : Math.abs(getLeftMargin()) + imageWidth;
      $(`.${parent} .slider`).css({ 'margin-left': `-${leftMargin}px` });
      changeActive();
    };

    let goPre = function () {
      leftMargin =
        getLeftMargin() == 0 ? endMargin : getLeftMargin() + imageWidth;
      $(`.${parent} .slider`).css({ 'margin-left': `${leftMargin}px` });
      changeActive();
    };

    let goImage = function (paginationIndex) {
      $(`.${parent} .slider`).css({ 'margin-left': `-${imageWidth * paginationIndex}px` });
    };

    $slideButton.on('click', function () {
      clearInterval(interval);
      var isNextButton = $(this).hasClass('next');
      console.log( $(this).attr('class'));
      isNextButton ? goNext() : goPre();
      interval = setInterval(goNext, 3000);
    });

    $paginationItems.on('click', function () {
      clearInterval(interval);
      $(`${parent} .dot:nth-child(${getCurrentImage() + 1})`).removeClass('active');
      //lay id ra , lay so cua id
      let dot = $(this).attr('id').split('-');

      goImage(parseInt(dot[1]) - 1);
      $(`${parent} .dot:nth-child(${getCurrentImage() + 1})`).addClass('active');
      interval = setInterval(goNext, 3000);
    }); 

    var interval = setInterval(goNext, 3000);
  };
})(jQuery);

$(function () {
  $('.slider').slider('container-1');
  $('.slider').slider('container-2');
});
