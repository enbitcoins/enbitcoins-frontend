'use strict';

angular.module('enbitcoins.controllers')
  .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$http', 'notifications', 'apiUrl', 'apiCountry', function($rootScope, $scope, $location, $http, notifications, apiUrl, apiCountry) {

    $scope.init = function() {
      $scope.company = {};
      $scope.companies = [];
      $scope.payment = {};
      $scope.uploadLoading = false;
      $scope.step = 1;
    };

    $scope.refreshCompanies = function(company) {
      var params = {
        q: company,
        country: apiCountry
      };

      $http
        .get(apiUrl + '/companies', { params: params })
        .then(function(response) {
          $scope.companies = response.data;
        });
    };

    $scope.setStep = function(step) {
      $scope.step = step;
    };

    $scope.onUpload = function() {
      $scope.uploadLoading = true;
    };

    $scope.onSuccess = function(response) {
      $scope.step = 2;
      $scope.payment.file = response.data.file;
    };

    $scope.onError = function(response) {
      notifications.error('Error al subir el archivo.');
    };

    $scope.onComplete = function(response) {
      $scope.uploadLoading = false;
    };

  }]);
