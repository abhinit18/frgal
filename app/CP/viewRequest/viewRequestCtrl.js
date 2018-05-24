angular.module('Frugal').controller('viewRequestCtrl', ['$scope', 'CPService', '$timeout', '$state', '$stateParams','$cookies',
    function ($scope, CPService, $timeout, $state, $stateParams,$cookies) {


        $scope.init = function () {
            $scope.set = 0;

            $scope.error = 0;
            $scope.error_message = "";
            $scope.success = 0;


            $scope.requestData = {};
            $scope.projectId = $stateParams.projectId;
            $scope.submitted = [];
            $scope.due = [];

            if (!$scope.$parent.isLogin()) {
                $scope.error_message = 'You have to log in to view this page. You are being redirected to Home page';
                $scope.error = 4;
                $timeout(function () {
                    $state.go("welcomeScreen");
                }, 2000);
                return;
            }

            NProgress.start();
            CPService.ListSPForRequest($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.projectId, function (status, data) {
                if (status == 200) {
                    var i,random;
                    var imagePathArray = [];
                    var imageRandomArray = [];
                    for (i = 0; i < data.engagementsData.length; i++) {
                        if (imagePathArray.indexOf(data.engagementsData[i].spImage) == -1) {
                            imagePathArray.push(data.engagementsData[i].spImage);

                            random = Math.random();
                            imageRandomArray.push(random);
                            data.engagementsData[i].spImage = data.engagementsData[i].spImage + "?s=" + random;
                        }
                        else {
                            data.engagementsData[i].spImage = data.engagementsData[i].spImage + "?s=" + imageRandomArray[imagePathArray.indexOf(data.engagementsData[i].spImage)];
                        }
                        data.engagementsData[i].imageLoaded = 0;
                    }
                    $scope.requestData = data;
                    console.log($scope.requestData);
                    $scope.set = 1;


                    for (i = 0; i < $scope.requestData.engagementsData.length; i++) {
                        if ($scope.requestData.engagementsData[i] != null && ($scope.requestData.engagementsData[i].engagementStatus == 'SUBMITTED_FOR_PROPOSAL' || $scope.requestData.engagementsData[i].engagementStatus == 'AUCTION_IN_PROGRESS')) {

                            var rating = $scope.requestData.engagementsData[i].averageRatings;

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
                            $scope.requestData.engagementsData[i].full = full;
                            $scope.requestData.engagementsData[i].half = half;
                            $scope.requestData.engagementsData[i].empty = empty;
                            $scope.submitted.push($scope.requestData.engagementsData[i]);
                            NProgress.inc();
                        }

                    }

                    for (i = 0; i < $scope.requestData.engagementsData.length; i++) {
                        if ($scope.requestData.engagementsData[i] != null && $scope.requestData.engagementsData[i].engagementStatus == 'DUE') {
                            var rating = $scope.requestData.engagementsData[i].averageRatings;

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
                            $scope.requestData.engagementsData[i].full = full;
                            $scope.requestData.engagementsData[i].half = half;
                            $scope.requestData.engagementsData[i].empty = empty;
                            $scope.due.push($scope.requestData.engagementsData[i]);
                            NProgress.inc();
                        }
                    }
                    NProgress.done();

                }
                else {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });

        };

        $scope.createArray = function (n) {
            var x = [];
            for (i = 1; i <= n; i++) {
                x.push(i);
            }
            return x;
        };



        $scope.engage = function (project_id, spId) {
            CPService.engageSP($cookies.get('cust_id'), $cookies.get('cust_access_token'), project_id, spId, function (status, data) {

                if (status == 200) {
                    $scope.success = spId;
                    $timeout(function () {
                        $state.go("CP.myProjects");
                    }, 5000);
                }
                else {
                    $scope.error_message = "Something went wrong. Please try again";
                    $scope.error =1;
                }
            });
        };

        $scope.init();
    }]);
