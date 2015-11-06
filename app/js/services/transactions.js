'use strict';

angular.module('enbitcoins.services')
  .factory('Transactions', ['$resource', 'apiUrl', 'apiCountry', function($resource, apiUrl, apiCountry) {

    var urlResource = apiUrl + '/addrs/:addr';

    return $resource(urlResource, {
      addr: '@addr',
      refund_addr: '@refund_addr',
      msg: '@msg'
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
