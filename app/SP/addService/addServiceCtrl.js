angular.module('Frugal').controller('addServiceCtrl', ['$scope', 'SPService', '$window', '$timeout', '$state', '$cookies', 'CONSTANT', 'CountryService',
    function ($scope, SPService, $window, $timeout, $state, $cookies, CONSTANT, CountryService) {

        $window.dd1 = function () {
            console.log("gmap loaded");
        };


        $scope.init = function () {
            var element = document.getElementById("gmap_script");
            if (element != null)
                element.parentNode.removeChild(element);


            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "gmap_script";
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBS_wdTcNsoBZGtAaS7qTC_LIMQhwOPfBI&libraries=places&callback=dd1';
            document.body.appendChild(script);

            $scope.set = 0;

            $scope.countryLengthUnit = CONSTANT.countryLengthUnit;

            $scope.error = 0;
            $scope.error_message = "";
            $scope.success = 0;

            $scope.default_services = [];
            $scope.category = [];
            $scope.category_set = 0;
            $scope.subcategory = [];
            $scope.subcat_set = 0;
            $scope.location_type = '';
            $scope.location_array = [0, 0, 50];

            $scope.states = [];
            $scope.cities = [];
            $scope.zipcodeArray = [];
            $scope.localityArray = [];

            $scope.selectedState = "";
            $scope.selectedCities = [];
            $scope.selectedZipcodes = [];
            $scope.selectedLocalities = [];

            $scope.stateSet = 0;
            $scope.citiesSet = 0;

            $scope.multiSelectSettings = {displayProp: 'cityName', idProp: 'cityName',onItemSelect: function () {
                console.log('selected: '+item);}};


            NProgress.start();
            SPService.showAllProfessions($cookies.get('sp_id'), $cookies.get('sp_access_token'), function (status, data) {
                NProgress.set(0.5);
                if (status == 200) {
                    $scope.set = 1;
                    $scope.default_services = data;
                    for (i = 0; i < $scope.default_services.length; i++) {
                        $scope.category.push({name: data[i].professionName, id: data[i]._id});

                    }
                    NProgress.done();

                    console.log($scope.category);


                }
                else {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });

        };

        $scope.updateSub = function () {




            $scope.subcat_set = 0;
            $scope.subcategory = [];

            $scope.location_type = "";
            $scope.location_array = [0, 0, 50];

            $scope.states=[];
            $scope.selectedState ='';
            $scope.stateSet = 0;

            $scope.cities = [];
            $scope.selectedCities = [];
            $scope.citiesSet = 0;

            $scope.zipcodeArray = [];
            $scope.selectedZipcodes = [];

            $scope.localityArray = [];
            $scope.selectedLocalities = [];

            if ($scope.name == "Select category") {
                $scope.category_set = 0;
                return;
            }

            var x = {};
            for (i = 0; i < $scope.default_services.length; i++) {
                if ($scope.name == $scope.default_services[i]._id) {
                    x = $scope.default_services[i].subCategories;
                    break;
                }

            }

            for (i = 0; i < x.length; i++) {
                $scope.subcategory.push({name: x[i].subCategoryName, id: x[i]._id, LT: x[i].locationType});

            }
            console.log($scope.subcategory);
            $scope.category_set = 1;
        };

        $scope.updateLocationType = function () {





            $scope.location_type = "";
            $scope.location_array = [0, 0, 50];

            $scope.states=[];
            $scope.selectedState ='';
            $scope.stateSet = 0;

            $scope.cities = [];
            $scope.selectedCities = [];
            $scope.citiesSet = 0;

            $scope.zipcodeArray = [];
            $scope.selectedZipcodes = [];

            $scope.localityArray = [];
            $scope.selectedLocalities = [];


            var i;

            for (i = 0; i < $scope.subcategory.length; i++) {
                if ($scope.subcat == $scope.subcategory[i].id) {
                    $scope.location_type = $scope.subcategory[i].LT;

                    if ($scope.location_type == 'RADIUS') {


                        $scope.init_map();
                    }
                    else if ($scope.location_type == 'ZIPCODE' || $scope.location_type == 'TOWN') {
                        NProgress.start();
                        CountryService.getStates(function (status, data) {
                            NProgress.done();

                            if (status == 200) {
                                $scope.states = data;
                            }
                            else {
                                alert(data);
                            }
                        });
                    }

                    $scope.subcat_set = 1;

                }
            }


        };

        $scope.updateCities = function () {
            $scope.stateSet =0;

            $scope.cities = [];
            $scope.selectedCities = [];
            $scope.citiesSet = 0;

            $scope.zipcodeArray = [];
            $scope.selectedZipcodes = [];

            $scope.localityArray = [];
            $scope.selectedLocalities = [];

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

            $scope.citiesSet =0;

            $scope.zipcodeArray = [];
            $scope.selectedZipcodes = [];

            $scope.localityArray = [];
            $scope.selectedLocalities = [];

            if($scope.selectedCities.length==0)
            {
                return;
            }

            var i;
            var temp= [];
            for(i=0;i<$scope.selectedCities.length;i++)
            {
                temp.push($scope.selectedCities[i].cityName);
            }

            NProgress.start();
            CountryService.getZipcodes(temp,$scope.selectedState,function(status,data){

                NProgress.done();
                if(status==200)
                {
                    $scope.zipcodeArray = data;

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

            $scope.citiesSet =0;

            $scope.zipcodeArray = [];
            $scope.selectedZipcodes = [];

            $scope.localityArray = [];
            $scope.selectedLocalities = [];

            if($scope.selectedCities.length==0)
            {
                return;
            }

            var i;
            var temp= [];
            for(i=0;i<$scope.selectedCities.length;i++)
            {
                temp.push($scope.selectedCities[i].cityName);
            }

            NProgress.start();
            CountryService.getLocalities(temp,$scope.selectedState,function(status,data){

                NProgress.done();
                if(status==200)
                {
                    console.log(data);
                    $scope.localityArray = data;

                    $scope.citiesSet=1;
                }
                else
                {
                    alert(data);
                }

            });
        };


        $scope.init_map = function () {
            var map;
            var input;
            var searchBox;
            var marker;
            var address;
            var geocoder = new google.maps.Geocoder();

            map = new google.maps.Map(document.getElementById('gmap'), {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDoubleClickZoom: false,
                draggable: true
            });
            



            var defaultBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(6.7535159, 68.16288519999999),
                new google.maps.LatLng(35.5087008, 97.395561));
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

                    $scope.location_array[0] = event.latLng.A;
                    $scope.location_array[1] = event.latLng.F;
                    console.log($scope.location_array);
                });


                geocoder.geocode({'location': event.latLng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        document.getElementById('search').value = results[0].formatted_address;
                    }
                });

                $scope.location_array[0] = event.latLng.lat();
                $scope.location_array[1] = event.latLng.lng();
                console.log($scope.location_array);
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


                    $scope.location_array[0] = event.latLng.lat();
                    $scope.location_array[1] = event.latLng.lng();
                    console.log($scope.location_array);
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


                $scope.location_array[0] = places[0].geometry.location.lat();
                $scope.location_array[1] = places[0].geometry.location.lng();
                console.log($scope.location_array);


            });
        };


        $scope.submitForm = function ()
        {

            var i;
            if ($scope.category_set == 0)
            {
                $scope.error_message = 'Please select category';
                $scope.error = 1;
                return;
            }

            if ($scope.subcat_set == 0)
            {
                $scope.error_message = 'Please select subcategory';
                $scope.error = 1;
                return;
            }

            if ($scope.location_type == 'ZIPCODE')
            {
                if ($scope.selectedState=="") {
                    $scope.error_message = 'Please select state';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedCities.length==0) {
                    $scope.error_message = 'Please select city';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedZipcodes.length==0) {
                    $scope.error_message = 'Please select zipcode';
                    $scope.error = 1;
                    return;
                }

                $scope.location_array[0] =[];

                for(i=0;i<$scope.selectedZipcodes.length;i++)
                {
                    $scope.location_array[0].push(String($scope.selectedZipcodes[i].zipcode));

                }



            }

            if ($scope.location_type == 'TOWN')
            {
                if ($scope.selectedState=="") {
                    $scope.error_message = 'Please select state';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedCities.length==0) {
                    $scope.error_message = 'Please select city';
                    $scope.error = 1;
                    return;
                }
                else if ($scope.selectedLocalities.length==0) {
                    $scope.error_message = 'Please select locality';
                    $scope.error = 1;
                    return;
                }

                $scope.location_array[0] =[];

                for(i=0;i<$scope.selectedLocalities.length;i++)
                {
                    $scope.location_array[0].push(String($scope.selectedLocalities[i].locality));

                }

            }


            if ($scope.location_type == 'RADIUS') {


                if ($scope.location_array[0] == 0 || $scope.location_array[1] == 0) {
                    $scope.error_message = 'Please select a place';
                    $scope.error = 1;
                    return;
                }
            }

            if ($scope.desc == "" || typeof  $scope.desc == "undefined") {
                $scope.error_message = 'Please enter description of your services';
                $scope.error = 1;
                return;
            }

            SPService.addProfession($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.name, $scope.subcat, 0, $scope.desc, $scope.location_type, $scope.location_array, function (status, data) {
                if (status == 200) {
                    $scope.success = 1;
                    $timeout(function () {
                        $state.go("SP.myServices");
                    }, 2000);

                }
                else if (status == 409) {
                    $scope.error_message = 'Profession/subCategory already added';
                    $scope.error = 1;
                    $timeout(function () {
                        $state.go("SP.myServices");
                    }, 1000);
                }
                else {
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 1;
                }
            });


        };


        $scope.sliderChange = function (obj) {
            $scope.location_array[2] = obj.to;

        };

        $scope.removeError = function()
        {
            $scope.error=0;
        };

        $scope.init();

    }]);