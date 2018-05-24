angular.module('Frugal').controller('viewEngagementSPCtrl',['$scope','SPService','$timeout','$interval','$cookies','$state','$stateParams',
    function($scope,SPService,$timeout,$interval,$cookies,$state,$stateParams){



    $scope.init = function() {


        $scope.projectId =$stateParams.projectId;
        $scope.engId = $stateParams.engId;
        $scope.ancestor = $stateParams.ancestor;

        $scope.loaded=0;

        $scope.error = [];
        $scope.error1 = 0;
        $scope.error_message=[];
        $scope.success =0;

        $scope.subCatName = "";
        $scope.requestDate = '';

        $scope.engagementStatus = "";
        $scope.projectStatus ="";
        $scope.projectType = '';

        $scope.latestPrice = "";
        $scope.currencyCode = "";

        $scope.spName = $cookies.get('sp_fname') +" "+$cookies.get('sp_lname');

        $scope.customerName = "";
        $scope.custId = "";
        $scope.custName = "";
        $scope.custEmail = "";
        $scope.custPrefix = "";
        $scope.custPhone = "";

        $scope.QForm = [];
        $scope.AForm = [];
        $scope.PForm = [];

        $scope.basePrice= "";

        $scope.myBids = [];
        $scope.otherBids = [];
        $scope.bids  =[];

        $scope.threads = [];
        $scope.messages = [];

        $scope.q_show = false;
        $scope.proposal_show = false;
        $scope.auction_show = false;
        $scope.bid_show = false;

        $scope.formValues = [];
        $scope.send_message = [];
        $scope.temp =[];

        $scope.custImage = "";
        $scope.spImage = "";

        $scope.x = [];


        NProgress.start();



        SPService.getEngagementInfo($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.engId, function (status, data) {

            if (status == 200)
            {

                $scope.custId = data.customerId;
                $scope.projectType = data.projectType;
                $scope.projectStatus = data.projectStatus;
                $scope.engagementStatus =  data.engagementsData[0].engagementStatus;
                $scope.latestPrice =  data.engagementsData[0].latestPrice;
                console.log(data);

                if($scope.engagementStatus=="AUCTION_IN_PROGRESS")
                {
                    $scope.engagementStatus="AUCTION IN PROGRESS";
                }
                else if($scope.engagementStatus=="SUBMITTED_FOR_PROPOSAL")
                {
                    $scope.engagementStatus="SUBMITTED FOR PROPOSAL";
                }

                $scope.loaded++;
                $scope.checkLoadStatus();

                SPService.showCustomer($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.custId, function (status, data){

                    if(status==200)
                    {
                        $scope.custName = data.customer_first_name + " " + data.customer_last_name;
                        $scope.custEmail = data.customer_email;
                        $scope.custPrefix = data.customer_phone_number_prefix;
                        $scope.custPhone = data.customer_phone_number;
                        $scope.custImage = data.customer_image_path;

                        $scope.loaded++;
                        $scope.checkLoadStatus();
                    }
                    else
                    {
                        NProgress.done();
                        $scope.error_message = "'We are Sorry!!! Something went wrong.'.";
                        $scope.error1 = 4;
                    }

                });

                if($scope.projectStatus=="ONGOING")
                {
                    SPService.showProjects($cookies.get('sp_id'), $cookies.get('sp_access_token'),  function (status, data){

                        if(status==200)
                        {
                            var i;
                            for(i=0;i<data.length;i++)
                            {
                                if(data[i]._id==$scope.projectId)
                                {
                                    break;
                                }
                            }

                            $scope.subCatName = data[i].subCategoryName;
                            $scope.requestDate = data[i].projectCreatedDateTime;
                            $scope.currencyCode = data[i].currencyCode;

                            $scope.loaded++;
                            $scope.checkLoadStatus();
                        }
                        else
                        {
                            NProgress.done();
                            $scope.error_message = "'We are Sorry!!! Something went wrong.'.";
                            $scope.error1 = 4;
                        }

                    });
                }
                else if($scope.projectStatus=="REQUESTED")
                {
                    SPService.getEngagements($cookies.get('sp_id'), $cookies.get('sp_access_token'),  function (status, data) {

                        if(status==200)
                        {
                            var i;
                            for(i=0;i<data.length;i++)
                            {
                                if(data[i]._id==$scope.projectId)
                                {
                                    break;
                                }
                            }

                            $scope.subCatName = data[i].subCategoryName;
                            $scope.requestDate = data[i].projectCreatedDateTime;
                            $scope.currencyCode = data[i].currencyCode;

                            $scope.loaded++;
                            $scope.checkLoadStatus();
                        }
                        else
                        {
                            NProgress.done();
                            $scope.error_message = "'We are Sorry!!! Something went wrong.'.";
                            $scope.error1 = 4;
                        }
                    });
                }

                if($scope.engagementStatus=='DUE')
                {
                    SPService.showForm($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,'filled',function(status,data){

                        if(status==200)
                        {
                            $scope.QForm = data.questionnaireForm;
                            var i;
                            for(i=0;i<$scope.QForm.length;i++)
                            {
                                if($scope.QForm[i].type==5)
                                {
                                    var tempDate = new Date($scope.QForm[i].filledValues[0]);
                                    $scope.QForm[i].filledValues[0] = tempDate.toISOString();
                                }
                            }

                            $scope.loaded++;
                            $scope.checkLoadStatus();
                        }
                        else
                        {
                            NProgress.done();
                            $scope.error_message = "'We are Sorry!!! Something went wrong.'."
                            $scope.error1 = 4;
                        }
                    });

                    SPService.showForm($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,'unfilled',function(status,data)
                    {

                        if(status==200)
                        {
                            if($scope.projectType==0)
                            {
                                $scope.AForm = data.auctionForm;

                                var i;
                                for(i=0;i<$scope.AForm.length;i++)
                                {
                                    if($scope.AForm[i].type==5 && $scope.AForm[i].forCp==true)
                                    {
                                        var tempDate = new Date($scope.AForm[i].filledValues[0]);
                                        $scope.AForm[i].filledValues[0] = tempDate.toISOString();
                                    }
                                    else if($scope.AForm[i].type==8)
                                    {
                                        $scope.basePrice = $scope.AForm[i].filledValues[0];
                                    }
                                }

                                console.log($scope.AForm);

                                $scope.loaded++;
                                $scope.checkLoadStatus();

                            }
                            else
                            {
                                $scope.PForm = data.proposalForm;

                                $scope.loaded++;
                                $scope.checkLoadStatus();
                            }
                        }
                        else
                        {
                            NProgress.done();
                            $scope.error_message = "'We are Sorry!!! Something went wrong.'."
                            $scope.error1 = 4;
                        }
                    });
                }
                else
                {
                    SPService.showForm($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,'filled',function(status,data){

                        if(status==200)
                        {
                           $scope.QForm = data.questionnaireForm;

                            var i;
                            for(i=0;i<$scope.QForm.length;i++)
                            {
                                if($scope.QForm[i].type==5)
                                {
                                    var tempDateString =  $scope.QForm[i].filledValues[0].replace("-","/");
                                    tempDateString = tempDateString.replace("-","/");
                                    var tempDate = new Date(tempDateString);
                                    $scope.QForm[i].filledValues[0] = tempDate.toISOString();
                                }
                            }


                            if($scope.projectType==0)
                            {
                                $scope.AForm = data.auctionForm;

                                for(i=0;i<$scope.AForm.length;i++)
                                {
                                    if($scope.AForm[i].type==5)
                                    {
                                        var tempDate = new Date($scope.AForm[i].filledValues[0]);
                                        $scope.AForm[i].filledValues[0] = tempDate.toISOString();
                                    }
                                }

                            }
                            else
                            {
                                $scope.PForm = data.proposalForm;

                                for(i=0;i<$scope.PForm.length;i++)
                                {
                                    if($scope.PForm[i].type==5)
                                    {
                                        var tempDate = new Date($scope.PForm[i].filledValues[0]);
                                        $scope.PForm[i].filledValues[0] = tempDate.toISOString();
                                    }
                                }
                            }
                            $scope.loaded = $scope.loaded+2;
                            $scope.checkLoadStatus();
                        }
                        else
                        {
                            NProgress.done();
                            $scope.error_message = "'We are Sorry!!! Something went wrong.'."
                            $scope.error1 = 4;
                        }
                    });
                }

                if($scope.engagementStatus=='AUCTION IN PROGRESS')
                {
                    SPService.showBids($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,function(status,data)
                    {

                       if(status==200) {
                           var i;

                           for (i = 0; i < data.myBids.length; i++) {
                               $scope.myBids.push({value: data.myBids[i].price, datePosted: data.myBids[i].date});
                           }

                           for (i = 0; i < data.otherBids.length; i++) {
                               if (data.otherBids[i].hasOwnProperty("bidderId")) {

                               }
                               else {
                                   $scope.otherBids.push({
                                       value: data.otherBids[i].price,
                                       datePosted: data.otherBids[i].date
                                   });
                               }

                           }


                           $scope.otherBids.sort(function (a, b) {

                               a1 = a.value;
                               b1 = b.value;

                               if (a1 == b1)
                                   return 0;
                               else if (a1 < b1)
                                   return -1;
                               else
                                   return +1;
                           });

                           $scope.myBids.sort(function (a, b) {

                               a1 = a.value;
                               b1 =b.value;

                               if (a1 == b1)
                                   return 0;
                               else if (a1 < b1)
                                   return -1;
                               else
                                   return +1;
                           });




                           var i, j;
                           i = j = 0;
                           while (i < $scope.myBids.length && j < $scope.otherBids.length)
                           {
                               $scope.bids.push({my:$scope.myBids[i],other:$scope.otherBids[i]});
                               i++;
                               j++;
                           }

                           while (i < $scope.myBids.length)
                           {
                               $scope.bids.push({my:$scope.myBids[i],other:{value:"",datePosted:""}});
                               i++;
                           }

                           while (j < $scope.otherBids.length)
                           {
                               $scope.bids.push({my:{value:"",datePosted:""},other:$scope.otherBids[j]});
                               j++;
                           }

                           console.log($scope.bids);


                           $scope.loaded++;
                           $scope.checkLoadStatus();

                       }
                        else
                       {
                           NProgress.done();
                           $scope.error_message = "'We are Sorry!!! Something went wrong.'."
                           $scope.error1 = 4;
                       }
                    });
                }

                $scope.loadThreads();






            }
            else
            {
                NProgress.done();
                $scope.error_message = "'We are Sorry!!! Something went wrong.'."
                $scope.error1 = 4;
            }
        });


    };

    $scope.loadThreads = function()
    {
            SPService.showThread($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,function(status,data){
            if(status==200)
            {

                for(i=0;i<data.length;i++)
                {
                    $scope.threads.push({"id":data[i].threadId,"name":data[i].threadName,"show":false});
                }


                $scope.loadMessages(0,function(){



                    $interval($scope.checkDiscussions, 5000 ,0);
                });

            }
            else if(status==404)
            {

                return;
            }
            else
            {
                alert(data);
                return;
            }

        });


    };

    $scope.loadMessages = function(i,callback)
    {
        if(i==$scope.threads.length)
            callback();

        else
        {
            if(i==0)
            {
                $scope.messages=[];
            }
            var j;

            SPService.getMessage($cookies.get('sp_id'), $cookies.get('sp_access_token'),$scope.threads[i].id,function(status,data)
            {
                if(status==200)
                {
                    $scope.messages[i]=[];
                    $scope.sp_img = data.spImage+"?s="+Math.random();
                    $scope.cust_img = data.customerImage+"?s="+Math.random();
                    for(j=0;j<data.message.length;j++)
                    {
                        $scope.messages[i].push(data.message[j]);
                    }
                    $scope.loadMessages(i+1,function(){
                        callback();
                    });
                }
                else if(status==402)
                {
                    $scope.messages[i]=[];
                    $scope.loadMessages(i+1,function(){
                        callback();
                    });
                }
            });

        }
    };

    $scope.checkDiscussions = function()
    {

        var temp_threads = [];
        var i,j;
        SPService.showThread($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,function(status,data){
            if(status==200)
            {

                for(i=0;i<data.length;i++)
                {
                   temp_threads.push({"id":data[i].threadId,"name":data[i].threadName,"show":false});
                }


                if(temp_threads.length!=$scope.threads.length)
                {
                    for(i=0;i<temp_threads.length;i++)
                    {
                        for(j=0;j<$scope.threads.length;j++)
                        {
                            if($scope.threads[j].id == temp_threads[i].id)
                            {
                                break;
                            }
                        }

                        if(j==$scope.threads.length)
                        {
                            $scope.threads.push(temp_threads[i]);
                            $scope.messages.push([]);
                            $scope.checkMessages($scope.messages.length-1);
                        }
                    }
                }
                else
                {
                    for(i=0;i<$scope.threads.length;i++)
                    {
                        $scope.checkMessages(i);
                    }
                }


            }

        });
    };

    $scope.checkMessages = function(index)
    {

        var temp_messages = [];
        var i,j;
        SPService.getMessage($cookies.get('sp_id'), $cookies.get('sp_access_token'),$scope.threads[index].id,function(status,data)
        {
            if(status==200)
            {

                for(i=0;i<data.message.length;i++)
                {
                    temp_messages.push(data.message[i]);
                }

                if(temp_messages.length!= $scope.messages[index].length)
                {

                    for(i=0;i<temp_messages.length;i++)
                    {

                        for(j=0;j<$scope.messages[index].length;j++)
                        {
                            var date =  new Date(temp_messages[i].datePosted);

                            if($scope.messages[index][j]._id == temp_messages[i]._id)
                            {
                                break;
                            }
                            else if($scope.hashString(temp_messages[i].messageString+date.getDay()+date.getMonth()+date.getFullYear()+date.getHours()+date.getMinutes())==$scope.messages[index][j]._id)
                            {

                                break;
                            }
                            else{

                            }

                        }

                        if(j==$scope.messages[index].length)
                        {
                            $scope.messages[index].push(temp_messages[i]);
                            $scope.threads[index].show = true;
                            break;
                        }
                    }

                }

            }
            else if(status==402)
            {


            }
        });
    };



    $scope.sendMessage= function(id,m,index)
    {


        if(m=="" || typeof m =="undefined")
        {
            alert("Please enter some text");
            return;
        }
        SPService.sendMessage($cookies.get('sp_id'), $cookies.get('sp_access_token'),id,m,function(status,data){
            if(status==200)
            {
                for(i=0;i<$scope.threads.length;i++)
                {
                    if($scope.threads[i].id == id)
                        break;
                }

                var date = new Date();
                date.setMinutes(date.getMinutes()-1);

                $scope.messages[i].push({ "_id":$scope.hashString(m+date.getDay()+date.getMonth()+date.getFullYear()+date.getHours()+date.getMinutes()),"postedByType":"sp","messageString":m,"datePosted":new Date()});
                $scope.send_message[index]="";

            }
            else
            {
                alert("Error");
                return;
            }
        });
    };


    $scope.hashString = function(s)
    {
        var hash = 0, i, chr, len;
        if (s.length == 0) return hash;
        for (i = 0, len = s.length; i < len; i++)
        {
            chr = s.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return Math.floor(hash/10);

    };

    $scope.addThread = function( )
    {
        if($scope.add_name=="" || typeof $scope.add_name =="undefined")
        {
            alert("Please enter a name for the thread");
            return;
        }

        SPService.addThread($cookies.get('sp_id'), $cookies.get('sp_access_token'),$scope.projectId,$scope.custId,$scope.add_name,function(status,data){
            if(status==200)
            {

                $scope.add_name="";
                $scope.threads.push({"id":data.threadId,"name":data.threadName,"show":false});
                $scope.messages.push([]);

            }
            else
            {
                alert("Error");
                return;
            }
        });
    };

    $scope.deleteThread = function (id)
    {

        SPService.deleteThread($cookies.get('sp_id'), $cookies.get('sp_access_token'),id,function(status,data){
            if(status==200)
            {
                alert("Thread deleted successfully");

                $scope.loadThreads();

            }
            else
            {
                alert("Error");
            }
        });
    };

    $scope.toggleCheckbox = function(i,box)
    {
        if($scope.formValues[i].indexOf(box))
        {
            $scope.formValues[i].push(box);
        }
        else
        {
            var index = $scope.formValues[i].indexOf(box);
            $scope.formValues[i].splice(index,1);
        }
    };


    $scope.isPresent = function(array,value)
    {
        if(array.indexOf(value)!=-1)
            return 1;
        else
            return 0;


    };

    $scope.extractDate = function(input)
    {
        if(input!=undefined)
            return input.substring(0,10);
    };

    $scope.extractTime = function(input)
    {
        if(input!=undefined)
            return input.substring(11,16);
    };


    $scope.isPropertyExist = function(obj,val)
    {
        return obj.hasOwnProperty(val);
    };

    $scope.submitProposalForm = function()
    {

        var i,j;
        for (i = 0; i < $scope.PForm.length; i++)
        {

            if($scope.PForm[i].type==0 || $scope.PForm[i].type==2 || $scope.PForm[i].type==3 || $scope.PForm[i].type==6)
            {
                if(typeof $scope.formValues[i] == 'undefined' || $scope.formValues[i] == '')
                {
                    if($scope.PForm[i].required == true)
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
            else if($scope.PForm[i].type==1)
            {
                if(typeof $scope.formValues[i].length==0)
                {
                    if($scope.PForm[i].required == true)
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
            else if($scope.PForm[i].type==5)
            {
                if(typeof $scope.formValues[i][0] == 'undefined' || $scope.formValues[i][0] == '' || typeof $scope.formValues[i][1] == 'undefined' || $scope.formValues[i][1] == '')
                {
                    if($scope.PForm[i].required == true)
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
            else if($scope.PForm[i].type==7 || $scope.PForm[i].type==8)
            {
                if(typeof $scope.formValues[i] == 'undefined' || $scope.formValues[i] == '')
                {
                    if($scope.PForm[i].required == true)
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

        for (i = 0; i < $scope.PForm.length; i++)
        {

            if ($scope.PForm[i].type != 1 && $scope.PForm[i].type != 5 && $scope.PForm[i].type != 4)
            {
                $scope.PForm[i].filledValues.push(String($scope.formValues[i]));
            }
            else if ($scope.PForm[i].type == 5)
            {
                $scope.PForm[i].filledValues.push($scope.formValues[i][0] + " " + $scope.formValues[i][1] + ":00");
            }
            else
            {
                for (j = 0; j < $scope.formValues[i].length; j++) {
                    $scope.PForm[i].filledValues.push(String($scope.formValues[i][j]));
                }

                for(j=0;j<$scope.PForm[i].value.length;j++)
                {
                    $scope.PForm[i].value[j] = String($scope.PForm[i].value[j]);
                }
            }
        }

        console.log($scope.PForm);



        SPService.saveFilledForm($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,'PROPOSALFORM',$scope.PForm,function(status){

            if(status==200)
            {
                alert('Success');
                $scope.init();
            }
            else
            {
                alert(status);
            }

        })
    };

    $scope.submitAuctionForm = function()
    {

        var i,j;
        for (i = 0; i < $scope.AForm.length; i++)
        {
            if($scope.AForm[i].forSp==true)
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
                            $scope.error_message[i] = "This field only accepts numbers";
                            $scope.error[i] = true;
                        }
                        else if($scope.AForm[i].type==7 && Number($scope.formValues[i])>Number($scope.basePrice))
                        {
                            $scope.error_message[i] = "Quoted Price cannot be greater than Baseprice";
                            $scope.error[i] = true;
                        }
                    }
                }

            }

        }

        console.log($scope.error_message);

        if ($scope.error.indexOf(true) != -1) {
            return;
        }

        for (i = 0; i < $scope.AForm.length; i++)
        {
            if($scope.AForm[i].forSp==true)
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


        SPService.saveFilledForm($cookies.get('sp_id'), $cookies.get('sp_access_token'), $scope.projectId,'AUCTIONFORM',$scope.AForm,function(status) {

            if (status == 200) {
                $scope.success = 1;
                $timeout(function () {
                    $scope.init();
                }, 2000);
            }
            else {
                $scope.error_message = "Something went wrong. Please try again";
                $scope.error1 = 1;
            }
        });



    };


    $scope.addBid = function()
    {

        if($scope.bid=="" || typeof $scope.bid =="undefined")
        {
            alert("Please enter the bid");
            return;
        }
        else if(isNaN($scope.bid))
        {
            alert("Please enter the a valid number");
            return;
        }
        else if(Number($scope.bid)<0)
        {
            alert("Your bid cannot be less than zero");
            return;
        }
        else if($scope.otherBids.length==0)
        {
            if(Number($scope.bid)>= Number($scope.myBids[0].value))
            {
                alert("Please enter the a bid lower than the previous one");
                return;
            }

        }
        else
        {
            if(Number($scope.bid)>= Math.min($scope.myBids[0].value,$scope.otherBids[0].value))
            {
                alert("Please enter the a bid lower than the previous one");
                return;
            }
        }


        NProgress.start();

        SPService.addBid($cookies.get('sp_id'),$cookies.get('sp_access_token'),$scope.projectId,$scope.bid,function(data){

            NProgress.done();
            if(data=="yes")
            {
                var currentDate = new Date();

                $scope.myBids.unshift({value:Number($scope.bid),datePosted:currentDate.toISOString()});

                $scope.latestPrice= Number($scope.bid) ;
                $scope.bid ='';
                $scope.bids= [];
                var i, j;
                i = j = 0;
                while (i < $scope.myBids.length && j < $scope.otherBids.length)
                {
                    $scope.bids.push({my:$scope.myBids[i],other:$scope.otherBids[i]});
                    i++;
                    j++;
                }

                while (i < $scope.myBids.length)
                {
                    $scope.bids.push({my:$scope.myBids[i],other:{value:"",datePosted:""}});
                    i++;
                }

                while (j < $scope.otherBids.length)
                {
                    $scope.bids.push({my:{value:"",datePosted:""},value:$scope.otherBids[i]});
                    j++;
                }


                $scope.$apply();

                console.log($scope.bids);
            }
            else
            {
                alert(data);
            }
        });
    };

    $scope.checkLoadStatus = function()
    {
        if($scope.loaded >= 5)
        {

            NProgress.done();
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
        }
        else if($scope.loaded < 4)
            NProgress.inc();
    };



        $scope.sliderInitialise  = function(index,id)
        {
            if(id=="auction")
            {
                $scope.AForm[index].value[0] = Number($scope.AForm[index].value[0]);
                $scope.AForm[index].value[1] = Number($scope.AForm[index].value[1]);

                $scope.formValues[index]=[];
                $scope.formValues[index][0]=$scope.AForm[index].value[0] + Math.round(($scope.AForm[index].value[1]-$scope.AForm[index].value[0])/4);
                $scope.formValues[index][1]=$scope.AForm[index].value[0] + Math.round(3*($scope.AForm[index].value[1]-$scope.AForm[index].value[0])/4);
            }
            else if(id=="proposal")
            {
                $scope.PForm[index].value[0] = Number($scope.PForm[index].value[0]);
                $scope.PForm[index].value[1] = Number($scope.PForm[index].value[1]);

                $scope.formValues[index]=[];
                $scope.formValues[index][0]=$scope.AForm[index].value[0] + Math.round(($scope.AForm[index].value[1]-$scope.AForm[index].value[0])/4);
                $scope.formValues[index][1]=$scope.AForm[index].value[0] + Math.round(3*($scope.AForm[index].value[1]-$scope.AForm[index].value[0])/4);
            }

            console.log($scope.AForm[index]);
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

        $scope.showCustomerModal = function()
        {
            $('#customerModal').modal('show');
        };

        $scope.hideCustomerModal = function()
        {
            $('#customerModal').modal('hide');
        };




            $scope.init();


}]);