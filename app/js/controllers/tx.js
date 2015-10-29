'use strict';

angular.module('enbitcoins.controllers')
  .controller('TransactionCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$filter', 'notifications', 'Transactions', 'Payments', 'apiCountry', function($rootScope, $scope, $routeParams, $location, $filter, notifications, Transactions, Payments, apiCountry) {

    var _getFileUrl = function(filename) {
      return 'https://files.enbitcoins.com/' + apiCountry + '/' + filename;
    };

    var _getBitcoinUrl = function(tx) {
      return 'bitcoin:' + tx.addr + '?amount=' + $filter('toBitcoins')(tx.due_amount_satoshis);
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

      case 'finished':
        step = 3;
        break;
      }

      return step;
    };

    var _getTx = function() {
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

            $scope.bitcoinUrl = _getBitcoinUrl(response);
          }
        }, function(error) {
          if (error.data.code === 404) {
            $location.path('404');
          }
        });
    };

    $scope.init = function() {
      $scope.urlPin = $location.search().pin || null;
      $scope.step = 0;
      $scope.ready = false;

      if ($rootScope.paymentPin || $scope.urlPin) {
        $scope.validatePin();
      } else {
        $scope.isPrivate = false;

        _getTx();
      }
    };

    $scope.validatePin = function() {
      $scope.sending = true;

      Transactions
        .validatePin({
          pin: $rootScope.paymentPin || $scope.urlPin,
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

          $scope.bitcoinUrl = _getBitcoinUrl(response);

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

          if ($rootScope.paymentPin) {
            $scope.validatePin();
          } else {
            _getTx();
          }

          $scope.checkingPayment = false;
        }, function(error) {
          notifications.error('Lo sentimos, pero aún no se ha realizado la transacción.');
          $scope.checkingPayment = false;
        });
    };

    $scope.showCheckButton = function() {
      var limitDate = moment($scope.tx.created_date).add(20, 'm');
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
