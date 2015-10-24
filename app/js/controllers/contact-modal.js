'use strict';

angular.module('enbitcoins.controllers')
  .controller('ContactModalCtrl', ['$scope', '$modalInstance', '$http', 'notifications', 'apiUrl', 'apiCountry', function($scope, $modalInstance, $http, notifications, apiUrl, apiCountry) {

    $scope.sending = false;

    $scope.submit = function() {
      $scope.sending = true;

      $http
        .post(apiUrl + '/contact?country=' + apiCountry)
        .success(function() {
          $scope.sending = false;
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
