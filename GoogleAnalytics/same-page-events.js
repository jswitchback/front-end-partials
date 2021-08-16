// Making a global variable to be used everywhere.
window.ExtraAnalytics = (function() {

  // Anatomy of an event
  // ga('send', {
  //   hitType: 'event',
  //   eventCategory: 'Videos',
  //   eventAction: 'play',
  //   eventLabel: 'Fall Campaign',
  //   eventValue
  //   nonInteraction: true
  // });

  // Required data...
  // eventCategory: Typically the object that was interacted with (e.g. 'Video')
  // eventAction: The type of interaction (e.g. 'click', 'play')

  // Optional data...
  // eventLabel: Useful for categorizing events (e.g. 'Fall Campaign')
  // eventValue: A numeric value associated with the event (e.g. 42). Non-negative integer
  // nonInteraction: true means it should not effect bounce rate

  return {
      sendEventAnalytics: function(category, action, label, isNonInteraction, hitCallback) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        if (typeof window.ga === 'function') {
          // console.log('Sending GA Event: ' + 'Category: ' + category + ', Action: ' + action + ', Label: ' + label + ', Is Noninteraction: ' + isNonInteraction);
          window.ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action,
            eventLabel: label,
            nonInteraction: isNonInteraction,
          });
        }
      },
      // For sending page analytics in the case of a single page app.
      // Would send this when adding to javascripts History API
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


(function(window, document ) {
  var ExtraAnalytics = window.ExtraAnalytics;

  function handleClickEventAnalytics() {
    var label = this.getAttribute('title');
    var category = this.getAttribute('data-ga-event-category');
    ExtraAnalytics.sendEventAnalytics(category, 'click', label, false );
  }

  // Example element
  // <a class="js-ga-click" href="#moreinfo" data-ga-event-category="Jump link" title="Navigate to the donation form">Donate Now</a>
  var elements = document.getElementsByClassName('js-ga-click');

  for (var i = elements.length - 1; i >= 0; i--) {
    elements[i].addEventListener('click', handleClickEventAnalytics);
  }

} )( window, document );

