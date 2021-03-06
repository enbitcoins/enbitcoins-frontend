'use strict';

angular.module('enbitcoins.controllers')
  .controller('TransactionCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', '$location', '$filter', 'notifications', 'Transactions', 'Payments', 'apiCountry', function($rootScope, $scope, $routeParams, $timeout, $location, $filter, notifications, Transactions, Payments, apiCountry) {

    function _getFileUrl(filename) {
      return 'https://files.enbitcoins.com/' + apiCountry + '/' + filename;
    }

    function _getBitcoinUrl(tx) {
      return 'bitcoin:' + tx.addr + '?amount=' + $filter('toBitcoins')($scope.due || tx.due_amount_satoshis);
    }

    function _getStep(status) {
      if (status === 'waitingForBitcoins') return 0;
      if (status === 'waitingForConfirmations') return 1;
      if (status === 'waitingForMoreBitcoins') return 1;
      if (status === 'waitingForCorrection') return 2;
      if (status === 'waitingForRefund') return 2;
      if (status === 'waitingForProvision') return 2;
      if (status === 'finished') return 3;
      if (status === 'refunded') return 4;
    }

    function _getTx() {
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

            if (response.status === 'waitingForMoreBitcoins') {
              $scope.due = response.due_amount_satoshis - response.paid_amount_satoshis;
            }

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
    }

    $scope.init = function() {
      var pin = parseInt($location.search().pin, 10) || null;

      $scope.urlPin = (angular.isNumber(pin) && pin > 0) ? pin : null;
      $scope.step = 0;
      $scope.ready = false;
      $scope.due = null;

      $scope.showRefundForm = false;
      $scope.showCorrectionForm = false;

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

          if (response.status === 'waitingForMoreBitcoins') {
            $scope.due = response.due_amount_satoshis - response.paid_amount_satoshis;
          }

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
      notifications.success('Dirección copiada en el portapapeles.');
    };

    $scope.copyAmount = function() {
      notifications.success('Monto copiado en el portapapeles.');
    };

    $scope.checkPayment = function() {
      $scope.checkingPayment = true;

      Payments
        .check({
          addr: $routeParams.addr
        }, function(response) {
          if ($rootScope.paymentPin || $scope.urlPin) {
            $scope.validatePin();
          } else {
            _getTx();
          }

          $scope.checkingPayment = false;
        }, function(error) {
          if (error.data.status) {
            $scope.due = error.data.due;
            $scope.step = 1;
            $scope.tx.status = 'waitingForMoreBitcoins';

            notifications.error('El monto transferido es inferior al solicitado.');
          } else {
            notifications.error('Lo sentimos, pero la transacción no se ha completado aún.');
          }

          $scope.checkingPayment = false;
        });
    };

    $scope.showCheckButton = function() {
      var limitDate = moment($scope.tx.created_date).add(20, 'm');
      return moment().isAfter(limitDate) || $scope.tx.status === 'cancelled';
    };

    $scope.toggleForm = function(id) {
      $scope.formToggled = id;
      $scope.formOpened = !$scope.formOpened;

      $timeout(function() {
        var input = angular.element(document.getElementById(id));
        input[0].focus();
      }, 400);
    };

    $scope.responseCorrection = function() {
      $scope.sending = true;

      Transactions
        .correction({
          msg: $rootScope.correctionMsg,
          addr: $routeParams.addr
        }, function() {
          $scope.sending = false;
          $scope.correctionMsg = '';
          $scope.toggleCorrection();

          notifications.success('Respuesta enviada correctamente.');
        }, function(error) {
          notifications.error(error.message || 'Error al enviar la respuesta.');
          $scope.sending = false;
        });
    };

    $scope.askRefund = function() {
      $scope.sending = true;

      Transactions
        .askRefund({
          refund_addr: $rootScope.refundAddr,
          addr: $routeParams.addr
        }, function(response) {
          $scope.sending = false;

          notifications.success('Solicitud de reembolso enviada correctamente.');

          if ($rootScope.paymentPin) {
            $scope.validatePin();
          } else {
            _getTx();
          }
        }, function(error) {
          notifications.error(error.message || 'Error al solicitar el reembolso.');
          $scope.sending = false;
        });
    };

  }]);
