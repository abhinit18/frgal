angular.module('Frugal').controller('Customer_DetailCtrl',function($scope,SPService,$location,$cookies,$route,$routeParams){




    $scope.init = function()
    {
        $scope.set=0;

        $scope.error = 0;
        $scope.error_message="";

        $scope.cust_id = $routeParams.cust_id;
        $scope.cust_data = {};
        $scope.cust_image = "";


        if(!$scope.$parent.isSPLogin())
        {
            $scope.error_message = 'You have to log in to view this page. You are being redirected to Home page';
            $scope.error = 4;
            $timeout(function(){
                $scope.$parent.redirect('Home');
            },2000);
            return;
        }

        NProgress.start();
        SPService.showCustomer($cookies.get('sp_id'),$cookies.get('sp_access_token'),$scope.cust_id,function(status,data){
            if(status==200)
            {
                $scope.cust_data=data;
                $scope.cust_image = data.customer_image_path+"?s="+Math.random();
                $scope.set=1;
                NProgress.done();
            }
            else if(status==401)
            {
                $scope.error_message = "Session Invalid. It seems you have logged in from another device. Please login again"
                $scope.error = 4;
                $timeout(function(){
                    $scope.$parent.submitSPLogout();
                },2000);
                NProgress.done();
            }
            else
            {
                $scope.error_message = 'We are Sorry!!! Something went wrong.';
                $scope.error = 4;
                NProgress.done();
            }
        });

    };







    $scope.init();

});