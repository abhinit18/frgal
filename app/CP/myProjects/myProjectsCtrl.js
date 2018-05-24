angular.module('Frugal').controller('myProjectsCtrl', ['$scope', 'CPService', '$timeout', '$state','$cookies',
    function ($scope, CPService, $timeout, $state,$cookies) {


        $scope.openPopup = function (id, project_id) {
            $scope.project_id_to_rate = project_id;
            $('#' + id).modal('show');

        };

        $scope.closePopup = function (id) {
            $('#' + id).modal('hide');

        };

        $scope.init = function () {
            $scope.set = 0;

            $scope.error = 0;
            $scope.error_message = "";
            $scope.success = 0;

            $scope.project_id_to_rate = "";
            $scope.projectData = [];
            $scope.ongoing = [];
            $scope.completed = [];

            $scope.rating = 0;
            $scope.review = "";

            $scope.limit = {"ongoing": 4, "completed": 4};


            NProgress.start();
            CPService.getAllProjects($cookies.get('cust_id'), $cookies.get('cust_access_token'), function (status, data) {
                if (status == 200) {
                    var i,random;
                    var imagePathArray = [];
                    var imageRandomArray = [];
                    for (i = 0; i < data.length; i++) {
                        if(imagePathArray.indexOf(data[i].engagementsData[0].spImage)==-1)
                        {
                            imagePathArray.push(data[i].engagementsData[0].spImage);

                            random=Math.random();
                            imageRandomArray.push(random);
                            data[i].engagementsData[0].spImage = data[i].engagementsData[0].spImage + "?s=" + random;
                        }
                        else
                        {
                            data[i].engagementsData[0].spImage = data[i].engagementsData[0].spImage + "?s=" + imageRandomArray[imagePathArray.indexOf(data[i].engagementsData[0].spImage)];
                        }
                        data[i].imageLoaded = 0;
                    }
                    $scope.projectData = data;
                    console.log($scope.projectData);
                    $scope.set = 1;


                    for (i = 0; i < $scope.projectData.length; i++) {
                        if ($scope.projectData[i].projectStatus == 'ONGOING') {
                            var rating = $scope.projectData[i].engagementsData[0].averageRatings;

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
                            $scope.projectData[i].full = full;
                            $scope.projectData[i].half = half;
                            $scope.projectData[i].empty = empty;
                            $scope.ongoing.push($scope.projectData[i]);
                            NProgress.inc();
                        }

                    }

                    $scope.ongoing.sort(function (a, b) {

                        a1 = new Date(a.projectCreatedDateTime);
                        b1 = new Date(b.projectCreatedDateTime);

                        if (a1 == b1)
                            return 0;
                        else if (a1 < b1)
                            return -1;
                        else
                            return +1;
                    });

                    $scope.ongoing = $scope.ongoing.reverse();

                    for (i = 0; i < $scope.projectData.length; i++) {
                        if ($scope.projectData[i].projectStatus == 'COMPLETED') {

                            var rating = $scope.projectData[i].engagementsData[0].averageRatings;

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
                            $scope.projectData[i].full = full;
                            $scope.projectData[i].half = half;
                            $scope.projectData[i].empty = empty;
                            $scope.completed.push($scope.projectData[i]);
                            NProgress.inc();
                        }

                    }

                    $scope.completed.sort(function (a, b) {

                        a1 = new Date(a.projectCompletedDateTime);
                        b1 = new Date(b.projectCompletedDateTime);

                        if (a1 == b1)
                            return 0;
                        else if (a1 < b1)
                            return -1;
                        else
                            return +1;
                    });

                    $scope.completed = $scope.completed.reverse();

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



        $scope.submitRating = function () {
            CPService.rateProject($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.project_id_to_rate, $scope.rating, $scope.review, function (status, data) {

                if (status == 200) {
                    $scope.success = 1;
                    $timeout(function () {
                        $scope.closePopup('ratingModal');
                        $scope.init();
                    }, 2000);


                }
                else {
                    $scope.error_message = 'We are Sorry!!! Something went wrong. Try again';
                    $scope.error = 1;
                }
            })
        };

        $scope.init();

    }]);