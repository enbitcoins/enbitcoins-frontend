'use strict';

angular.module('enbitcoins.services')
  .factory('Transactions', ['$resource', 'apiUrl', 'apiCountry', function($resource, apiUrl, apiCountry) {

    var urlResource = apiUrl + '/addrs/:addr?country=' + apiCountry;

    return $resource(urlResource, {},
    {
      get: { method: 'GET' }
    });

  }]);
