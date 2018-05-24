angular.module('Frugal').controller('myEngagementsCtrl',['$scope','SPService','$timeout','$state','$cookies',
    function($scope,SPService,$timeout,$state,$cookies){



    $scope.init = function()
    {
        $scope.engagements = [];
        $scope.zero_data=0;
        $scope.set=0;


        NProgress.start();
        SPService.getEngagements($cookies.get('sp_id'),$cookies.get('sp_access_token'),function(status,data){

            if(status==200)
            {
                console.log(data);
                var i;
                for(i=0;i<data.length;i++)
                {
                    if(data[i].projectStatus!="COMPLETED" && data[i].projectStatus!="ONGOING")
                    {
                        if(data[i].engagementsData[0].engagementStatus=="AUCTION_IN_PROGRESS")
                        {
                            data[i].engagementsData[0].engagementStatus="AUCTION IN PROGRESS";
                        }
                        else if(data[i].engagementsData[0].engagementStatus=="SUBMITTED_FOR_PROPOSAL")
                        {
                            data[i].engagementsData[0].engagementStatus="SUBMITTED FOR PROPOSAL";
                        }
                    }

                }


                console.log(data);
                data.sort(function(a,b){

                    a1 = new Date(a.projectCreatedDateTime);
                    b1  =  new Date(b.projectCreatedDateTime);

                    if(a1==b1)
                        return 0;
                    else if(a1<b1)
                        return -1;
                    else
                        return +1;
                });

                data = data.reverse();



                $scope.render(data,0,function(){
                    NProgress.done();
                    console.log($scope.engagements);
                });
            }
            else if(status==412)
            {
                $scope.set =1;
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

    $scope.render = function(data,i,callback)
    {
        if(i== data.length)
            callback();
        else
        {
            $timeout(function(){

                if(data[i].projectStatus!="COMPLETED" &&  data[i].projectStatus!="ONGOING" ) {


                    $scope.engagements.push(data[i]);
                    NProgress.inc();

                    if(i==0)
                        $scope.set=1;
                    $scope.render(data, i + 1, function () {
                        callback();
                    });
                }
                else
                {
                    NProgress.inc();

                    if(i==0)
                        $scope.set=1;
                    $scope.render(data, i + 1, function () {
                        callback();
                    });
                }


            },200);

        }
    };


    $scope.init();


}]);