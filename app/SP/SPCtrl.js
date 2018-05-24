angular.module('Frugal').controller('SPCtrl', ['$scope', 'CPService', 'SPService', '$timeout', '$state', '$cookies',
    function ($scope, CPService, SPService, $timeout, $state, $cookies) {

        $scope.init = function () {


        };



        $scope.submitSPLogout = function () {
            NProgress.start();
            SPService.logout($cookies.get('sp_id'), $cookies.get('sp_access_token'), function (status) {
                if (status == 200) {
                    NProgress.done();
                    $state.go("welcomeScreen");
                }
                else {
                    NProgress.done();
                    $state.go("welcomeScreen");
                }
            });

        };



        $scope.init();
    }]);