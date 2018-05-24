angular.module('Frugal').controller('viewEngagementCtrl', ['$scope', 'CPService', '$timeout', '$stateParams', '$state', '$interval','$cookies',
    function ($scope, CPService, $timeout, $stateParams, $state, $interval,$cookies) {

        $scope.openPopup = function (id, project_id) {
            $scope.project_id_to_rate = project_id;
            $('#' + id).modal({backdrop: 'static',
                keyboard: false,show:true});

        };

        $scope.closePopup = function (id) {
            $('#' + id).modal('hide');

        };


        $scope.init = function () {
            $scope.set = 0;

            $scope.error = 0;
            $scope.error_message = "";

            $scope.$parent.pointer_flag = 0;

            $scope.projectId = $stateParams.projectId;
            $scope.engId = $stateParams.engId;
            $scope.ancestor = $stateParams.ancestor;

            $scope.data = [];
            $scope.threads = [];
            $scope.messages = [];
            $scope.proposal_show = false;
            $scope.auction_show = false;

            $scope.rating_error = 0;
            $scope.rating = 0;

            $scope.cust_img = "";
            $scope.sp_img = "";
            $scope.spImageLoaded = 0;
            $scope.custImageLoaded = 0;

            $scope.send_message = [];


            CPService.engagementInfo($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.projectId, $scope.engId, function (status, data) {
                if (status == 200) {
                    var i;

                    $scope.data = data;


                    if(data.engagementsData[0].engagementStatus=="AUCTION_IN_PROGRESS")
                    {
                        data.engagementsData[0].engagementStatus="AUCTION IN PROGRESS";
                    }
                    else if(data.engagementsData[0].engagementStatus=="SUBMITTED_FOR_PROPOSAL")
                    {
                        data.engagementsData[0].engagementStatus="SUBMITTED FOR PROPOSAL";
                    }
                    console.log($scope.data);


                    $scope.set = 1;

                    for (i = 0; i < $scope.data.discussionData.length; i++) {
                        $scope.threads.push({
                            "id": $scope.data.discussionData[i]._id,
                            "name": $scope.data.discussionData[i].threadName,
                            "show": false
                        });
                    }

                    console.log($scope.threads);
                    $scope.loadMessages(0, function () {
                        console.log($scope.messages);
                        $interval($scope.checkDiscussions, 5000, 0);
                    });

                }
                else {
                    alert('Wrong');
                    return;
                }
            });

        };


        $scope.loadMessages = function (i, callback) {
            if (i == $scope.threads.length)
                callback();

            else {
                if (i == 0) {
                    $scope.messages = [];
                }
                var j;
                CPService.getMessage($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.threads[i].id, function (status, data) {
                    if (status == 200) {
                        $scope.messages[i] = [];
                        for (j = 0; j < data.length; j++) {
                            $scope.messages[i].push(data[j]);

                            if (data[j].postedByType == "sp") {
                                $scope.sp_img = data[j].Image + "?s=" + Math.random();
                            }

                            if (data[j].postedByType == "customer") {
                                $scope.cust_img = data[j].Image + "?s=" + Math.random();
                            }

                        }
                        $scope.loadMessages(i + 1, function () {
                            callback();
                        })
                    }
                });
            }
        };

        $scope.checkDiscussions = function () {

            var temp_threads = [];
            var i, j;
            CPService.engagementInfo($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.projectId, $scope.engId, function (status, data) {
                if (status == 200) {

                    console.log('s');
                    console.log($scope.custImageLoaded);

                    var i;

                    for (i = 0; i < data.discussionData.length; i++) {
                        temp_threads.push({
                            "id": data.discussionData[i]._id,
                            "name": data.discussionData[i].threadName,
                            "show": false
                        });
                    }


                    if (temp_threads.length != $scope.threads.length) {
                        for (i = 0; i < temp_threads.length; i++) {
                            for (j = 0; j < $scope.threads.length; j++) {
                                if ($scope.threads[j].id == temp_threads[i].id) {
                                    break;
                                }
                            }

                            if (j == $scope.threads.length) {
                                $scope.threads.push(temp_threads[i]);
                                $scope.messages.push([]);
                                $scope.checkMessages($scope.messages.length - 1);
                            }
                        }
                    }
                    else {
                        for (i = 0; i < $scope.threads.length; i++) {
                            $scope.checkMessages(i);
                        }
                    }


                }

            });
        };

        $scope.checkMessages = function (index) {
            console.log('s');
            var temp_messages = [];
            var i, j;
            CPService.getMessage($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.threads[index].id, function (status, data) {
                if (status == 200) {

                    for (i = 0; i < data.length; i++) {
                        temp_messages.push(data[i]);
                    }

                    if (temp_messages.length != $scope.messages[index].length) {
                        console.log('x');
                        for (i = 0; i < temp_messages.length; i++) {

                            for (j = 0; j < $scope.messages[index].length; j++) {
                                var date = new Date(temp_messages[i].datePosted);

                                if ($scope.messages[index][j]._id == temp_messages[i]._id) {
                                    break;
                                }
                                else if ($scope.hashString(temp_messages[i].messageString + date.getDay() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes()) == $scope.messages[index][j]._id) {
                                    console.log('sadasd');
                                    break;
                                }
                                else {
                                    console.log($scope.messages[index][j]._id);
                                }

                            }

                            if (j == $scope.messages[index].length) {
                                $scope.messages[index].push(temp_messages[i]);
                                $scope.threads[index].show = true;
                                break;
                            }
                        }

                    }

                }
                else if (status == 402) {


                }
            });
        };

        $scope.sendMessage = function (id, m, index) {


            if (m == "" || typeof m == "undefined") {
                alert("Please enter some text");
                return;
            }
            CPService.sendMessage($cookies.get('cust_id'), $cookies.get('cust_access_token'), id, m, function (status, data) {
                if (status == 200) {
                    for (i = 0; i < $scope.threads.length; i++) {
                        if ($scope.threads[i].id == id)
                            break;
                    }

                    var date = new Date(data.datePosted);
                    console.log($scope.hashString(m + date.getDay() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes()));
                    $scope.messages[i].push({
                        "_id": $scope.hashString(m + date.getDay() + date.getMonth() + date.getFullYear() + date.getHours() + date.getMinutes()),
                        "postedByType": "customer",
                        "messageString": m,
                        "firstName":$cookies.get('cust_fname'),
                        "lastName":$cookies.get('cust_lname'),
                        "datePosted": new Date(data.datePosted)
                    });
                    $scope.send_message[index] = "";

                }
                else {
                    alert("Error");
                    return;
                }
            });
        };


        $scope.hashString = function (s) {
            var hash = 0, i, chr, len;
            if (s.length == 0) return hash;
            for (i = 0, len = s.length; i < len; i++) {
                chr = s.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return Math.floor(hash / 10);

        };


        $scope.addThread = function () {
            if ($scope.add_name == "" || typeof $scope.add_name == "undefined") {
                alert("Please enter a name for the thread");
                return;
            }

            CPService.addThread($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.projectId, $scope.engId, $scope.add_name, function (status, data) {
                if (status == 200) {
                    $scope.add_name = "";
                    $scope.threads.push({"id": data.discussion_id, "name": data.discussion_name, "show": false});
                    $scope.messages.push([]);

                }
                else {
                    alert("Error");
                    return;
                }
            });
        };

        $scope.deleteThread = function (id) {
            CPService.deleteThread($cookies.get('cust_id'), $cookies.get('cust_access_token'), id, function (status, data) {
                if (status == 200) {
                    alert("Thread deleted successfully");

                    $scope.loadMessages();

                }
                else {
                    alert("Error");
                    return;
                }
            });
        };


        $scope.completeProject = function () {
            NProgress.start();
            CPService.completeProject($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.projectId, function (status, data) {
                if (status == 200) {
                    NProgress.done();
                    $scope.openPopup('ratingModal',$scope.projectId);
                    return;
                }
                else {
                    NProgress.done();
                    alert('error');
                    return;
                }
            });
        };


        $scope.createArray = function (n) {
            var x = [];
            for (i = 1; i <= n; i++) {
                x.push(i);
            }
            return x;
        };

        $scope.viewSP = function (id) {
        }

        $scope.isPresent = function (array, value) {
            if (array.indexOf(value) != -1)
                return 1;
            else
                return 0;


        };

        $scope.extractDate = function (input) {
            if (input != undefined)
                return input.substring(0, 10);
        };

        $scope.extractTime = function (input) {
            if (input != undefined)
                return input.substring(11, 16);
        };

        $scope.submitRating = function () {
            CPService.rateProject($cookies.get('cust_id'), $cookies.get('cust_access_token'), $scope.project_id_to_rate, $scope.rating, $scope.review, function (status, data) {

                if (status == 200) {
                    $scope.success = 1;
                    $timeout(function () {
                        $scope.closePopup('ratingModal');
                        $timeout(function () {
                           $state.go("CP.myProjects");
                        }, 500);
                    }, 1000);


                }
                else {
                    $scope.error_message = 'We are Sorry!!! Something went wrong. Try again';
                    $scope.error = 1;
                }
            })
        };

        $scope.skipRating = function()
        {
            $timeout(function () {
                $scope.closePopup('ratingModal');
                $timeout(function () {
                    $state.go("CP.myProjects");
                }, 500);
            }, 1000);
        };

        $scope.init();
    }]);