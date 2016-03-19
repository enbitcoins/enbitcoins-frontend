'use strict';

angular.module('enbitcoins.controllers')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$routeParams', '$modal', 'Country', 'Ticker', 'apiCountry', function($rootScope, $scope, $routeParams, $modal, Country, Ticker, apiCountry) {

    $scope.init = function() {
      Country
        .get(function(response) {
          $rootScope.currentCountry = response;
        });

      Ticker
        .query(function(items) {
          $scope.countries = [];

          items.forEach(function(item) {
            if (item.country.slug === apiCountry) {
              $scope.priceTxt = item.country.code + ' ' + item.btc;
            } else {
              $scope.countries.push(item);
            }
          });
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
