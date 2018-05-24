angular.module('Frugal').controller('welcomeScreenCtrl',['$scope','$timeout','CPService','SPService','$cookies','$window','$state','$http',"CONSTANT",
    function($scope,$timeout,CPService,SPService,$cookies,$window,$state,$http,CONSTANT){


    $window.home_map = function()
    {
        var map = new google.maps.Map(document.getElementById('Gmap'), {
            zoom: 8,
            center: {lat: 30.733315, lng: 76.779418}
        });
    };

    $window.fbAsyncInit = function() {
        FB.init({
            appId: '1623177944617962',
            cookie: true,  // enable cookies to allow the server to access
                           // the session
            xfbml: true,  // parse social plugins on this page
            version: 'v2.2' // use version 2.2
        });

    };

    $scope.init = function()
    {


        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id="gmap_script";
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBS_wdTcNsoBZGtAaS7qTC_LIMQhwOPfBI&libraries=places&callback=home_map';
        document.body.appendChild(script);


        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        $scope.role=0;
        $scope.login_reg=0;
        $scope.forgot =0;

        $scope.cust_login_error=0;
        $scope.sp_login_error=0;
        $scope.cust_reg_error=0;
        $scope.sp_reg_error=0;
        $scope.error_message="";

        $scope.data = [];

        $scope.mod = { "selected_category" : "" ,selected_subcategory :""};
        $scope.selected_category_index ="";




        if($scope.$parent.isLogin())
        {
            $scope.loadServices();
        }
    };








    $scope.loadServices = function()
    {

        NProgress.start();
        CPService.getDefaultServices($scope.$parent.getCookie('cust_id'),$scope.$parent.getCookie('cust_access_token'),function(status,data){
            if(status==200)
            {
                console.log(data);
                var i;
                for(i=0;i<data.length;i++)
                {
                    $scope.data[i]= {};
                    $scope.data[i].id = data[i]._id;
                    $scope.data[i].name = data[i].professionName;
                    $scope.data[i].subCategories = [];

                    var j;
                    for(j=0;j<data[i].subCategories.length;j++)
                    {
                        $scope.data[i].subCategories[j] = {};
                        $scope.data[i].subCategories[j].id =  data[i].subCategories[j]._id;
                        $scope.data[i].subCategories[j].name =  data[i].subCategories[j].subCategoryName;
                    }
                }

                $scope.$broadcast('CategoryFocus');
                NProgress.done();

                console.log($scope.data);
            }
            else
            {
                NProgress.done();
            }

        });



    };





    $scope.openPopup = function(id,login_reg){
        $scope.role=0;
        $scope.forgot=0;
        $scope.fbFlag = false;

        $scope.reg_fname ="";
        $scope.reg_lname="";
        $scope.reg_business ="";
        $scope.reg_phone_prefix = CONSTANT.countryPrefix;
        $scope.reg_phone ="";
        $scope.reg_email="";
        $scope.reg_pass="";
        $scope.reg_cnf_pass="";
        $scope.login_email ="";
        $scope.login_pass="";
        $scope.forgot_email="";
        $scope.reg_fbId = "";
        $scope.reg_fbImagePath = "";
        $scope.reg_fbAccessToken = "";


        $scope.login_reg=login_reg;
        $('#'+id).modal('show');

        if(login_reg==1)
        {
            $timeout(function(){
                $('#r').focus();
            },500);

        }
        else if(login_reg==0)
        {

            $timeout(function(){
                $('#e').focus();
            },500);

        }
    };

    $scope.closePopup = function(id){
        $('#'+id).modal('hide');

    };

    $scope.submitForgot = function()
    {


        if($scope.forgot_email=="" || typeof $scope.forgot_email =="undefined")
        {
            $scope.error_message="Please enter your registered email";
            $scope.forgot_error=1;
            return;
        }
        else if($scope.forgot_email.indexOf('@')==-1)
        {
            $scope.error_message="Enter a valid email";
            $scope.forgot_error=1;
            return;
        }
        else if($scope.forgot_email.length == $scope.forgot_email.indexOf('@')+1  )
        {
            $scope.error_message="Enter a valid email";
            $scope.forgot_error=1;
            return;
        }

        CPService.forgotPassword($scope.forgot_email,function(status,data)
        {

            if(status==200)
            {
                $scope.forgot_message = data;
                $scope.forgot=2;
            }
            else
            {
                $scope.error_message = data;
                $scope.forgot_error = 1;
            }
        });
    };

    $scope.submitForgotSP = function()
    {


        if($scope.forgot_email=="" || typeof $scope.forgot_email =="undefined")
        {
            $scope.error_message="Please enter your registered email";
            $scope.forgot_error=1;
            return;
        }
        else if($scope.forgot_email.indexOf('@')==-1)
        {
            $scope.error_message="Enter a valid email";
            $scope.forgot_error=1;
            return;
        }
        else if($scope.forgot_email.length == $scope.forgot_email.indexOf('@')+1  )
        {
            $scope.error_message="Enter a valid email";
            $scope.forgot_error=1;
            return;
        }

        SPService.forgotPassword($scope.forgot_email,function(status,data)
        {

            if(status==200)
            {
                $scope.forgot_message = data;
                $scope.forgot=2;
            }
            else
            {
                $scope.error_message = data;
                $scope.forgot_error = 1;
            }
        });
    };

    $scope.submitLogin = function(){

        if($scope.login_email=="" || typeof $scope.login_email =="undefined" || $scope.login_pass=="" || typeof $scope.login_pass =="undefined")
        {
            $scope.error_message="Email and password cannot be blank";
            $scope.cust_login_error=1;
            return;
        }
        NProgress.start();

        CPService.login($scope.login_email,$scope.login_pass,function(status,data){

            NProgress.set(0.5);
            if(status===200)
            {

                $scope.closePopup('modal1');
                NProgress.done();
                $scope.init();

            }


            else if(status==404)
            {
                $scope.error_message="Email or password is incorrect";
                $scope.cust_login_error=1;
                NProgress.done();
            }


        });

    };

    $scope.submitSPLogin = function(){

        if($scope.login_email=="" || typeof $scope.login_email =="undefined" || $scope.login_pass=="" || typeof $scope.login_pass =="undefined")
        {
            $scope.error_message="Email and password cannot be blank";
            $scope.sp_login_error=1;
            return;
        }
        NProgress.start();

        SPService.login($scope.login_email,$scope.login_pass,function(status){

            NProgress.set(0.5);
            if(status===202)
            {

                $scope.closePopup('modal1');
                $scope.init();
                $timeout(function(){
                   $state.go("SP.myServices");
                },500);


            }


            else if(status==402 || status==403)
            {
                $scope.error_message="Email or username is incorrect";
                $scope.sp_login_error=1;
            }
            else if(status==410)
            {
                $scope.error_message="Account is blocked";
                $scope.sp_login_error1=1;
            }
            NProgress.done();

        });

    };


    $scope.submitRegistration = function()
    {

        console.log($scope.reg_phone);
        var phone = $scope.reg_phone;

        if($scope.reg_fname=="" || typeof $scope.reg_fname =="undefined" || $scope.reg_lname=="" || typeof $scope.reg_lname =="undefined" || $scope.reg_phone_prefix=="" || typeof $scope.reg_phone_prefix =="undefined"|| $scope.reg_phone=="" || typeof $scope.reg_phone =="undefined" || $scope.reg_email=="" || typeof $scope.reg_email =="undefined" || $scope.reg_pass=="" || typeof $scope.reg_pass =="undefined" || $scope.reg_cnf_pass=="" || typeof $scope.reg_cnf_pass =="undefined")
        {
            $scope.error_message="Please fill in all the fields";
            $scope.cust_reg_error=1;
            return;
        }

        else if(!$scope.$parent.isValidName($scope.reg_fname) || !$scope.$parent.isValidName($scope.reg_lname) )
        {
            $scope.error_message="Name should not contain numbers and special characters";
            $scope.cust_reg_error=1;
            return;
        }
        else if(!$scope.$parent.isValidEmail($scope.reg_email) )
        {
            $scope.error_message="Please enter a valid email address";
            $scope.cust_reg_error=1;
            return;
        }
        else if(isNaN(phone))
        {
            $scope.error_message="Phone number should be a number";
            $scope.cust_reg_error=1;
            return;
        }
        else if(phone.length<10 || phone.length>12)
        {
            $scope.error_message="Phone number should be of 10 to 12 digits";
            $scope.cust_reg_error=1;
            return;
        }
        else if($scope.reg_cnf_pass!=$scope.reg_pass)
        {
            $scope.error_message="Please enter same password in both the fields";
            $scope.cust_reg_error=1;
            return;
        }
        else if($scope.reg_pass.length<6)
        {
            $scope.error_message="Password cannot be less than six characters";
            $scope.cust_reg_error=1;
            return;
        }
        else if($scope.fbFlag && ($scope.reg_fbId=="" || $scope.reg_fbImagePath==""))
        {
            $scope.error_message="Credentials from facebook not received";
            $scope.cust_reg_error=1;
            return;
        }



        else {
            NProgress.start();
            $scope.reg_fname = $scope.reg_fname.charAt(0).toUpperCase() + $scope.reg_fname.slice(1);
            $scope.reg_lname = $scope.reg_lname.charAt(0).toUpperCase() + $scope.reg_lname.slice(1);
            CPService.register($scope.fbFlag,$scope.reg_fname, $scope.reg_lname,$scope.reg_phone_prefix, phone, $scope.reg_email, $scope.reg_pass,$scope.reg_fbId,$scope.reg_fbImagePath, function (status) {
                NProgress.set(0.8);

                if (status === 201) {
                    $scope.login_reg=4;
                }
                else if(status==203)
                {
                    $scope.error_message="Invalid phone prefix";
                    $scope.cust_reg_error=1;
                }
                else if(status==409)
                {
                    $scope.error_message="Email/Phone Number already registered";
                    $scope.cust_reg_error=1;
                }
                NProgress.done();
            });
        }
    };

    $scope.submitSPRegistration = function()
    {

        console.log($scope.reg_phone);
        var phone = $scope.reg_phone;

        if($scope.reg_fname=="" || typeof $scope.reg_fname =="undefined" || $scope.reg_lname=="" || typeof $scope.reg_lname =="undefined" || $scope.reg_business=="" || typeof $scope.reg_business =="undefined"  || $scope.reg_phone_prefix=="" || typeof $scope.reg_phone_prefix =="undefined"|| $scope.reg_phone=="" || typeof $scope.reg_phone =="undefined" || $scope.reg_email=="" || typeof $scope.reg_email =="undefined" || $scope.reg_pass=="" || typeof $scope.reg_pass =="undefined" || $scope.reg_cnf_pass=="" || typeof $scope.reg_cnf_pass =="undefined")
        {
            $scope.error_message="Please fill in all the fields";
            $scope.sp_reg_error=1;
            return;
        }
        else if(!$scope.$parent.isValidName($scope.reg_fname) || !$scope.$parent.isValidName($scope.reg_lname) )
        {
            $scope.error_message="Name should not contain numbers and special characters";
            $scope.sp_reg_error=1;
            return;
        }
        else if(!$scope.$parent.isValidEmail($scope.reg_email) )
        {
            $scope.error_message="Please enter a valid email address";
            $scope.sp_reg_error=1;
            return;
        }
        else if(isNaN(phone))
        {
            $scope.error_message="Phone number should be a number";
            $scope.sp_reg_error=1;
            return;
        }
        else if(phone.length<10 || phone.length>12)
        {
            $scope.error_message="Phone number should be of 10 to 12 digits";
            $scope.sp_reg_error=1;
            return;
        }
        else if($scope.reg_cnf_pass!=$scope.reg_pass)
        {
            $scope.error_message="Please enter same password in both the fields";
            $scope.sp_reg_error=1;
            return;
        }
        else if($scope.reg_pass.length<6)
        {
            $scope.error_message="Password cannot be less than six characters";
            $scope.sp_reg_error=1;
            return;
        }
        else if($scope.fbFlag && ($scope.reg_fbId=="" || $scope.reg_fbImagePath=="" || $scope.reg_fbAccessToken==""))
        {
            $scope.error_message="Credentials from facebook not received";
            $scope.cust_reg_error=1;
            return;
        }



        else {
            NProgress.start();
            $scope.reg_fname = $scope.reg_fname.charAt(0).toUpperCase() + $scope.reg_fname.slice(1);
            $scope.reg_lname = $scope.reg_lname.charAt(0).toUpperCase() + $scope.reg_lname.slice(1);
            SPService.registration($scope.fbFlag,$scope.reg_fname, $scope.reg_lname,$scope.reg_business,$scope.reg_phone_prefix, phone, $scope.reg_email, $scope.reg_pass,$scope.reg_fbId,$scope.reg_fbAccessToken,$scope.reg_fbImagePath, function (status) {
                NProgress.set(0.8);

                if (status === 201) {
                    $scope.login_reg=4;
                }
                else if(status==203)
                {
                    $scope.error_message="Invalid phone prefix";
                    $scope.sp_reg_error=1;
                }
                else if(status==409)
                {
                    $scope.error_message="Email/Phone Number already registered";
                    $scope.sp_reg_error=1;
                }
                NProgress.done();
            });
        }
    }




    $scope.submitSearch = function()
    {
        if($scope.$parent.isLogin()==0)
        {
            $scope.init();
            $scope.openPopup('modal1',0);
            return;
        }

        if($scope.mod.selected_category=="")
        {
            alert('Please select a category');
            return;
        }

        if($scope.mod.selected_subcategory=="")
        {
            alert('Please select a sub category');
            return;
        }

        $state.go("CP.serviceForm",{subCatId:$scope.mod.selected_subcategory});






    };

    $scope.selectCategory = function()
    {

        $scope.mod.selected_subcategory ="";
        var i;
        for(i=0;i<$scope.data.length;i++)
        {
            if($scope.data[i].id == $scope.mod.selected_category)
            {
                $scope.selected_category_index = i;
                break;
            }
        }
    };

    $scope.submitLogout = function()
    {
        NProgress.start();
        CPService.logout(function(){
            NProgress.set(0.8);
            NProgress.done();
            $scope.init();
        });

    };

        $scope.loginUsingFB = function()
        {
            $scope.fbFlag = true;
            $scope.reg_pass = "facebook";
            $scope.reg_cnf_pass = "facebook";

            FB.login(function(response){

                console.log(response);

                if (response.status === 'connected') {
                    // Logged into your app and Facebook.
                    console.log('logged in');

                    if($scope.login_reg==0 && $scope.role==0)
                    {
                        CPService.FBLogin(response.authResponse.userID,function(status,data){

                            NProgress.set(0.5);
                            if(status===200)
                            {

                                $scope.closePopup('modal1');
                                NProgress.done();
                                $scope.init();

                            }


                            else if(status==404)
                            {
                                $scope.error_message="No user found";
                                $scope.cust_login_error=1;
                                NProgress.done();
                            }


                        });

                        return;
                    }
                    else if($scope.login_reg==1 && $scope.role==0)
                    {
                        $http.get("https://graph.facebook.com/v2.4/"+response.authResponse.userID+"?fields=id,name,first_name,last_name,email&access_token="+response.authResponse.accessToken)
                            .success(function(data){
                                $scope.reg_fname =data.first_name;
                                $scope.reg_lname=data.last_name;
                                $scope.reg_email=data.email;
                                $scope.reg_fbId = response.authResponse.userID;
                                $scope.reg_fbImagePath = "https://graph.facebook.com/v2.4/"+response.authResponse.userID+"/picture?type=large";

                                FB.logout(function(response)
                                {
                                    console.log("logged out");
                                });

                            })
                            .error(function(data){
                                console.log(data);

                                FB.logout(function(response)
                                {
                                    console.log("logged out");
                                });
                            });
                    }
                    else if($scope.login_reg==0 && $scope.role==1)
                    {


                        $http.get("https://graph.facebook.com/oauth/access_token?client_id=1623177944617962&client_secret=e5695137b0d93e5ebac9f5c640e0d391&grant_type=fb_exchange_token&fb_exchange_token="+response.authResponse.accessToken)
                            .success(function(data){


                                data = String(data);
                                var first_index = data.search("=") + 1;
                                var last_index = data.search("&") ;

                                data = data.substring(first_index,last_index);




                                console.log('reg_ac');
                                console.log(data);

                                SPService.FBLogin(response.authResponse.userID,data,function(status){

                                    NProgress.set(0.5);
                                    if(status===202)
                                    {

                                        $scope.closePopup('modal1');
                                        $scope.init();
                                        $timeout(function(){
                                            $state.go("SP.myServices");
                                        },500);


                                    }


                                    else if(status==402 || status==403)
                                    {
                                        $scope.error_message="Email or username is incorrect";
                                        $scope.sp_login_error=1;
                                    }
                                    else if(status==410)
                                    {
                                        $scope.error_message="Account is blocked";
                                        $scope.sp_login_error1=1;
                                    }
                                    NProgress.done();

                                });
                            })
                            .error(function(data){
                                console.log(data);
                            });
                    }
                    else if($scope.login_reg==1 && $scope.role==1)
                    {
                        $http.get("https://graph.facebook.com/v2.4/"+response.authResponse.userID+"?fields=id,name,first_name,last_name,email&access_token="+response.authResponse.accessToken)
                            .success(function(data){
                                console.log(data);
                                $scope.reg_fname =data.first_name;
                                $scope.reg_lname=data.last_name;
                                $scope.reg_email=data.email;
                                $scope.reg_fbId = response.authResponse.userID;
                                $scope.reg_fbImagePath = "https://graph.facebook.com/v2.4/"+response.authResponse.userID+"/picture?type=large";
                                $scope.reg_fbAccessToken = response.authResponse.accessToken;

                                FB.logout(function(response)
                                {
                                    console.log("logged out");
                                });
                            })
                            .error(function(data){
                                console.log(data);

                                FB.logout(function(response)
                                {
                                    console.log("logged out");
                                });
                            });

                    }





                } else if (response.status === 'not_authorized') {
                    alert("please accept permissions")
                } else {
                    console.log('please log in to Facebook');
                }


            });
        };











    $scope.init();

}]);