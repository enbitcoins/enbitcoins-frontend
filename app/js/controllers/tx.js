'use strict';

angular.module('enbitcoins.controllers')
  .controller('TransactionCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'notifications', 'Transactions', function($rootScope, $scope, $routeParams, $location, notifications, Transactions) {

    var _getFileUrl = function(billFile) {
      return 'https://files.enbitcoins.com/' + $rootScope.country.slug + '/' + billFile;
    };

    $scope.init = function() {
      $scope.step = 0;

      Transactions
        .get({
          addr: $routeParams.addr
        }, function(response) {
          if ( ! response.private) {
            switch (response.status) {
            case 'waitingForBitcoins':
              $scope.step = 0;
              break;

            case 'waitingForConfirmations':
              $scope.step = 1;
              break;

            case 'waitingForMoreBitcoins':
              $scope.step = 1;
              break;

            case 'waitingForProvision':
              $scope.step = 2;
              break;

            case 'provisioned':
              $scope.step = 3;
              break;
            }

            $scope.tx = response;

            if (response.bill_file) {
              $scope.fileUrl = _getFileUrl(response.bill_file);
            }

            if (response.provisioning_file) {
              $scope.downloadFile = _getFileUrl(response.provisioning_file);
            }
          }
        }, function(error) {
          if (error.data.code === 404) {
            $location.path('404');
          }
        });
    };

    $scope.validatePin = function() {
      $rootScope.loading = true;

      Transactions
        .validate({
          pin: $scope.pin
        }, function(response) {
          $scope.transaction = response;
          $rootScope.loading = false;
        }, function() {
          notifications.error('Error al obtener esta transacción.');
          $rootScope.loading = false;
        });
    };

    $scope.copyAddr = function() {
      notifications.success('Dirección copiada.');
    };

    // $scope.askRefund = function() {
    //   $rootScope.loading = true;

    //   Transactions
    //     .askRefund({
    //       addr: $routeParams.addr,
    //       addrRefund: $scope.addrRefund
    //     }, function(response) {
    //       $rootScope.loading = false;
    //       // $scope.refund
    //     }, function() {
    //       notifications.error('Error asking for refund.');
    //       $rootScope.loading = false;
    //     });
    // };

  }]);
