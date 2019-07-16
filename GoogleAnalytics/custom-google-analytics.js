// Making a global variable to be used everywhere.
window.ExtraAnalytics = (function() {

  return {
      sendEventAnalytics: function(category, action, label, isNonInteraction) {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
        if (typeof window.ga === 'function') {
          // console.log('Sending GA Event: ' + 'Category: ' + category + ', Action: ' + action + ', Label: ' + label + ', Is Noninteraction: ' + isNonInteraction);
          window.ga('send', {hitType: 'event', eventCategory: category, eventAction: action, eventLabel: label, nonInteraction: isNonInteraction});
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

// Could be another file

(function(window, document ) {
  var ExtraAnalytics = window.ExtraAnalytics;

  ///////////////////////
  // Downloads

  // Called on <a> with appropriate "title" attribute
  function handleDownloadAnalytics() {
    var label = this.getAttribute('title'); // Triggered by <a>
    ExtraAnalytics.sendEventAnalytics('Download File', 'Click', label, false );
  }

  var downloadLinks = document.getElementsByClassName('js-ga-download');

  for (var l = downloadLinks.length - 1; l >= 0; l--) {
    downloadLinks[l].addEventListener('click', handleDownloadAnalytics);
  }


  ///////////////////////
  // Outbound links

  // Called on <a> with appropriate "href" attribute
  function handleOutboundAnalytics() {
    var label = this.getAttribute('href'); // Triggered by <a>
    ExtraAnalytics.sendEventAnalytics('Outbound link', 'Click', label, false );
  }

  var outboundLinks = document.getElementsByClassName('js-ga-outbound');

  for (var j = outboundLinks.length - 1; j >= 0; j--) {
    outboundLinks[j].addEventListener('click', handleOutboundAnalytics);
  }


  ///////////////////////
  // Navigate to section

  // Called on <a> with appropriate "title" attribute
  function handleNavigationAnalytics() {
    var label = this.getAttribute('title'); // Example: At the Table jump link
    ExtraAnalytics.sendEventAnalytics('Jump Link Navigation', 'Click', label, false );
  }

  var jumpLinks = document.getElementsByClassName('js-ga');

  for (var i = jumpLinks.length - 1; i >= 0; i--) {
    jumpLinks[i].addEventListener('click', handleNavigationAnalytics);
  }

} )( window, document );

