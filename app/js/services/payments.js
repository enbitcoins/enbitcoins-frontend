'use strict';

angular.module('enbitcoins.services')
  .factory('Payments', ['$resource', 'apiUrl', 'apiCountry', function($resource, apiUrl, apiCountry) {

    var urlResource = apiUrl + '/payments?country=' + apiCountry;

    return $resource(urlResource, {},
    {
      create: {
        method: 'POST'
      },
      check: {
        url: apiUrl + '/payments/check?country=' + apiCountry,
        method: 'GET'
      }
    });

  }]);
