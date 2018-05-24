angular.module('Frugal').controller('MainCtrl', ['$scope', '$cookies', '$location', 'CPService', 'SPService',
    function ($scope, $cookies, $location, CPService, SPService) {


        $scope.getCurrentPath = function () {
            return $location.path();
        };

        $scope.getObjectLength = function (obj) {
            return Object.keys(obj).length;
        };


        $scope.getCookie = function (id) {
            return $cookies.get(id);
        };


        $scope.hash = function (id) {
            $location.hash(id);
        };

        $scope.isLogin = function () {
            return CPService.isLogin();
        };


        $scope.submitLogout = function () {
            NProgress.start();
            CPService.logout(function () {
                NProgress.set(0.8);
                NProgress.done();
                $location.path('/Home');
            });

        };




        $scope.isSPLogin = function () {
            return SPService.isLogin();
        };

        $scope.submitSPLogout = function () {
            NProgress.start();
            SPService.logout($cookies.get('sp_id'), $cookies.get('sp_access_token'), function (status) {
                if (status == 200) {
                    NProgress.set(0.8);
                    NProgress.done();
                    $location.path('/Home');
                }
                else {
                    NProgress.done();
                    alert('error');
                }
            });

        };


        $scope.isValidName = function (name) {
            var regex = new RegExp(/^[a-zA-Z]+$/);
            console.log(name);

            return regex.test(name);
        };

        $scope.isValidEmail = function (email) {
            var regex = new RegExp(/^([a-zA-Z0-9._-]+)@([a-zA-Z0-9]+).([a-zA-Z0-9]+)$/);

            return regex.test(email);
        };


    }]);