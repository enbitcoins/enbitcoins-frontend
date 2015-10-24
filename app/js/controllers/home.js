'use strict';

angular.module('enbitcoins.controllers')
  .controller('HomeCtrl', ['$rootScope', '$scope', '$location', 'notifications', function($rootScope, $scope, $location, notifications) {

    $scope.init = function() {
      $scope.step = 0;
      var status = $location.search().status;

      switch (status) {
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

      $scope.tx = {
        status: status
      };
    };



  }]);
