'use strict';

angular.module('enbitcoins.factories')
  .factory('notifications', ['growl', function(growl) {

    return {
      success: function(text) {
        if (text) {
          growl.addSuccessMessage(text, { ttl: 3000 });
        }
      },
      error: function(text) {
        var txt = text || 'Internal Error.';

        growl.addErrorMessage(txt, { ttl: 5000 });
      }
    };

  }]);
