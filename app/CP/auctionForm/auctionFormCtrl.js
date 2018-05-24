angular.module('Frugal').controller('auctionFormCtrl', ['$scope', '$timeout', '$state', 'CPService', '$cookies','localStorageService',
    function ($scope, $timeout, $state, CPService, $cookies,localStorageService) {


        $scope.init = function () {
            $scope.set = 0;

            $scope.error = [];
            $scope.error1 = 0;
            $scope.error_message = [];
            $scope.success = 0;
            $scope.ongoing = 0;
            $scope.formValues = [];


            if (typeof  $cookies.get("subCatId")== "undefined") {
                $state.go('welcomeScreen');
            }

            $scope.AForm = angular.fromJson(localStorageService.get('AForm'));

            var i;
            for(i=0;i<$scope.AForm.length;i++)
            {
                if($scope.AForm[i].type==4)
                {
                    $scope.AForm[i].value[0] = Number($scope.AForm[i].value[0]);
                    $scope.AForm[i].value[1] = Number($scope.AForm[i].value[1]);
                }
            }

            $scope.set = 1;
            console.log($scope.AForm);

            $timeout(function () {
                $('.date').datepicker({
                    format: "yyyy-mm-dd",
                    autoclose: true,
                    todayHighlight: true,
                    orientation: 'bottom right'
                });

                $('.time').clockpicker({
                    placement: 'top',
                    align: 'right',
                    donetext: 'Done',
                    autoclose: true
                });
            }, 1000);

        };


        $scope.toggleCheckbox = function (i, box) {
            if ($scope.formValues[i].indexOf(box)) {
                $scope.formValues[i].push(box);
            }
            else {
                var index = $scope.formValues[i].indexOf(box);
                $scope.formValues[i].splice(index, 1);
            }
        };

        $scope.submitForm = function () {

            var i,j;
            for (i = 0; i < $scope.AForm.length; i++)
            {
                if($scope.AForm[i].forCp==true)
                {
                    if($scope.AForm[i].type==0 || $scope.AForm[i].type==2 || $scope.AForm[i].type==3 || $scope.AForm[i].type==6)
                    {
                        if(typeof $scope.formValues[i] == 'undefined' || $scope.formValues[i] == '')
                        {
                            if($scope.AForm[i].required == true)
                            {
                                $scope.error_message[i] = "This field is required";
                                $scope.error[i] = true;
                            }
                            else
                            {

                            }
                        }
                        else
                        {

                        }
                    }
                    else if($scope.AForm[i].type==1)
                    {
                        if(typeof $scope.formValues[i].length==0)
                        {
                            if($scope.AForm[i].required == true)
                            {
                                $scope.error_message[i] = "At least one option is required";
                                $scope.error[i] = true;
                            }
                            else
                            {

                            }
                        }
                        else
                        {

                        }
                    }
                    else if($scope.AForm[i].type==5)
                    {
                        if(typeof $scope.formValues[i][0] == 'undefined' || $scope.formValues[i][0] == '' || typeof $scope.formValues[i][1] == 'undefined' || $scope.formValues[i][1] == '')
                        {
                            if($scope.AForm[i].required == true)
                            {
                                $scope.error_message[i] = "Select Date and Time";
                                $scope.error[i] = true;
                            }
                            else
                            {

                            }
                        }
                        else
                        {

                        }
                    }
                    else if($scope.AForm[i].type==7 || $scope.AForm[i].type==8)
                    {
                        if(typeof $scope.formValues[i] == 'undefined' || $scope.formValues[i] == '')
                        {
                            if($scope.AForm[i].required == true)
                            {
                                $scope.error_message[i] = "This field is required";
                                $scope.error[i] = true;
                            }
                            else
                            {

                            }
                        }
                        else
                        {
                            if(isNaN($scope.formValues[i]) )
                            {
                                $scope.error_message[i] = "This field should be a number";
                                $scope.error[i] = true;
                            }
                            else if(Number($scope.formValues[i]) > 99999999)
                            {
                                $scope.error_message[i] = "Number cannot be greater than 8 digits";
                                $scope.error[i] = true;
                            }
                        }
                    }

                }

            }

            if ($scope.error.indexOf(true) != -1) {
                return;
            }

            for (i = 0; i < $scope.AForm.length; i++)
            {
                if($scope.AForm[i].forCp==true)
                {

                    if ($scope.AForm[i].type != 1 && $scope.AForm[i].type != 5 && $scope.AForm[i].type != 4)
                    {
                        $scope.AForm[i].filledValues.push(String($scope.formValues[i]));
                    }
                    else if ($scope.AForm[i].type == 5)
                    {
                        $scope.AForm[i].filledValues.push($scope.formValues[i][0] + " " + $scope.formValues[i][1] + ":00");
                    }
                    else
                    {
                        for (j = 0; j < $scope.formValues[i].length; j++) {
                            $scope.AForm[i].filledValues.push(String($scope.formValues[i][j]));
                        }

                        for(j=0;j<$scope.AForm[i].value.length;j++)
                        {
                            $scope.AForm[i].value[j] = String($scope.AForm[i].value[j]);
                        }
                    }
                }
            }


            console.log($scope.AForm);
            $scope.ongoing = 1;


            CPService.createRequest($cookies.get('cust_id'), $cookies.get('cust_access_token'), $cookies.get('subCatId'), (angular.fromJson($cookies.get('spids'))).toString(), 0, $scope.AForm, angular.fromJson(localStorageService.get('QForm')), angular.fromJson(localStorageService.get('PForm')), function (status, data) {

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
                    $scope.error1 = 1;
                }
            });
        };

        $scope.sliderInitialise  = function(index)
        {
            $scope.formValues[index]=[];
            $scope.formValues[index][0]=$scope.AForm[index].value[0] + Math.round(($scope.AForm[index].value[1]-$scope.AForm[index].value[0])/4);
            $scope.formValues[index][1]=$scope.AForm[index].value[0] + Math.round(3*($scope.AForm[index].value[1]-$scope.AForm[index].value[0])/4);
        };

        $scope.sliderChange = function(obj)
        {
            var id = obj.input[0].id;

            if(id=="radiusSlider")
            {
                $scope.locationArray[2]= obj.to;
            }
            else
            {
                var index = Number(id);
                $scope.formValues[index][0]=obj.from;
                $scope.formValues[index][1]=obj.to;
            }

        };


        $scope.init();

    }]);