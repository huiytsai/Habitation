$(function() {

  ////////// Mobile Navigation //////////

  var $window = $(window),
      $mainNav = $('.main-nav'),
      $mobileLink = $('.mobile-nav a'),
      $socialNav = $('.social-nav'),
      $shareLink = $('.share-icon a'),
      screenWidth = $window.outerWidth(),
      breakPoint1 = 728,
      breakPoint2 = 677;

  function checkSize() {
    if (screenWidth < breakPoint1) {
      $socialNav.hide();
    }
    else {
      $socialNav.removeAttr('style');
    }
    if (screenWidth < breakPoint2) {
      $mainNav.hide();
    }
    else {
      $mainNav.removeAttr('style');
    }
  }
  checkSize();

  $window.resize(function () {
    screenWidth = $window.outerWidth();
    checkSize();
  });

  $mobileLink.click(function (event) {
    event.preventDefault();
    $mainNav.slideToggle(400);
  });

  $shareLink.click(function (event) {
    event.preventDefault();
    $socialNav.slideToggle(400);
  });

  /////////// Language Switching (2 langugages: English and Chinese). //////////

  // Initially disable language icon link
  $('.mobile-language-icon, .desktop-language-icon').css({'pointer-events':'none',
   'cursor':'default'}).attr('disabled','disabled');

  function langIconListen() {
    $('.mobile-language-icon, .desktop-language-icon').click(function (event) {
      event.preventDefault();
      $('[lang="zh"]').toggle();
      $('[lang="en"]').toggle();
      // Switch cookie stored language.
      if ($.cookie('lang') === 'en') {
        $.cookie('lang', 'zh', { expires: 7 });
      } else {
        $.cookie('lang', 'en', { expires: 7 });
      }
    });
    $('.mobile-language-icon, .desktop-language-icon').css({'pointer-events':'auto',
     'cursor':'pointer'}).removeAttr('disabled');
  }

  // Check if language cookie already exists.
  if ($.cookie('lang')) {
    var lang = $.cookie('lang');
    if (lang === 'en') {
      $('[lang="zh"]').hide();
      langIconListen();
    } else {
      $('[lang="en"]').hide();
      langIconListen();
    }
  } else {
    // no cookie set, so detect language based on location.
    if ("geolocation" in navigator) {
      // geolocation is available
      navigator.geolocation.getCurrentPosition(function (position) {
        // accepted geolocation so figure out which country
        var lat = position.coords.latitude,
            lng = position.coords.longitude;
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true', null, function (response) {
          var country = response.results[response.results.length-1].formatted_address;
          if (country ===  'Taiwan' || country === 'China') {
            $('[lang="en"]').hide();
            $.cookie('lang', 'zh', { expires: 7 });
            langIconListen();
          } else {
            $('[lang="zh"]').hide();
            $.cookie('lang', 'en', { expires: 7 });
            langIconListen();
          }
        }).fail(function (err) {
          console.log('error: '+err);
          $('[lang="zh"]').hide();
          $.cookie('lang', 'en', { expires: 7 });
          langIconListen();
        });
      },
      function (error) {
        if (error.code == error.PERMISSION_DENIED) {
          // denied geolocation
          $('[lang="zh"]').hide();
          $.cookie('lang', 'en', { expires: 7 });
          langIconListen();
        } else {
          console.log('Unknown error. Defaulting to English!');
          $('[lang="zh"]').hide();
          $.cookie('lang', 'en', { expires: 7 });
          langIconListen();
        }
      });
    } else {
      // geolocation IS NOT available
      $('[lang="zh"]').hide();
      $.cookie('lang', 'en', { expires: 7 });
      langIconListen();
    }
  }

});
