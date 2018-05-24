angular.module('Frugal').controller('serviceFormCtrl', ['$scope', '$timeout', '$state', '$stateParams', 'CPService', '$window', '$cookies','CONSTANT','localStorageService','CountryService',
    function ($scope, $timeout, $state, $stateParams, CPService, $window, $cookies,CONSTANT,localStorageService,CountryService) {

        $window.dd = function () {

        };

        $scope.init = function () {
            var element = document.getElementById("gmap_script");
            if (element != null)
                element.parentNode.removeChild(element);


            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "gmap_script";
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBS_wdTcNsoBZGtAaS7qTC_LIMQhwOPfBI&libraries=places&callback=dd';
            document.body.appendChild(script);


            $scope.subCatId = $stateParams.subCatId;

            $scope.countryLengthUnit = CONSTANT.countryLengthUnit;

            $cookies.remove('subCatId');
            localStorageService.remove('QForm');
            localStorageService.remove('PForm');
            localStorageService.remove('AForm');
            $cookies.remove('locationType');
            $cookies.remove('locationArray');
            $cookies.remove('spids');

            $scope.error = [];
            $scope.error1=0;
            $scope.error_message = [];
            $scope.error_message1 = "";

            $scope.QForm = [];
            $scope.PForm = [];
            $scope.AForm = [];

            $scope.locationType = "";
            $scope.locationArray = [0, 0, 50];


            $scope.states =[];
            $scope.selectedState = '';
            $scope.stateSet = 0;

            $scope.cities = [];
            $scope.selectedCity = "";
            $scope.citiesSet = 0;

            $scope.zipcodes = [];
            $scope.selectedZipcode = "";

            $scope.localities = [];
            $scope.selectedLocality = "";

            $scope.formValues = [];
            $scope.temp = [];


            $scope.role = 0;


            NProgress.start();
            CPService.getServiceDetails($cookies.get('cust_id'),$cookies.get('cust_access_token'), $scope.subCatId, function (status, data) {

                if (status == 200)
                {
                    data = data[0];

                    //data.questionnaireForm.push({title:"range","type":4,"required":true,"value":["1","20"],filledValues:[]});

                    var i;
                    for(i=0;i<data.questionnaireForm.length;i++)
                    {
                        if(data.questionnaireForm[i].type==4)
                        {
                            data.questionnaireForm[i].value[0] = Number(data.questionnaireForm[i].value[0]);
                            data.questionnaireForm[i].value[1] = Number(data.questionnaireForm[i].value[1]);
                        }
                    }


                    $scope.locationType = data.locationType;
                    NProgress.set(0.2);

                    $scope.render(data.questionnaireForm, 0, function () {
                        $scope.PForm = data.proposalForm;
                        $scope.AForm = data.auctionForm;

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

                        NProgress.done();

                    });

                    $timeout(function () {
                        $('form > div > input').focus();
                    }, 200);
                }
                else {
                    NProgress.done();
                    $scope.error1 = 1;
                    $scope.error_message1 = "Something went wrong.Please reload the page again";
                }
            });
        };

        $scope.render = function (q, i, callback) {
            if (i == q.length)
                callback();
            else {
                $timeout(function () {
                    $scope.error.push(false);
                    $scope.QForm.push(q[i]);
                    NProgress.inc();
                    $scope.render(q, i + 1, function () {
                        callback();
                    });

                }, 100);

            }
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
            for (i = 0; i < $scope.QForm.length; i++)
            {

                if($scope.QForm[i].type==0 || $scope.QForm[i].type==2 || $scope.QForm[i].type==3 || $scope.QForm[i].type==6)
                {
                    if(typeof $scope.formValues[i] == 'undefined' || $scope.formValues[i] == '')
                    {
                        if($scope.QForm[i].required == true)
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
                else if($scope.QForm[i].type==1)
                {
                    if(typeof $scope.formValues[i].length==0)
                    {
                        if($scope.QForm[i].required == true)
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
                else if($scope.QForm[i].type==5)
                {
                    if(typeof $scope.formValues[i][0] == 'undefined' || $scope.formValues[i][0] == '' || typeof $scope.formValues[i][1] == 'undefined' || $scope.formValues[i][1] == '')
                    {
                        if($scope.QForm[i].required == true)
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
                else if($scope.QForm[i].type==7 || $scope.QForm[i].type==8)
                {
                    if(typeof $scope.formValues[i] == 'undefined' || $scope.formValues[i] == '')
                    {
                        if($scope.QForm[i].required == true)
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
                            $scope.error_message[i] = "This field only accepts numbers";
                            $scope.error[i] = true;
                        }
                    }
                }




            }

            if ($scope.error.indexOf(true) != -1) {
                return;
            }

            for (i = 0; i < $scope.QForm.length; i++)
            {

                if ($scope.QForm[i].type != 1 && $scope.QForm[i].type != 5 && $scope.QForm[i].type != 4)
                {
                    $scope.QForm[i].filledValues.push(String($scope.formValues[i]));
                }
                else if ($scope.QForm[i].type == 5)
                {
                    $scope.QForm[i].filledValues.push($scope.formValues[i][0] + " " + $scope.formValues[i][1] + ":00");
                }
                else
                {
                    for (j = 0; j < $scope.formValues[i].length; j++) {
                        $scope.QForm[i].filledValues.push(String($scope.formValues[i][j]));
                    }

                    for(j=0;j<$scope.QForm[i].value.length;j++)
                    {
                        $scope.QForm[i].value[j] = String($scope.QForm[i].value[j]);
                    }
                }
            }

            console.log($scope.QForm);


            $cookies.put('subCatId', $scope.subCatId);
            localStorageService.set('QForm', angular.toJson($scope.QForm, true));
            localStorageService.set('PForm', angular.toJson($scope.PForm, true));
            localStorageService.set('AForm', angular.toJson($scope.AForm), true);


            $scope.error = 0;
            $scope.error_message = "";
            $scope.role = 1;

            if ($scope.locationType == 'RADIUS') {
                $scope.init_map();
            }

            else if($scope.locationType=="ZIPCODE" || $scope.locationType=="TOWN")
            {
                NProgress.start();

                CountryService.getStates(function(status,data){
                    NProgress.done();

                    if (status == 200) {
                        $scope.states = data;
                    }
                    else {
                        alert(data);
                    }
                });
            }
        };

        $scope.init_map = function () {
            var map;
            var input;
            var searchBox;
            var marker;
            var address;
            var geocoder = new google.maps.Geocoder();

            map = new google.maps.Map(document.getElementById('gmap1'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDoubleClickZoom: false,
                draggable: true,
                zoom: 12
            });

            var defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng( 6.7535159, 68.16288519999999),
                new google.maps.LatLng(35.5087008, 97.395561)
               );
            map.fitBounds(defaultBounds);

            var defaultCenter = new google.maps.LatLng(20.593684, 78.96288);

            marker = new google.maps.Marker({
                position: defaultCenter
            });

            marker.setMap(map);

            input = document.getElementById('search');

            searchBox = new google.maps.places.SearchBox((input));


            google.maps.event.addListener(map, 'click', function (event) {
                marker.setMap(null);

                marker = new google.maps.Marker({
                    position: event.latLng,
                    draggable: true
                });

                marker.setMap(map);

                google.maps.event.addListener(marker, 'dragend', function (event) {


                    geocoder.geocode({'location': event.latLng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            document.getElementById('search').value = results[0].formatted_address;
                        }
                    });

                    $scope.locationArray[0] = event.latLng.A;
                    $scope.locationArray[1] = event.latLng.F;
                    console.log($scope.locationArray);
                });


                geocoder.geocode({'location': event.latLng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        document.getElementById('search').value = results[0].formatted_address;
                    }
                });

                $scope.locationArray[0] = event.latLng.lat();
                $scope.locationArray[1] = event.latLng.lng();
                console.log($scope.locationArray);
            });

            google.maps.event.addListener(searchBox, 'places_changed', function () {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                marker.setMap(null);

                marker = new google.maps.Marker({
                    position: places[0].geometry.location,
                    draggable: true
                });

                marker.setMap(map);

                google.maps.event.addListener(marker, 'dragend', function (event) {


                    geocoder.geocode({'location': event.latLng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            document.getElementById('search').value = results[0].formatted_address;
                        }
                    });


                    $scope.locationArray[0] = event.latLng.lat();
                    $scope.locationArray[1] = event.latLng.lng();
                    console.log($scope.locationArray);
                });

                if (places[0].geometry.viewport == null) {
                    address = document.getElementById('search').value;
                    geocoder.geocode({'address': address}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            map.fitBounds(results[0].geometry.viewport);
                        }
                    });

                }
                else {
                    map.fitBounds(places[0].geometry.viewport);
                }


                $scope.locationArray[0] = places[0].geometry.location.lat();
                $scope.locationArray[1] = places[0].geometry.location.lng();
                console.log($scope.locationArray);


            });
        };

        $scope.searchSP = function ()
        {
            var i;

            if ($scope.locationType == 'ZIPCODE')
            {
                if ($scope.selectedState=="") {
                    $scope.error_message = 'Please select state';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedCity=="") {
                    $scope.error_message = 'Please select city';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedZipcode =="") {
                    $scope.error_message = 'Please select zipcode';
                    $scope.error = 1;
                    return;
                }


                $scope.locationArray[0] = $scope.selectedZipcode;



            }

            if ($scope.locationType == 'TOWN')
            {
                if ($scope.selectedState=="") {
                    $scope.error_message = 'Please select state';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedCity=="") {
                    $scope.error_message = 'Please select city';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedLocality=="") {
                    $scope.error_message = 'Please select locality';
                    $scope.error = 1;
                    return;
                }


                $scope.locationArray[0] = $scope.selectedLocality;

            }




            if ($scope.locationType == 'RADIUS') {
                if ($scope.locationArray[0] == 0 || $scope.locationArray[1] == 0) {
                    $scope.error_message = "Please enter name to search for location";
                    $scope.error = 1;
                    return;
                }
            }

            var spids = [];

            console.log($scope.locationArray);

            $cookies.put('locationType', $scope.locationType);
            $cookies.put('locationArray', angular.toJson($scope.locationArray), true);
            $cookies.put('spids', angular.toJson(spids), true);

            $state.go('CP.SPsList');
        };


        $scope.sliderInitialise  = function(index)
        {
            $scope.formValues[index]=[];
            $scope.formValues[index][0]=$scope.QForm[index].value[0] + Math.round(($scope.QForm[index].value[1]-$scope.QForm[index].value[0])/4);
            $scope.formValues[index][1]=$scope.QForm[index].value[0] + Math.round(3*($scope.QForm[index].value[1]-$scope.QForm[index].value[0])/4);
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

        $scope.updateCities = function()
        {
            $scope.stateSet = 0;

            $scope.cities = [];
            $scope.selectedCity = "";
            $scope.citiesSet = 0;

            $scope.zipcodes = [];
            $scope.selectedZipcode = "";

            $scope.localities= [];
            $scope.selectedLocality = "";


            NProgress.start();
            CountryService.getCities($scope.selectedState,function(status,data){

                NProgress.done();
                if(status==200)
                {
                    $scope.cities = data;

                    $scope.stateSet=1;
                }
                else
                {
                    alert(data);
                }

            });


        };

        $scope.updateZipcodes = function()
        {

            $scope.citiesSet = 0;

            $scope.zipcodes = [];
            $scope.selectedZipcode = "";

            $scope.localities = [];
            $scope.selectedLocality = "";

            if($scope.selectedCity=="" || typeof $scope.selectedCity =="undefined")
            {
                return;
            }


            var temp= [];
            temp.push($scope.selectedCity);


            NProgress.start();
            CountryService.getZipcodes(temp,$scope.selectedState,function(status,data){

                NProgress.done();
                if(status==200)
                {
                    $scope.zipcodes = data;

                    $scope.citiesSet=1;
                }
                else
                {
                    alert(data);
                }

            });


        };

        $scope.updateLocalities = function()
        {

            $scope.citiesSet = 0;

            $scope.zipcodes = [];
            $scope.selectedZipcode = "";

            $scope.localities = [];
            $scope.selectedLocality = "";

            if($scope.selectedCity=="" || typeof $scope.selectedCity =="undefined")
            {
                return;
            }


            var temp= [];
            temp.push($scope.selectedCity);


            NProgress.start();
            CountryService.getLocalities(temp,$scope.selectedState,function(status,data){

                NProgress.done();
                if(status==200)
                {
                    $scope.localities = data;

                    $scope.citiesSet=1;
                }
                else
                {
                    alert(data);
                }

            });


        };


        $scope.removeError = function()
        {
            $scope.error=0;
        };



        $scope.init();

    }]);