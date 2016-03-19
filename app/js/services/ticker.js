'use strict';

angular.module('enbitcoins.services')
  .factory('Ticker', ['$resource', 'apiUrl', function($resource, apiUrl) {

    var urlResource = apiUrl + '/ticker';

    return $resource(urlResource, {},
    {
      query: {
        method: 'GET',
        isArray: true
      }
    });

  }]);
