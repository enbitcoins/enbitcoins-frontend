'use strict';

angular.module('enbitcoins.controllers')
  .controller('HomeCtrl', ['$rootScope', '$scope', '$timeout', '$location', '$http', 'notifications', 'apiUrl', 'apiCountry', function($rootScope, $scope, $timeout, $location, $http, notifications, apiUrl, apiCountry) {

    $scope.$watch('company.selected', function(newVal, oldVal) {
      if (oldVal !== newVal) {
        $scope.payment.company = newVal._id;
        $scope.step = 2;

        $timeout(function() {
          document.getElementById('amount').focus();
        });
      }
    });

    $scope.init = function() {
      $scope.companies = [];
      $scope.company = {};
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

    $scope.confirm = function() {
      $scope.sending = true;

      var paymentUrl = apiUrl + '/payments?country=' + $rootScope.country.slug;
      $http
        .post(paymentUrl, $scope.payment)
        .then(function(response) {
          console.log('response', response);
          $location.path(response.addr);
          $scope.sending = false;
        }, function(error) {
          notifications.error(error.data.message);
          $scope.sending = false;
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
