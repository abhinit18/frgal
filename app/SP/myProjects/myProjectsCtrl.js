angular.module('Frugal').controller('myProjectsSPCtrl',['$scope','SPService','$timeout','$cookies',
    function($scope,SPService,$timeout,$cookies){



    $scope.init = function()
    {
        $scope.set=0;

        $scope.error = 0;
        $scope.error_message="";
        $scope.success =0;

        $scope.projectData = [];
        $scope.ongoing =[];
        $scope.completed=[];

        $scope.limit = { "ongoing": 4 , "completed" :4};

        NProgress.start();


        SPService.showProjects($cookies.get('sp_id'), $cookies.get('sp_access_token'),function(status,data)
        {
            if(status==200)
            {


                var i,random;
                var imagePathArray = [];
                var imageRandomArray = [];
                for (i = 0; i < data.length; i++) {
                    if(imagePathArray.indexOf(data[i].customer_image_path)==-1)
                    {
                        imagePathArray.push(data[i].customer_image_path);

                        random=Math.random();
                        imageRandomArray.push(random);
                        data[i].customer_image_path = data[i].customer_image_path + "?s=" + random;
                    }
                    else
                    {
                        data[i].customer_image_path = data[i].customer_image_path + "?s=" + imageRandomArray[imagePathArray.indexOf(data[i].customer_image_path)];
                    }
                    data[i].imageLoaded = 0;
                }
                $scope.projectData = data;
                console.log($scope.projectData);
                $scope.set=1;





                for(i=0;i<$scope.projectData.length;i++)
                {
                    if($scope.projectData[i].projectStatus=='ONGOING')
                    {

                        $scope.ongoing.push($scope.projectData[i]);
                    }

                }

                for(i=0;i<$scope.projectData.length;i++)
                {
                    if($scope.projectData[i].projectStatus=='COMPLETED')
                    {

                        $scope.completed.push($scope.projectData[i]);
                    }

                }

                $scope.ongoing.sort(function(a,b){

                    a1 = new Date(a.projectCreatedDateTime);
                    b1  =  new Date(b.projectCreatedDateTime);

                    if(a1==b1)
                        return 0;
                    else if(a1<b1)
                        return -1;
                    else
                        return +1;
                });

                $scope.ongoing = $scope.ongoing.reverse();

                $scope.completed.sort(function(a,b){

                    a1 = new Date(a.projectCreatedDateTime);
                    b1  =  new Date(b.projectCreatedDateTime);

                    if(a1==b1)
                        return 0;
                    else if(a1<b1)
                        return -1;
                    else
                        return +1;
                });

               $scope.completed = $scope.completed.reverse();
               NProgress.done();

            }
            else if(status==402)
            {
                $scope.set=1;
                return;
            }

            else
            {
                NProgress.done();
                $scope.error_message = 'We are Sorry!!! Something went wrong.';
                $scope.error = 4;
            }
        });

    };

    $scope.viewEngagement = function(project_id,eng_id)
    {
        $scope.$parent.redirect("View_Engagement_SP/"+project_id+"/"+eng_id);
    };

    $scope.createArray = function(n)
    {
        var x = [];
        for(i=1;i<=n;i++)
        {
            x.push(i);
        }
        return x;
    };



    $scope.init();

}]);