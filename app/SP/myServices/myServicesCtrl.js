angular.module('Frugal').controller('myServicesCtrl', ['$scope', 'SPService', '$timeout', '$state','$http','$cookies',
    function ($scope, SPService, $timeout, $state,$http,$cookies) {


        $scope.init = function () {
            $scope.professions = [];
            $scope.set = 0;


            NProgress.start();
            SPService.showProfile($cookies.get('sp_id'), $cookies.get('sp_access_token'), function (status, data) {
                if (status == 200) {
                    console.log(data);
                    $scope.set=1;
                    $scope.render(data.profession,0,function(){
                        console.log($scope.professions);

                    });


                }
                else if (status == 404) {
                    $scope.set = 1;
                    NProgress.done();
                }
                else {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });

        };


        $scope.render = function(array,i,callback)
        {
            if(i==array.length)
            {
                NProgress.done();
                callback();
            }
            else
            {
                $scope.professions.push({});
                $scope.professions[i].catName = array[i].professionName;
                $scope.professions[i].subCatName = array[i].subCategoryName;
                $scope.professions[i].desc = array[i].description;

                if(array[i].servingAreaType=="ZIPCODE")
                {
                    $scope.professions[i].locationType = "ZIPCODE";
                    $scope.professions[i].zipcodes="";

                    var j;
                    for(j=0;j<array[i].zipCodes.length;j++)
                    {
                        $scope.professions[i].zipcodes = $scope.professions[i].zipcodes + array[i].zipCodes[j] +",";
                    }

                    NProgress.inc();
                    $scope.render(array,i+1,function(){
                        callback();
                    });
                }
                else if(array[i].servingAreaType=="TOWN")
                {
                    $scope.professions[i].locationType = "TOWN";
                    $scope.professions[i].locality="";

                    var j;
                    for(j=0;j<array[i].towns.length;j++)
                    {
                        $scope.professions[i].locality = $scope.professions[i].locality + array[i].towns[j] +",";
                    }

                    NProgress.inc();
                    $scope.render(array,i+1,function(){
                        callback();
                    });
                }
                else if(array[i].servingAreaType=="RADIUS")
                {
                    $scope.professions[i].locationType = "RADIUS";
                    $scope.professions[i].radius = array[i].radius;

                    $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + array[i].latitude + "," + array[i].longitude + "&key=AIzaSyAAdBDqr-vpnJvb7RemhM-xnCqh9thNlqk")
                        .success(function (data, status) {
                            $scope.professions[i].address = data.results[0].formatted_address;

                            NProgress.inc();
                            $scope.render(array,i+1,function() {
                                callback();
                            });

                        })
                        .error(function (data, status) {
                            $scope.professions[i].address = "NA";

                            NProgress.inc();
                            $scope.render(array,i+1,function() {
                                callback();

                            });
                        });

                }
            }

        };





        $scope.init();

    }]);
