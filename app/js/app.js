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
  'pascalprecht.translate',

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

var lang;
switch (subdomain) {
  case 'brasil':
    lang = 'pt';
    break;
    case 'russia':
      lang = 'ru';
      break;
  default:
    lang = 'es';
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

  .config(['$translateProvider', function($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escape');

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', '/i18n/' + lang + '.json');
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === XMLHttpRequest.DONE) {
        if (xmlHttp.status === 200) {
          var response = JSON.parse(xmlHttp.responseText);
          $translateProvider.translations(lang, response);
        }
      }
    };

    xmlHttp.send();
  }])

  .config(['$compileProvider', function($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|bitcoin):/);
  }])

  .run(['$translate', function ($translate) {
    $translate.use(lang);
  }]);
