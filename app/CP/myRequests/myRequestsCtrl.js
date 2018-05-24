angular.module('Frugal').controller('myRequestsCtrl', ['$scope', 'CPService', '$timeout', '$state','$cookies',
    function ($scope, CPService, $timeout, $state,$cookies) {


        $scope.init = function () {

            $scope.set = 0;

            $scope.error = 0;
            $scope.error_message = "";



            $scope.requests = [];




            NProgress.start();
            CPService.getAllRequests($cookies.get('cust_id'), $cookies.get('cust_access_token'), function (status, data) {

                if (status == 200) {
                    data.sort(function (a, b) {

                        a1 = new Date(a.projectCreatedDateTime);
                        b1 = new Date(b.projectCreatedDateTime);

                        if (a1 == b1)
                            return 0;
                        else if (a1 < b1)
                            return -1;
                        else
                            return +1;
                    });

                    data = data.reverse();

                    $scope.render(data, 0, function () {
                        NProgress.done();
                        $scope.set = 1;
                    });
                }
                else {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });
        };

        $scope.render = function (data, i, callback) {
            if (i == data.length)
                callback();
            else {
                $timeout(function () {
                    $scope.requests.push(data[i]);
                    NProgress.inc();
                    $scope.render(data, i + 1, function () {
                        callback();
                    });

                }, 200);

            }
        };





        $scope.init();


    }]);