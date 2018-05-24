angular.module('Frugal').controller('viewProfileSPCtrl', ['$scope', 'SPService', '$timeout', 'CONSTANT', '$http', '$cookies', '$state',
    function ($scope, SPService, $timeout, CONSTANT, $http, $cookies, $state) {


        $scope.init = function () {


            $scope.set = 0;
            $scope.firstName = "";
            $scope.lastName = "";
            $scope.email = "";
            $scope.prefix = "";
            $scope.phone = "";
            $scope.pic = null;
            $scope.sp_image = "";
            $scope.phone_changed = 0;
            $scope.pic_selected = 0;

            $scope.success = 0;
            $scope.error = 0;
            $scope.error_message = "";



            NProgress.start();

            SPService.showProfile($cookies.get('sp_id'),$cookies.get('sp_access_token'), function (status, data)
            {
                if(status==200)
                {
                    console.log(data);
                    $scope.firstName = data.firstName;
                    $scope.lastName = data.lastName;
                    $scope.email = data.email;

                    $scope.sp_image = data.spImage;

                    if($scope.sp_image.search("graph.facebook")==-1)
                    {
                        $scope.sp_image = data.spImage+"?s=" + Math.random();
                    }

                    $scope.prefix = data.phoneNumberPrefix;
                    $scope.phone = data.phoneNumber;
                    $scope.set=1;
                    NProgress.done();

                }
                else if(status==404)
                {
                    $scope.set=1;
                    NProgress.done();
                }
                else
                {
                    NProgress.done();
                    $scope.error_message = 'We are Sorry!!! Something went wrong.';
                    $scope.error = 4;
                }
            });


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


$scope.submitForm = function()
{
    if( $scope.prefix=="" || typeof $scope.prefix =="undefined"|| $scope.phone=="" || typeof $scope.phone =="undefined")
    {
        $scope.error_message="Please fill in all the fields";
        $scope.error=1;
        return;
    }
    else if(isNaN($scope.phone))
    {
        $scope.error_message="Phone number should be a number";
        $scope.error=1;
        return;
    }
    else if($scope.phone.length!=10)
    {
        $scope.error_message="Phone number should be of 10 digits";
        $scope.error=1;
        return;
    }

    var fd = new FormData();

    if($scope.pic!=null)
    {
        fd.append("fileFlag", true);
        fd.append("phoneNumber", $scope.phone);
        fd.append("spId", $scope.$parent.getCookie('sp_id'));
        fd.append("accessToken", $scope.$parent.getCookie('sp_access_token'));
        fd.append("phoneNumberPrefix", $scope.prefix);
        fd.append("file",$scope.pic);


    }
    else
    {
        fd.append("fileFlag", false);
        fd.append("phoneNumber", $scope.phone);
        fd.append("spId", $scope.$parent.getCookie('sp_id'));
        fd.append("accessToken", $scope.$parent.getCookie('sp_access_token'));
        fd.append("phoneNumberPrefix", $scope.prefix);
    }

    console.log(fd);

    NProgress.start();
    $.ajax({
        url: CONSTANT.SPApiURL+"/api/sp/editProfile",

        type: 'POST',
        data: fd,
        async: true,
        success: function (data,status) {

            $scope.success=1;
            $timeout(function(){
                NProgress.done();
                $scope.init();
            },2000);
        },
        error: function (data,status) {
            NProgress.done();
            if(status==401)
                alert("Your credentials have expired , please login again.");
            else if(status==539) alert("You are not authorized for this action");
            else alert("Error Occurred , try again.");

        },
        cache: false,
        contentType: false,
        processData: false
    });





};


        $scope.init();

    }]);
