'use strict';

angular.module('enbitcoins', [
  'ngRoute',
  'ngResource',

  // App
  'enbitcoins.factories',
  'enbitcoins.filters',
  'enbitcoins.services',
  'enbitcoins.directives',
  'enbitcoins.controllers'
]);

angular.module('enbitcoins.controllers', []);
angular.module('enbitcoins.directives', []);
angular.module('enbitcoins.services', []);
angular.module('enbitcoins.filters', []);
angular.module('enbitcoins.factories', []);

var parts = location.hostname.split('.'),
    subdomain = parts.shift();

// Constants
angular.module('enbitcoins')
  .constant('apiUrl', 'https://api.enbitcoins.com')
  .constant('apiCountry', subdomain);

// App configuration
angular.module('enbitcoins')
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    // Set html5Mode
    $locationProvider.html5Mode(true);
    // $locationProvider.hashPrefix('!');

    // Set routes
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .when('/1:addr', {
        templateUrl: 'views/tx-view.html',
        controller: 'TransactionController'
      });
  }]);
