angular.module('Frugal').controller('CPCtrl', ['$scope', 'CPService', 'SPService', '$timeout', '$state', '$cookies',
    function ($scope, CPService, SPService, $timeout, $state, $cookies) {

        $scope.init = function () {


        };


        $scope.submitLogout = function () {
            NProgress.start();
            CPService.logout(function () {
                $state.go("welcomeScreen");
                NProgress.done();

            });

        };


        $scope.init();
    }]);