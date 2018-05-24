angular.module('Frugal').controller('viewProfileCtrl', ['$scope', 'CPService', '$timeout', 'CONSTANT', '$http', '$cookies', '$state',
    function ($scope, CPService, $timeout, CONSTANT, $http, $cookies, $state) {


        $scope.init = function () {


            $scope.set = 0;
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.email = "";
            $scope.prefix = "";
            $scope.phone = "";
            $scope.pic = null;
            $scope.cust_image = "";
            $scope.phone_changed = 0;
            $scope.pic_selected = 0;

            $scope.success = 0;
            $scope.error = 0;
            $scope.error_message = "";



            NProgress.start();


            $scope.firstName = $cookies.get('cust_fname');
            $scope.lastName = $cookies.get('cust_lname');
            $scope.email = $cookies.get('cust_email');
            $scope.cust_image = $cookies.get('cust_image')

            if($scope.cust_image.search("graph.facebook")==-1)
            {
                $scope.cust_image = $cookies.get('cust_image')+"?s=" + Math.random();
            }

            $scope.prefix = "+91";
            $scope.phone = $cookies.get('cust_phone');
            $scope.set = 1;
            NProgress.done();


        };

        $scope.updateFileObject = function (files) {
            if (files[0].type != "image/jpeg" && files[0].type != "image/png" && files[0].type != "image/bmp") {
                alert("Please select an image for profile picture");
                $('#f').val('');
                return;
            }

            $scope.pic = files[0];
            $scope.load_image(files[0]);
            $timeout(function () {
                $scope.load_image(files[0]);
            }, 1000);
        };

        $scope.load_image = function (file) {
            var fr = new FileReader();

            fr.onload = function () {
                var dataURL = fr.result;
                var output = document.getElementById('dsp');
                output.src = dataURL;
                $scope.pic_selected = 1;

            };

            fr.readAsDataURL(file);


        };


        $scope.submitForm = function () {
            var phone = $scope.phone;


            if ($scope.prefix == "" || typeof $scope.prefix == "undefined" || $scope.phone == "" || typeof $scope.phone == "undefined") {
                $scope.error_message = "Please fill in all the fields";
                $scope.error = 1;
                return;
            }
            else if (isNaN(phone)) {
                $scope.error_message = "Phone number should be a number";
                $scope.error = 1;
                return;
            }
            else if (phone.length != 10) {
                $scope.error_message = "Phone number should be of 10 digits";
                $scope.error = 1;
                return;
            }

            var fd = new FormData();

            if ($scope.pic != null) {
                fd.append("is_new_image", "1");
                fd.append("customer_phone_number", phone);
                fd.append("customer_id", $cookies.get('cust_id'));
                fd.append("customer_access_token", $cookies.get('cust_access_token'));
                fd.append("customer_phone_number_prefix", $scope.prefix);
                fd.append("file", $scope.pic);


            }
            else {
                fd.append("is_new_image", "0");
                fd.append("customer_phone_number", phone);
                fd.append("customer_id", $cookies.get('cust_id'));
                fd.append("customer_access_token", $cookies.get('cust_access_token'));
                fd.append("customer_phone_number_prefix", $scope.prefix);
            }

            console.log(fd);

            NProgress.start();
            $.ajax({
                url: CONSTANT.ApiURL + "/api/profile/edit_customer_profile",

                type: 'POST',
                data: fd,
                async: true,
                success: function (data, status) {

                    $scope.success = 1;
                    console.log(data);
                    $cookies.put('cust_image', data.data.customer_image_path);
                    $cookies.put('cust_phone', $scope.phone);
                    $timeout(function () {
                        NProgress.done();

                        $scope.init();
                    }, 2000);
                },
                error: function (data, status) {
                    NProgress.done();
                    console.log(data);

                },
                cache: false,
                contentType: false,
                processData: false
            });


        };


        $scope.init();

    }]);
