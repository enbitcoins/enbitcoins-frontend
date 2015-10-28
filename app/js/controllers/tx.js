'use strict';

angular.module('enbitcoins.controllers')
  .controller('TransactionCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'notifications', 'Transactions', 'Payments', function($rootScope, $scope, $routeParams, $location, notifications, Transactions, Payments) {

    var _getFileUrl = function(billFile) {
      return 'https://files.enbitcoins.com/' + $rootScope.country.slug + '/' + billFile;
    };

    var _getStep = function(status) {
      var step;

      switch (status) {
      case 'waitingForBitcoins':
        step = 0;
        break;

      case 'waitingForConfirmations':
        step = 1;
        break;

      case 'waitingForMoreBitcoins':
        step = 1;
        break;

      case 'waitingForProvision':
        step = 2;
        break;

      case 'provisioned':
        step = 3;
        break;
      }

      return step;
    };

    $scope.init = function() {
      $scope.step = 0;
      $scope.ready = false;

      if ($rootScope.paymentPin) {
        $scope.validatePin();
      } else {
        $scope.isPrivate = false;

        Transactions
          .get({
            addr: $routeParams.addr
          }, function(response) {
            $scope.isPrivate = true;
            $scope.ready = true;

            if ( ! response.private) {
              $scope.isPrivate = false;
              $scope.step = _getStep(response.status);
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
      }
    };

    $scope.validatePin = function() {
      $scope.sending = true;

      Transactions
        .validatePin({
          pin: $rootScope.paymentPin,
          addr: $routeParams.addr
        }, function(response) {
          $scope.isPrivate = false;
          $scope.step = _getStep(response.status);
          $scope.tx = response;

          if (response.bill_file) {
            $scope.fileUrl = _getFileUrl(response.bill_file);
          }

          if (response.provisioning_file) {
            $scope.downloadFile = _getFileUrl(response.provisioning_file);
          }

          $scope.sending = false;
          $scope.ready = true;
        }, function() {
          notifications.error('Error al obtener esta transacción.');
          $scope.sending = false;
          $scope.ready = true;
        });
    };

    $scope.copyAddr = function() {
      notifications.success('Dirección copiada.');
    };

    $scope.checkPayment = function() {
      $scope.checkingPayment = true;

      Payments
        .check({
          addr: $routeParams.addr
        }, function(response) {
          console.log('checkPayment response', response);
          $scope.checkingPayment = false;
        }, function(error) {
          notifications.error('Lo sentimos, pero aún no se ha realizado la transacción.');
          $scope.checkingPayment = false;
        });
    };

    $scope.showCheckButton = function() {
      var limitDate = moment($scope.tx.created_date).add(20, 'm');
      console.log('showCheckButton', $scope.tx.created_date, limitDate);
      return moment().isAfter(limitDate);
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
