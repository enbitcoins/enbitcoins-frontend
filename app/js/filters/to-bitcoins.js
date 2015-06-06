'use strict';

angular.module('enbitcoins.filters')
  .filter('toBitcoins', function() {
    return function(satoshis) {
      var convertion = parseInt(satoshis, 10) / 100000000,
          bitcoins = convertion > 0 ? convertion.toFixed(8) : 0;

      return bitcoins;
    };
  });
