// Making a global variable to be used everywhere.
window.ExtraAnalytics = (function() {

  // Anatomy of an event
  // ga('send', {
  //   hitType: 'event',
  //   eventCategory: 'Videos',
  //   eventAction: 'play',
  //   eventLabel: 'Fall Campaign',
  //   nonInteraction: true
  // });
  // eventCategory: Typically the object that was interacted with (e.g. 'Video')
  // eventAction: The type of interaction (e.g. 'click', 'play')
  // eventLabel: Useful for categorizing events (e.g. 'Fall Campaign')
  // eventValue: A numeric value associated with the event (e.g. 42)
  // nonInteraction: true means it should not effect bounce rate

  return {
      sendEventAnalytics: function(category, action, label, isNonInteraction, hitCallback) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        if (typeof window.ga === 'function') {
          // console.log('Sending GA Event: ' + 'Category: ' + category + ', Action: ' + action + ', Label: ' + label + ', Is Noninteraction: ' + isNonInteraction);

          if (category == 'Outbound link') {
            window.ga('send', {
              hitType: 'event',
              eventCategory: category,
              eventAction: action,
              eventLabel: label,
              nonInteraction: isNonInteraction,
              transport: 'beacon'
            });

          } else if (category == 'Form submit') {

            window.ga('send', {
              hitType: 'event',
              eventCategory: category,
              eventAction: action,
              eventLabel: label,
              nonInteraction: isNonInteraction,
              transport: 'beacon',
              hitCallback: hitCallback
            });

          } else {

            window.ga('send', {
              hitType: 'event',
              eventCategory: category,
              eventAction: action,
              eventLabel: label,
              nonInteraction: isNonInteraction,
            });
          }
        }
      },
      sendPageViewAnalytics: function(url) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/single-page-applications
        if (typeof window.ga === 'function') {
          // console.log('Sending GA Page View: ' + 'New page url: ' + url);
          window.ga('set', 'page', url);
          window.ga('send', 'pageview');
        }
      },
  };

})();

/////////////////// Could be another file //////////////////////

(function(window, document ) {
  var ExtraAnalytics = window.ExtraAnalytics;


  /////////////////////////////////////////////////////////////////////////////
  // Click event (Same page jump links)
  /////////////////////////////////////////////////////////////////////////////

  // Called on element with appropriate class. Uses title attribute as the label
  // <a class="js-ga-click" href="#moreinfo" title="Read more about our company"></a>
  function handleClickEventAnalytics() {
    var label = this.getAttribute('title');
    ExtraAnalytics.sendEventAnalytics('Same page click event', 'click', label, false );
  }

  var elements = document.getElementsByClassName('js-ga-click');

  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].addEventListener('click', handleClickEventAnalytics);
  }


  /////////////////////////////////////////////////////////////////////////////
  // Play video
  /////////////////////////////////////////////////////////////////////////////

  // Called on <video> with appropriate "title" attribute
  // <video class="" title="Watch our company video"></video>
  function handleVideoPlayAnalytics() {
    var label = this.getAttribute('title');
    ExtraAnalytics.sendEventAnalytics('Play video', 'click', label, true );
  }

  var videos = document.getElementsByClassName('js-ga-video');

  for (var i = videos.length - 1; i >= 0; i--) {
    videos[i].addEventListener('play', handleVideoPlayAnalytics);
  }

  /////////////////////////////////////////////////////////////////////////////
  // Downloads
  /////////////////////////////////////////////////////////////////////////////

  // Called on <a> with appropriate "title" attribute
  function handleDownloadAnalytics() {
    var label = this.getAttribute('title'); // Triggered by <a>
    ExtraAnalytics.sendEventAnalytics('Download file', 'click', label, false );
  }

  var downloadLinks = document.getElementsByClassName('js-ga-download');

  for (var l = downloadLinks.length - 1; l >= 0; l--) {
    downloadLinks[l].addEventListener('click', handleDownloadAnalytics);
  }


  /////////////////////////////////////////////////////////////////////////////
  // Outbound links
  // When a user clicks a link that points to another page on your site,
  // that page typically sends a pageview hit as the user arrives. Because
  // there's a series of pageviews, Google Analytics can figure out on
  // the back end where the user navigated to (and from). But if a user
  // clicks a link or submits a form to an external domain, that action
  // is not captured unless you specifically tell Google Analytics what happened.
  //
  // ***** This one is untested *******
  //
  /////////////////////////////////////////////////////////////////////////////


  // Called on <a> with appropriate "href" attribute
  function handleOutboundAnalytics() {
    var label = this.getAttribute('href'); // Triggered by <a>
    ExtraAnalytics.sendEventAnalytics('Outbound link', 'click', label, false );
  }

  var outboundLinks = document.getElementsByClassName('js-ga-outbound');

  for (var j = outboundLinks.length - 1; j >= 0; j--) {
    outboundLinks[j].addEventListener('click', handleOutboundAnalytics);
  }

  /////////////////////////////////////////////////////////////////////////////////
  // Track form submits
  // (similar to outbound links where javascript may cease on page redirect)
  //
  // ***** This one is untested *******
  //
  /////////////////////////////////////////////////////////////////////////////

  // Example from https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits#knowing_when_the_hit_has_been_sent
  function createFunctionWithTimeout(callback, opt_timeout) {
    var called = false;
    function fn() {
      if (!called) {
        called = true;
        callback();
      }
    }
    setTimeout(fn, opt_timeout || 1000);
    return fn;
  }

  var forms = document.getElementsByClassName('js-ga-form');

  for (var i = forms.length - 1; i >= 0; i--) {
    forms[i].addEventListener('submit', function(event) {
      // Prevents the browser from submitting the form
      // and thus unloading the current page.
      event.preventDefault();

      var form = this;
      var label = form.getAttribute('id');
      var hitCallbackFunction = createFunctionWithTimeout(function() {
        form.submit();
      };

      // Sends the event to Google Analytics and
      // resubmits the form once the hit is done.
      ExtraAnalytics.sendEventAnalytics('Form submit', 'Submit', label, false, hitCallbackFunction);
    });
  }

} )( window, document );

