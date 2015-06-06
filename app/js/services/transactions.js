'use strict';

angular.module('enbitcoins.services')
  .factory('Transactions', ['$resource', 'apiUrl', 'apiCountry', function($resource, apiUrl, apiCountry) {

    var urlResource = apiUrl + '/ticker?country=' + apiCountry;

    return $resource(urlResource, {},
    {
      getLastPrice : { method: 'GET' }
    });

  }]);
