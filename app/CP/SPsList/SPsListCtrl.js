angular.module('Frugal').controller('SPsListCtrl', ['$scope', '$timeout', '$state', 'CPService', '$cookies','localStorageService',
    function ($scope, $timeout, $state, CPService, $cookies,localStorageService) {

        $scope.init = function () {

            $scope.set = 0;

            $scope.error = 0;
            $scope.error_message = "";
            $scope.success = 0;
            $scope.ongoing = 0;

            $scope.splist = [];

            $scope.spids = angular.fromJson($cookies.get('spids'));

            console.log($scope.spids);


            if (typeof $cookies.get('subCatId')=="undefined") {
                $state.go('welcomeScreen');
            }

            NProgress.start();
            CPService.getSPLocationList($cookies.get('cust_id'), $cookies.get('cust_access_token'),$cookies.get('subCatId'),$cookies.get('locationType'), angular.fromJson($cookies.get('locationArray')), function (status, data) {

                if (status == 200) {
                    var i;
                    for (i = 0; i < data.length; i++) {
                        var rating = data[i].averageRatings;

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
                        data[i].full = full;
                        data[i].half = half;
                        data[i].empty = empty;
                        data[i].imageLoaded =0;
                        data[i].spImage = data[i].spImage + "?s=" + Math.random();
                    }

                    console.log(data);

                    if (data.length == 0)
                        $scope.set = 1;
                    $scope.render(data, 0, function () {
                        NProgress.done();
                        console.log($scope.splist);
                    });
                }

                else {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });
        };


        $scope.render = function (list, i, callback) {
            if (i == list.length)
                callback();
            else if (i == 0) {
                $timeout(function () {
                    $scope.splist.push(list[i]);
                    NProgress.inc();
                    $scope.set = 1;
                    $scope.render(list, i + 1, function () {
                        callback();
                    });

                }, 200);
            }

            else {
                $timeout(function () {
                    $scope.splist.push(list[i]);
                    NProgress.inc();
                    $scope.render(list, i + 1, function () {
                        callback();
                    });

                }, 200);

            }
        };

        $scope.isSPIdPresent = function (id) {
            if ($scope.spids.indexOf(id) == -1)
                return 0;
            else
                return 1;
        };

        $scope.toggleCheckbox = function (id) {
            if ($scope.spids.indexOf(id) == -1) {
                // insert
                $scope.spids.push(id);
            }
            else {
                var index = $scope.spids.indexOf(id);
                $scope.spids.splice(index, 1);
            }

            console.log($scope.spids);
        };

        $scope.createArray = function (n) {
            var x = [];
            for (i = 1; i <= n; i++) {
                x.push(i);
            }
            return x;
        };

        $scope.goSPDetail = function (sp_id)
        {
           $cookies.put('spids', angular.toJson($scope.spids),true);
           $state.go('CP.SPDetails',{spId:sp_id,ancestor:"fromList"});
        };

        $scope.submitProposal = function () {
            if ($scope.spids.length == 0) {
                $scope.error_message = "Please Select atleast 1 Service Providers to Request for Proposal";
                $scope.error = 1;
                return;
            }

            $scope.ongoing = 1;


            CPService.createRequest($cookies.get('cust_id'),$cookies.get('cust_access_token'),$cookies.get('subCatId'), $scope.spids.toString(), 1, angular.fromJson(localStorageService.get('AForm')), angular.fromJson(localStorageService.get('QForm')), angular.fromJson(localStorageService.get('PForm')), function (status, data) {

                if (status == 200) {
                    $cookies.remove('subCatId');
                    localStorageService.remove('QForm');
                    localStorageService.remove('PForm');
                    localStorageService.remove('AForm');
                    $cookies.remove('locationType');
                    $cookies.remove('locationArray');
                    $cookies.remove('spids');
                    $scope.success = 1;
                    $timeout(function () {
                        $state.go("CP.myRequests");
                    }, 2000);

                }
                else {
                    $scope.error_message = "Something went wrong. Please try again";
                    $scope.error = 1;
                }
            });

        };

        $scope.submitAuction = function () {
            if ($scope.spids.length < 2) {
                $scope.error_message = "Please Select atleast 2 Service Providers to Setup Auction";
                $scope.error = 1;
                return;
            }


            $cookies.put('spids', angular.toJson($scope.spids), true);

            $state.go("CP.auctionForm");


        };

        $scope.removeErr = function () {
            $scope.error = 0;
        };


        $scope.init();
    }]);