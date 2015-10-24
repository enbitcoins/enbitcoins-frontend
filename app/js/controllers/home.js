'use strict';

angular.module('enbitcoins.controllers')
  .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$http', 'notifications', 'apiUrl', 'apiCountry', function($rootScope, $scope, $location, $http, notifications, apiUrl, apiCountry) {

    $scope.company = {};
    $scope.companies = [];

    $scope.init = function() {
    };

    $scope.refreshCompanies = function(company) {
      var params = {
        q: company,
        country: apiCountry
      };

      return $http.get(
        apiUrl + '/companies',
        { params: params }
      ).then(function(response) {
        $scope.companies = response.data;
      });
    };

    $scope.onUpload = function(files) {
      console.log('onUpload', files);
    };

    $scope.onSuccess = function(response) {
      console.log('onSuccess', response);
    };

    $scope.onError = function(response) {
      console.log('onError', response);
    };

    $scope.onComplete = function(response) {
      console.log('onComplete', response);
    };

  }]);
