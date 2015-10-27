'use strict';

angular.module('enbitcoins.controllers')
  .controller('ContactModalCtrl', ['$scope', '$modalInstance', '$http', 'notifications', 'apiUrl', 'apiCountry', 'addr', function($scope, $modalInstance, $http, notifications, apiUrl, apiCountry, addr) {

    $scope.sending = false;

    $scope.submit = function() {
      $scope.sending = true;

      $http
        .post(apiUrl + '/contact?country=' + apiCountry, {
          msg: $scope.msg,
          email: $scope.email,
          addr: addr
        })
        .success(function() {
          $scope.sending = false;
          $scope.msg = null;
          $scope.email = null;

          $modalInstance.dismiss('close');
          notifications.success('Mensaje enviado correctamente.');
        })
        .error(function() {
          $scope.sending = false;
          notifications.error('Error al enviar el mensaje.');
        });
    };

    $scope.close = function() {
      $modalInstance.dismiss('cancel');
    };

  }]);
