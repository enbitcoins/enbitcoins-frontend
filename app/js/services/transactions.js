'use strict';

angular.module('enbitcoins.services')
  .factory('Transactions', ['$resource', 'apiUrl', 'apiCountry', function($resource, apiUrl, apiCountry) {

    var urlResource = apiUrl + '/addrs/:addr';

    return $resource(urlResource, {
      addr: '@addr'
    },
    {
      get: {
        url: urlResource + '?country=' + apiCountry,
        method: 'GET'
      },
      validatePin: {
        url: urlResource + '?country=' + apiCountry,
        method: 'POST'
      },
      askRefund: {
        url: urlResource + '/refund?country=' + apiCountry,
        method: 'POST'
      },
      correction: {
        url: urlResource + '/correction?country=' + apiCountry,
        method: 'POST'
      }
    });

  }]);
