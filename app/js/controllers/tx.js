'use strict';

angular.module('enbitcoins.controllers')
  .controller('TransactionController', ['$rootScope', '$scope', '$routeParams', 'Transactions', function($rootScope, $scope, $routeParams, Transactions) {

    $scope.init = function() {
      Transactions
        .get({
          addr: $routeParams.addr
        }, function(response) {
          $scope.transaction = response.transaction;
        });
    };

    $scope.validatePin = function() {
      Transactions
        .validate({
          pin: $scope.pin
        }, function(response) {
          $scope.transaction = response.transaction;
        });
    };

    $scope.askRefund = function() {

      // TODO: validate addr before send

      $rootScope.loading = true;

      Transactions
        .askRefund({
          addr: $routeParams.addr,
          addrRefund: $scope.addrRefund
        }, function(response) {
          $rootScope.loading = false;
          // $scope.refund
        }, function(response) {
          $rootScope.loading = false;

        });
    };

  }]);
