'use strict';

angular.module('enbitcoins.controllers')
  .controller('TransactionCtrl', ['$rootScope', '$scope', '$routeParams', '$timeout', '$location', '$filter', 'notifications', 'Transactions', 'Payments', 'apiCountry', function($rootScope, $scope, $routeParams, $timeout, $location, $filter, notifications, Transactions, Payments, apiCountry) {

    var _getFileUrl = function(filename) {
      return 'https://files.enbitcoins.com/' + apiCountry + '/' + filename;
    };

    var _getBitcoinUrl = function(tx) {
      return 'bitcoin:' + tx.addr + '?amount=' + $filter('toBitcoins')($scope.due || tx.due_amount_satoshis);
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

      case 'waitingForCorrection':
        step = 2;
        break;

      case 'waitingForRefund':
        step = 2;
        break;

      case 'waitingForProvision':
        step = 2;
        break;

      case 'finished':
        step = 3;
        break;

      case 'refunded':
        step = 4;
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
    };

    $scope.init = function() {
      $scope.urlPin = $location.search().pin || null;
      $scope.step = 0;
      $scope.ready = false;
      $scope.due = null;

      $scope.showRefundForm = false;
      $scope.showCorrectionForm = false;

      if ($rootScope.paymentPin || ($scope.urlPin && $scope.urlPin !== 'null')) {
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
      notifications.success('Dirección copiada.');
    };

    $scope.checkPayment = function() {
      $scope.checkingPayment = true;

      Payments
        .check({
          addr: $routeParams.addr
        }, function(response) {
          if ($rootScope.paymentPin) {
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
      return moment().isAfter(limitDate);
    };

    $scope.toggleRefund = function() {
      $scope.showRefundForm = !$scope.showRefundForm;

      if ($scope.showRefundForm === true) {
        $timeout(function() {
          var input = angular.element(document.getElementById('refund-addr'));
          input[0].focus();
        }, 400);
      }
    };

    $scope.toggleCorrection = function() {
      $scope.showCorrectionForm = !$scope.showCorrectionForm;

      if ($scope.showCorrectionForm === true) {
        $timeout(function() {
          var textarea = angular.element(document.getElementById('correction-response'));
          textarea[0].focus();
        }, 400);
      }
    };

    $scope.responseCorrection = function() {
      $scope.sending = true;

      Transactions
        .correction({
          addr: $routeParams.addr,
          msg: $scope.correctionResponse
        }, function() {
          $scope.sending = false;
          $scope.correctionResponse = null;
          $scope.toggleCorrection();

          notifications.success('Respuesta enviada correctamente.');
        }, function() {
          notifications.error('Error al enviar la respuesta.');
          $scope.sending = false;
        });
    };

    $scope.askRefund = function() {
      $scope.sending = true;

      Transactions
        .askRefund({
          addr: $routeParams.addr,
          refund_addr: $scope.refundAddr
        }, function(response) {
          $scope.sending = false;

          notifications.success('Solicitud de reembolso enviada correctamente.');

          if ($rootScope.paymentPin) {
            $scope.validatePin();
          } else {
            _getTx();
          }
        }, function() {
          notifications.error('Error al solicitar el reembolso.');
          $scope.sending = false;
        });
    };

  }]);
