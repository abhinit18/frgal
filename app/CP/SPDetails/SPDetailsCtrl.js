angular.module('Frugal').controller('SPDetailsCtrl', ['$scope', 'CPService', '$state', '$cookies', '$stateParams',
    function ($scope, CPService, $state, $cookies, $stateParams) {


        $scope.init = function () {
            $scope.set = 0;

            $scope.error = 0;
            $scope.error_message = "";

            $scope.spId = $stateParams.spId;
            $scope.ancestor = $stateParams.ancestor;
            console.log($scope.flag);
            $scope.spdetails = {};
            $scope.spImage = "";
            $scope.spids = angular.fromJson($cookies.get('spids'));




            NProgress.start();
            CPService.getSPProfile($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.spId, function (status, data) {
                if (status == 200) {
                    $scope.spdetails = data;
                    $scope.spImage = $scope.spdetails.spImage + "?s=" + Math.random();
                    $scope.imageLoaded=0;


                    var rating = $scope.spdetails.averageRatings;

                    var full, half, empty;
                    if (rating == Math.ceil(rating)) {
                        full = $scope.createArray(rating);
                        half = new Array(0);
                        empty = $scope.createArray(5 - rating);
                    }
                    else {
                        full = $scope.createArray(Math.floor(rating));
                        half = $scope.createArray(1);
                        empty = $scope.createArray(5 - Math.ceil(rating));
                    }
                    $scope.spdetails.full = full;
                    $scope.spdetails.half = half;
                    $scope.spdetails.empty = empty;

                    var i;
                    for (i = 0; i < $scope.spdetails.rating.length; i++) {
                        var rating = $scope.spdetails.rating[i].rating;

                        var full, half, empty;
                        if (rating == Math.ceil(rating)) {
                            full = $scope.createArray(rating);
                            half = new Array(0);
                            empty = $scope.createArray(5 - rating);
                        }
                        else {
                            full = $scope.createArray(Math.floor(rating));
                            half = $scope.createArray(1);
                            empty = $scope.createArray(5 - Math.ceil(rating));
                        }

                        $scope.spdetails.rating[i].full = full;
                        $scope.spdetails.rating[i].half = half;
                        $scope.spdetails.rating[i].empty = empty;
                    }

                    $scope.set = 1;
                    NProgress.done();
                    console.log($scope.spdetails);
                }
                else {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });
        };

        $scope.addSP = function (id) {
            if ($scope.spids.indexOf(id) == -1)
                $scope.spids.push(id);

            $cookies.put('spids', angular.toJson($scope.spids), true);
            $state.go("CP.SPsList")
        };

        $scope.createArray = function (n) {
            var x = [];
            var i;
            for (i = 1; i <= n; i++) {
                x.push(i);
            }
            return x;
        };


        $scope.init();

    }]);