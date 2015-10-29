'use strict';

angular.module('enbitcoins.controllers')
  .controller('HomeCtrl', ['$rootScope', '$scope', '$timeout', '$location', '$http', 'notifications', 'apiUrl', 'apiCountry', 'Payments', function($rootScope, $scope, $timeout, $location, $http, notifications, apiUrl, apiCountry, Payments) {

    $scope.$watch('company.selected', function(newVal, oldVal) {
      if (oldVal !== newVal) {
        $scope.payment.company = newVal._id;
        $scope.setStep(2);
      }
    });

    $scope.init = function() {
      $scope.payment = {};
      $scope.uploadLoading = false;
      $scope.step = 1;
    };

    $scope.getCompanies = function(company) {
      var params = {
        q: company,
        country: apiCountry
      };

      return $http
        .get(apiUrl + '/companies', { params: params })
        .then(function(response) {
          return response.data;
        });
    };

    $scope.selectCompany = function(item) {
      $scope.company = item;
      $scope.payment.company = item._id;
      $scope.payment.file = null;

      $scope.setStep(2);
    };

    $scope.confirm = function() {
      $scope.sending = true;

      Payments
        .create($scope.payment, function(response) {
          $rootScope.paymentPin = $scope.payment.pin;
          $scope.sending = false;

          $location.path(response.addr);
        }, function(error) {
          notifications.error(error.data.message);
          $scope.sending = false;
        });
    };

    $scope.setStep = function(step) {
      $scope.step = step;

      if (step === 2) {
        $timeout(function() {
          document.getElementById('amount').focus();
        });
      }
    };

    $scope.onUpload = function() {
      $scope.uploadLoading = true;
    };

    $scope.onSuccess = function(response) {
      $scope.payment.file = response.data.file;
      $scope.payment.company = null;
      $scope.company = null;

      $scope.setStep(2);
    };

    $scope.onError = function(response) {
      console.log('upload onError', response);
      notifications.error('Error al subir el archivo.');
    };

    $scope.onComplete = function() {
      $scope.uploadLoading = false;
    };

  }]);
