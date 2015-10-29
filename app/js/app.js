'use strict';

angular.module('enbitcoins', [
  'ngRoute',
  'ngResource',
  'ngSanitize',
  'ngClipboard',

  'angularTypewrite',
  'angular-growl',
  'ui.bootstrap',
  'ui.bootstrap.tpls',
  'lr.upload',

  'templates',

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

if (subdomain === 'localhost') {
  subdomain = 'argentina';
}

// Constants
angular.module('enbitcoins')
  .constant('apiUrl', 'https://api.enbitcoins.com/v1')
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
        controller: 'HomeCtrl'
      })
      .when('/404', {
        templateUrl: 'views/404.html'
      })
      .when('/faq', {
        templateUrl: 'views/faq.html'
      })
      .when('/seguridad', {
        templateUrl: 'views/seguridad.html'
      })
      .when('/:addr', {
        templateUrl: 'views/tx-view.html',
        controller: 'TransactionCtrl'
      });
  }])

  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath('lib/ZeroClipboard.swf');
  }])

  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|bitcoin):/);
  }]);
