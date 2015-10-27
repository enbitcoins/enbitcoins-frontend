'use strict';

angular.module('enbitcoins.controllers')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$routeParams', '$modal', 'Country', 'Ticker', function($rootScope, $scope, $routeParams, $modal, Country, Ticker) {

    $scope.init = function() {
      Country
        .get(function(response) {
          $rootScope.country = response;
        });

      Ticker
        .getLastPrice(function(response) {
          $scope.priceTxt = response.country.code + ' ' + response.btc;
        });
    };

    $scope.contactModal = function() {
      var addr = $routeParams.addr || null;

      $modal.open({
        templateUrl: 'views/modals/contact.html',
        controller: 'ContactModalCtrl',
        resolve: {
          addr: function() {
            return addr;
          }
        }
      });
    };

  }]);
