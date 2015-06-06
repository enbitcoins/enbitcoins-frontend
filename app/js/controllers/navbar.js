'use strict';

angular.module('enbitcoins.controllers')
  .controller('NavbarController', ['$rootScope', '$scope', 'Ticker', function($rootScope, $scope, Ticker) {

    $scope.init = function() {
      Ticker.getLastPrice(function(response) {
        $scope.lastPrice = response.lastPrice;
      });
    };

  }]);
