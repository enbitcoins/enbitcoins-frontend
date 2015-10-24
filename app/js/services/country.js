'use strict';

angular.module('enbitcoins.services')
  .factory('Ticker', ['$resource', 'apiUrl', 'apiCountry', function($resource, apiUrl, apiCountry) {

    var urlResource = apiUrl + '/country?country=' + apiCountry;

    return $resource(urlResource, {},
    {
      get : { method: 'GET' }
    });

  }]);
