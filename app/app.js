angular.module('Frugal', ['ngCookies', 'ui.bootstrap', 'ngSanitize', 'ui.select', 'ui.router', 'ui.mask',"isteven-multi-select",'LocalStorageModule']);

angular.module('Frugal').constant('CONSTANT', {
    ApiURL: 'http://api.frugal.services:3030',
    SPApiURL: 'http://api.frugal.services:3060',
    CountryApiURL: 'http://api.frugal.services:3000',
    countryCode : "IND",
    countryPrefix: "+91",
    countryZipLength : 6,
    countryLengthUnit : "km"
});


angular.module('Frugal').directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                //call the function that was passed
                scope.$apply(attrs.imageonload);
            });
        }
    };
});

angular.module('Frugal').run(['$state', 'CPService', 'SPService', '$rootScope', function ($state, CPService, SPService, $rootScope) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        if(toState.authentication=="CP" && !CPService.isLogin())
        {
            event.preventDefault();
            if(SPService.isLogin())
            {
                $state.go("SP.myProjects");
            }
            else
            {
                $state.go("welcomeScreen");
            }
        }
        else if(toState.authentication=="SP" && !SPService.isLogin())
        {
            event.preventDefault();

            if(CPService.isLogin())
            {
                $state.go("CP.myProjects");
            }
            else
            {
                $state.go("welcomeScreen");
            }
        }


    });
}]);

angular.module('Frugal').directive('ionslider', function ($timeout) {
    return {
        restrict: 'E',
        scope: {
            min: '=',
            max: '=',
            type: '@',
            prefix: '@',
            maxPostfix: '@',
            prettify: '@',
            grid: '@',
            gridMargin: '@',
            postfix: '@',
            step: '@',
            hideMinMax: '@',
            hideFromTo: '@',
            from: '=',
            to: '=',
            disable: '=',
            onChange: '=',
            onFinish: '=',
            fromFixed: '=',
            toFixed: '='

        },
        template: '<div></div>',
        replace: true,
        link: function ($scope, $element, attrs) {
            (function init() {
                $element.ionRangeSlider({
                    min: $scope.min,
                    max: $scope.max,
                    type: $scope.type,
                    prefix: $scope.prefix,
                    maxPostfix: $scope.maxPostfix,
                    prettify: $scope.prettify,
                    grid: $scope.grid,
                    gridMargin: $scope.gridMargin,
                    postfix: $scope.postfix,
                    step: $scope.step,
                    hideMinMax: $scope.hideMinMax,
                    hideFromTo: $scope.hideFromTo,
                    from: $scope.from,
                    to: $scope.to,
                    disable: $scope.disable,
                    onChange: $scope.onChange,
                    onFinish: $scope.onFinish,
                    from_fixed: $scope.fromFixed,
                    to_fixed: $scope.toFixed
                });
            })();
            $scope.$watch('min', function (value) {
                $timeout(function () {
                    $element.data("ionRangeSlider").update({min: value});
                });
            }, true);
            $scope.$watch('max', function (value) {
                $timeout(function () {
                    $element.data("ionRangeSlider").update({max: value});
                });
            });
            $scope.$watch('from', function (value) {
                $timeout(function () {
                    $element.data("ionRangeSlider").update({from: value});
                });
            });
            $scope.$watch('to', function (value) {
                $timeout(function () {
                    $element.data("ionRangeSlider").update({to: value});
                });
            });
            $scope.$watch('disable', function (value) {
                $timeout(function () {
                    $element.data("ionRangeSlider").update({disable: value});
                });
            });
        }
    }
});


angular.module('Frugal').service('CPService', function ($http, CONSTANT, $cookies, $location, $timeout) {


    this.login = function (email, pass, callback) {


        var parameters = {
            "customer_email": email,
            "customer_password": pass,
            "longitude": 0,
            "latitude": 0,
            "deviceType": "desktop"
        };
        $http.post(CONSTANT.ApiURL + '/api/registrationAndLogin/customer_email_login', parameters)
            .success(function (data, status) {
                $cookies.put('cust_id', data.data.customer_id);
                $cookies.put('cust_access_token', data.data.customer_access_token[0]);
                $cookies.put('cust_email', data.data.customer_email);
                $cookies.put('cust_image', data.data.customer_image_path);
                $cookies.put('cust_phone_prefix', data.data.customer_phone_number_prefix);
                $cookies.put('cust_phone', data.data.customer_phone_number);
                $cookies.put('cust_fname', data.data.customer_first_name);
                $cookies.put('cust_lname', data.data.customer_last_name);
                callback(status);

            }).error(function (data, status) {
                callback(status);
            });


    };

    this.FBLogin = function(fbId,callback)
    {
        var parameters = {
            "customer_fb_id": fbId,
            "longitude": 0,
            "latitude": 0,
            "deviceType": "desktop"
        };
        $http.post(CONSTANT.ApiURL + '/api/registrationAndLogin/customer_facebook_login', parameters)
            .success(function (data, status) {
                $cookies.put('cust_id', data.data.customer_id);
                $cookies.put('cust_access_token', data.data.customer_access_token[0]);
                $cookies.put('cust_email', data.data.customer_email);
                $cookies.put('cust_image', data.data.customer_image_path);
                $cookies.put('cust_phone_prefix', data.data.customer_phone_number_prefix);
                $cookies.put('cust_phone', data.data.customer_phone_number);
                $cookies.put('cust_fname', data.data.customer_first_name);
                $cookies.put('cust_lname', data.data.customer_last_name);
                callback(status);

            }).error(function (data, status) {
                callback(status);
            });

    };

    this.isLogin = function () {

        if ((typeof $cookies.get('cust_id')) === 'undefined')
            return 0;
        else
            return 1;
    };

    this.logout = function (callback) {
        var cookies = $cookies.getAll();

        $timeout(function () {
            angular.forEach(cookies, function (value, key) {
                $cookies.remove(key);
            });
            callback();
        }, 1500);


    };

    this.register = function (fbFlag,fname, lname, phone_prefix, phone, email, pass,fbId,fbImagePath, callback) {

        console.log("s");
        if(!fbFlag)
        {
            var parameters = {
                "customer_first_name": fname,
                "customer_last_name": lname,
                "customer_phone_number_prefix": phone_prefix,
                "customer_phone_number": phone,
                "customer_email": email,
                "customer_password": pass,
                "longitude": 0,
                "latitude": 0,
                "deviceType": "desktop"
            };
        }
        else
        {
            var parameters = {
                "customer_first_name": fname,
                "customer_last_name": lname,
                "customer_phone_number_prefix": phone_prefix,
                "customer_phone_number": phone,
                "customer_email": email,
                "customer_password": pass,
                "longitude": 0,
                "latitude": 0,
                "deviceType": "desktop",
                "customer_image_path":fbImagePath,
                "customer_fb_id":fbId
            };
        }


        $http.post(CONSTANT.ApiURL + '/api/registrationAndLogin/customer_registration', parameters)
            .success(function (data, status) {
                callback(status);

            }).error(function (data, status) {
                callback(status);
            });

    };


    this.getDefaultServices = function (cust_id, cust_access_token, callback) {
        var parameters = {"customer_id": cust_id, "customer_access_token": cust_access_token};
        $http.post(CONSTANT.ApiURL + '/api/createRequest/get_default_services', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.getSPLocationList = function (cust_id, cust_access_token, sub_id, location_type, location_array, callback) {
        var parameters;
        if (location_type == 'ZIPCODE') {
            parameters = {
                "customer_id": cust_id,
                "customer_access_token": cust_access_token,
                "sub_category_id": sub_id,
                "zipcodes": location_array[0]
            };
        }
        if (location_type == 'TOWN') {
            parameters = {
                "customer_id": cust_id,
                "customer_access_token": cust_access_token,
                "sub_category_id": sub_id,
                "towns": location_array[0]
            };
        }
        if (location_type == 'RADIUS') {
            parameters = {
                "customer_id": cust_id,
                "customer_access_token": cust_access_token,
                "sub_category_id": sub_id,
                "radius": String(location_array[2]),
                "latitude": String(location_array[0]),
                "longitude": String(location_array[1])
            };
        }

        console.log(parameters);

        $http.post(CONSTANT.ApiURL + '/api/createRequest/get_sp_on_location_for_service', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });

    };

    this.getServiceDetails = function (cust_id, cust_access_token, sub_id, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "sub_category_id": sub_id
        };
        $http.post(CONSTANT.ApiURL + '/api/createRequest/get_service_details', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, data.message);
            });
    };
    this.getServiceSP = function (cust_id, cust_access_token, sub_id, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "sub_category_id": sub_id
        };

        $http.post(CONSTANT.ApiURL + '/api/createRequest/get_sp_on_selected_services', parameters)
            .success(function (data, status, headers, config) {
                callback(status, data.data);
            }).error(function (data, status, headers, config) {
                callback(status, 'error');
            });

    };

    this.createRequest = function (cust_id, cust_access_token, sub_id, spids, project_type, auctionForm, questionnaireForm, proposalForm, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "sub_category_id": sub_id,
            "service_provider_ids": spids,
            "project_type": project_type,
            "auctionForm": auctionForm,
            "questionnaireForm": questionnaireForm,
            "proposalForm": proposalForm
        };
        console.log(parameters);
        $http.post(CONSTANT.ApiURL + '/api/createRequest/create_request', parameters)
            .success(function (data, status, headers, config) {
                callback(status, data.data);
            }).error(function (data, status, headers, config) {
                callback(status, 'error');
            });

    };

    this.getAllRequests = function (cust_id, cust_access_token, callback) {
        var parameters = {"customer_id": cust_id, "customer_access_token": cust_access_token};
        $http.post(CONSTANT.ApiURL + '/api/requestTask/get_my_request', parameters)
            .success(function (data, status, headers, config) {
                callback(status, data.data);
            }).error(function (data, status, headers, config) {
                callback(status, 'error');
            });
    };

    this.ListSPForRequest = function (cust_id, cust_access_token, project_id, callback) {
        var parameters = {"customer_id": cust_id, "customer_access_token": cust_access_token, "project_id": project_id};
        $http.post(CONSTANT.ApiURL + '/api/requestTask/get_list_of_sp_for_request', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.engagementInfo = function (cust_id, cust_access_token, project_id, eng_id, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "project_id": project_id,
            "engagement_id": eng_id
        };
        $http.post(CONSTANT.ApiURL + '/api/requestTask/get_engagement_info', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.engageSP = function (cust_id, cust_access_token, project_id, spId, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "project_id": project_id,
            "spId": spId
        };

        $http.post(CONSTANT.ApiURL + '/api/requestTask/engage_with_sp', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });

    };

    this.getMessage = function (cust_id, cust_access_token, discussion_id, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "discussion_id": discussion_id
        };
        $http.post(CONSTANT.ApiURL + '/api/discussion/get_message_of_discussion', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.addThread = function (cust_id, cust_access_token, project_id, eng_id, name, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "project_id": project_id,
            "engagement_id": eng_id,
            "discussion_name": name
        };

        $http.post(CONSTANT.ApiURL + '/api/discussion/add_discussion', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.deleteThread = function (cust_id, cust_access_token, discussion_id, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "discussion_id": discussion_id
        };

        $http.post(CONSTANT.ApiURL + '/api/discussion/hide_discussion', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.sendMessage = function (cust_id, cust_access_token, discussion_id, message, callback) {
        var parameters = {
            "customer_id": cust_id,
            "customer_access_token": cust_access_token,
            "discussion_id": discussion_id,
            "message": String(message)
        };
        console.log(parameters);
        $http.post(CONSTANT.ApiURL + '/api/discussion/send_message', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.getAllProjects = function (cust_id, cust_access_token, callback) {
        var parameters = {"customer_id": cust_id, "customer_access_token": cust_access_token};
        $http.post(CONSTANT.ApiURL + '/api/projectTasks/get_my_projects', parameters)
            .success(function (data, status, headers, config) {
                callback(status, data.data);
            }).error(function (data, status, headers, config) {
                callback(status, 'error');
            });
    };
    this.completeProject = function (cust_id, cust_access_token, project_id, callback) {
        var parameters = {"customer_id": cust_id, "customer_access_token": cust_access_token, "project_id": project_id};
        $http.post(CONSTANT.ApiURL + '/api/projectTasks/complete_project', parameters)
            .success(function (data, status, headers, config) {
                callback(status, data.data);
            }).error(function (data, status, headers, config) {
                callback(status, 'error');
            });
    };

    this.rateProject = function (cust_id, cust_access_token, project_id, rating, review, callback) {
        var parameters;
        if (review == "" || typeof  review == "undefined") {
            parameters = {
                "customer_id": cust_id,
                "customer_access_token": cust_access_token,
                "project_id": project_id,
                "rating": rating
            };
        }
        else {
            parameters = {
                "customer_id": cust_id,
                "customer_access_token": cust_access_token,
                "project_id": project_id,
                "rating": rating,
                "review_text": review
            };
        }

        console.log(parameters);

        console.log(parameters);

        $http.post(CONSTANT.ApiURL + '/api/projectTasks/rate_project', parameters)
            .success(function (data, status, headers, config) {
                callback(status, data.data);
            }).error(function (data, status, headers, config) {
                callback(status, 'error');
            });
    };

    this.getSPProfile = function (cust_id, cust_access_token, spId, callback) {
        var parameters = {"customer_id": cust_id, "customer_access_token": cust_access_token, "spId": spId};
        $http.post(CONSTANT.ApiURL + '/api/profile/get_sp_profile_info', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.forgotPassword = function (email, callback) {
        var parameters = {"email_id": email};

        $http.post(CONSTANT.ApiURL + "/api/profile/forget_password", parameters)
            .success(function (data, status) {
                callback(status, data.message);
            }).error(function (data, status) {
                callback(status, data.message);
            });
    };


});

angular.module('Frugal').service('SPService', function ($http, CONSTANT, $cookies, $timeout) {

    this.login = function (email, pass, callback) {
        var parameters = {"email": email, "password": pass, "deviceType": "desktop"};
        $http.post(CONSTANT.SPApiURL + '/api/sp/login', parameters)
            .success(function (data, status) {
                $cookies.put('sp_id', data.data._id);
                $cookies.put('sp_access_token', data.data.accessToken);
                $cookies.put('sp_fname', data.data.firstName);
                $cookies.put('sp_lname', data.data.lastName);
                callback(status);
            })
            .error(function (data, status) {
                callback(status);
            });

    };

    this.FBLogin = function(fbId,fbAccessToken,callback)
    {
        var parameters = {
            "fbId": fbId,
            "fbAccessToken":fbAccessToken,
            "deviceType": "desktop"
        };
        $http.post(CONSTANT.SPApiURL + '/api/sp/fbLogin', parameters)
            .success(function (data, status) {
                $cookies.put('sp_id', data.data._id);
                $cookies.put('sp_access_token', data.data.accessToken);
                $cookies.put('sp_fname', data.data.firstName);
                $cookies.put('sp_lname', data.data.lastName);
                callback(status);
            })
            .error(function (data, status) {
                callback(status);
            });

    };


    this.isLogin = function () {

        if ((typeof $cookies.get('sp_id')) === 'undefined')
            return 0;
        else
            return 1;
    };

    this.logout = function (sp_id, sp_acess_token, callback) {

        $http.delete(CONSTANT.SPApiURL + '/api/sp/logOut/' + sp_id + '/' + sp_acess_token)
            .success(function (data, status) {
                var cookies = $cookies.getAll();

                $timeout(function () {
                    angular.forEach(cookies, function (value, key) {
                        $cookies.remove(key);
                    });
                    callback(status);
                }, 1000);
            })
            .error(function (data, status) {
                var cookies = $cookies.getAll();

                $timeout(function () {
                    angular.forEach(cookies, function (value, key) {
                        $cookies.remove(key);
                    });
                    callback(status);
                }, 1000);
                callback(status);
            });


    };

    this.registration = function (fbFlag,fname, lname,business, phone_prefix, phone, email, pass,fbId,fbAccessToken,fbImagePath, callback) {


        if(!fbFlag)
        {
            var parameters = {
                "firstName": fname,
                "lastName": lname,
                "businessName": business,
                "email": email,
                "phoneNumberPrefix": phone_prefix,
                "phoneNumber": Number(phone),
                "password": pass,
                "signUpType": "email",
                "deviceType": "desktop",
                "appVersion": "1",
                "timezone": 'IST'
            };
        }

        else
        {
            var parameters = {
                "firstName": fname,
                "lastName": lname,
                "businessName": business,
                "email": email,
                "phoneNumberPrefix": phone_prefix,
                "phoneNumber": Number(phone),
                "signUpType": "fb",
                "password": pass,
                "deviceType": "desktop",
                "appVersion": "1",
                "timezone": 'IST',
                "fbId":fbId,
                "fbAccessToken": fbAccessToken,
                "fbImageLink": fbImagePath
            };
        }

        console.log(parameters);


        $http.post(CONSTANT.SPApiURL + '/api/sp/signup', parameters)
            .success(function (data, status) {
                callback(status);
            })
            .error(function (data, status) {
                callback(status);
            });


    };

    this.addProfession = function (sp_id, sp_acess_token, profession_id, sub_id, travelPreference, desc, location_type, location_array, callback) {
        var parameters;
        if (location_type == 'ZIPCODE') {
            parameters = {
                "spId": sp_id,
                "accessToken": sp_acess_token,
                "professionId": profession_id,
                "subCategoryId": [sub_id],
                "travelPreference": travelPreference,
                "description": desc,
                "servingAreaType": location_type,
                "zipCodes": location_array[0]
            };
        }
        if (location_type == 'TOWN') {
            parameters = {
                "spId": sp_id,
                "accessToken": sp_acess_token,
                "professionId": profession_id,
                "subCategoryId": [sub_id],
                "travelPreference": travelPreference,
                "description": desc,
                "servingAreaType": "TOWN",
                "towns": location_array[0]
            };
        }
        if (location_type == 'RADIUS') {
            parameters = {
                "spId": sp_id,
                "accessToken": sp_acess_token,
                "professionId": profession_id,
                "subCategoryId": [sub_id],
                "travelPreference": travelPreference,
                "description": desc,
                "servingAreaType": location_type,
                "radius": Number(location_array[2]),
                "latitude": Number(location_array[0]),
                "longitude": Number(location_array[1])
            };
        }

        console.log(parameters);

        $http.post(CONSTANT.SPApiURL + '/api/sp/addProfession', parameters)
            .success(function (data, status) {
                callback(status, 'success');
            })
            .error(function (data, status) {
                callback(status, 'error');
            });

    };


    this.showAllProfessions = function (sp_id, sp_access_token, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/showProfessions/' + sp_id + '/' + sp_access_token)
            .success(function (data, status) {
                callback(status, data.data)
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };


    this.showSPProfessions = function (sp_id, sp_access_token, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/professions/' + sp_id + '/' + sp_access_token)
            .success(function (data, status) {
                callback(status, data.data)
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.showProfile = function (sp_id, sp_access_token, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/showProfile/' + sp_id + '/' + sp_access_token, {cache: false})
            .success(function (data, status) {
                callback(status, data.data)
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };


    this.getEngagements = function (sp_id, sp_access_token, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/clientEngagements/' + sp_access_token + '/' + sp_id)
            .success(function (data, status) {
                callback(status, data.data.projectData)
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.getEngagementInfo = function (sp_id, sp_access_token, eng_id, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/engagementInfo/' + sp_access_token + '/' + sp_id + "/" + eng_id)
            .success(function (data, status) {
                callback(status, data.data)
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.showForm = function (sp_id, sp_access_token, project_id, formType, callback) {

        $http.get(CONSTANT.SPApiURL + "/api/sp/showForm/" + sp_id + "/" + sp_access_token + "/" + project_id + "/" + formType)
            .success(function (data, status) {
                callback(status, data.data);
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };


    this.saveFilledForm = function (spId, accessToken, projectId, formType, form, callback) {
        var par;
        if (formType == "PROPOSALFORM") {
            par = {
                "formType": formType,
                "spId": spId,
                "accessToken": accessToken,
                "projectId": projectId,
                "proposalForm": JSON.stringify(form)
            };
        }
        else {
            par = {
                "formType": formType,
                "spId": spId,
                "accessToken": accessToken,
                "projectId": projectId,
                "auctionForm": JSON.stringify(form)
            };
        }

        console.log(par);

        $http.post(CONSTANT.SPApiURL + "/api/sp/saveFilledForm", par)
            .success(function (data, status) {
                callback(status);
            })
            .error(function (data, status) {
                callback(status);
            });
    };

    this.showProjects = function (spId, accessToken, callback) {
        $http.get(CONSTANT.SPApiURL + "/api/sp/showMyProjects/" + spId + "/" + accessToken)
            .success(function (data, status) {
                callback(status, data.data.projectData);
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.showBids = function (spId, accessToken, projectId, callback) {

        $http.get(CONSTANT.SPApiURL + "/api/sp/showBids/" + spId + "/" + accessToken + "/" + projectId)
            .success(function (data, status) {
                callback(status, data.data);
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.addBid = function (spId, accessToken, projectId, bid, callback) {
        var par = {
            "projectId": String(projectId),
            "spId": String(spId),
            "accessToken": String(accessToken),
            "bidAmount": Number(bid)
        };

        $.ajax({
            method: "PUT",
            url: CONSTANT.SPApiURL + "/api/sp/addBid",
            data: par,

            success: function(data, textStatus, xhr) {
                callback("yes");
            },
            error: function(xhr, textStatus) {
                callback("no");
            }});
    };

    this.showThread = function (spId, accessToken, projectId, callback) {
        var par = {"accessToken": accessToken, "spId": spId, "projectId": projectId};

        $http.post(CONSTANT.SPApiURL + '/api/sp/showThread', par)
            .success(function (data, status) {
                callback(status, data.data);
            })
            .error(function (data, status) {
                callback(status, data.message);
            });
    };

    this.getMessage = function (spId, sp_access_token, discussion_id, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/showMessages/' + sp_access_token + "/" + discussion_id + "/" + spId)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.addThread = function (spId, sp_access_token, projectId, custId, name, callback) {
        var parameters = {
            "spId": spId,
            "accessToken": sp_access_token,
            "projectId": projectId,
            "customerId": custId,
            "threadName": name
        };

        $http.post(CONSTANT.SPApiURL + '/api/sp/spCreateDiscussion', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.deleteThread = function (spId, sp_access_token, discussion_id, callback) {

        $http.delete(CONSTANT.SPApiURL + '/api/sp/deleteThread/' + spId + "/" + discussion_id + "/" + sp_access_token)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.sendMessage = function (spId, sp_access_token, discussion_id, message, callback) {
        var parameters = {
            "spId": spId,
            "accessToken": sp_access_token,
            "threadId": discussion_id,
            "messageString": String(message)
        };
        console.log(parameters);
        $http.post(CONSTANT.SPApiURL + '/api/sp/postMessage', parameters)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.forgotPassword = function (email, callback) {
        var parameters = {"email": email};

        $http.post(CONSTANT.SPApiURL + "/api/sp/forgotPassword", parameters)
            .success(function (data, status) {
                callback(status, data.message);
            }).error(function (data, status) {
                callback(status, data.message);
            });
    };

    this.showCustomer = function (spId, sp_access_token, customerId, callback) {
        $http.get(CONSTANT.SPApiURL + '/api/sp/showCustomerProfile/' + spId + "/" + sp_access_token + "/" + customerId)
            .success(function (data, status) {
                callback(status, data.data);
            }).error(function (data, status) {
                callback(status, data.message);
            });
    };


});

angular.module('Frugal').service('AdminService', function ($http, CONSTANT, $cookies, $timeout) {

    this.getAllProfession = function (callback) {
        $http.get(CONSTANT.SPApiURL + '/api/admin/showProfession')
            .success(function (data, status) {
                callback(status, data.data);
            })
            .error(function (data, status) {
                callback(status, 'error');
            });

    };
});

angular.module('Frugal').service('CountryService', function ($http, CONSTANT) {

    this.getAllCountries = function (callback) {
        $http.get(CONSTANT.CountryApiURL + '/api/common/getCountries')
            .success(function (data, status) {
                callback(status, data.data);
            })
            .error(function (data, status) {
                callback(status, 'error');
            });
    };

    this.getStates = function(callback)
    {
        var parameters = {"country_code": CONSTANT.countryCode};

        $http.post(CONSTANT.CountryApiURL+"/api/common/getCountryStates",parameters)
            .success(function(data,status){

                var i;
                var array = [];
                for(i=0;i<data.data.length;i++)
                {
                    array.push(data.data[i].StateName);
                }

                callback(status,array);
            })
            .error(function(status,data){
                callback(status,'error');
            })
    };

    this.getCities = function(stateName,callback)
    {
        var parameters = {"StateName": stateName};

        $http.post(CONSTANT.CountryApiURL+"/api/common/getStateCities",parameters)
            .success(function(data,status){

                var i;
                var array = [];
                for(i=0;i<data.data.length;i++)
                {
                    array.push({"id":i,"cityName":data.data[i].CityName,"ticked":false});
                }

                callback(status,array);
            })
            .error(function(status,data){
                callback(status,'error');
            })
    };

    this.getZipcodes = function(cityName,stateName,callback)
    {
        var parameters = {"CityName":cityName,"StateName": stateName};

        $http.post(CONSTANT.CountryApiURL+"/api/common/getCityZipCodes",parameters)
            .success(function(data,status){

                var i;
                var array = [];
                var zipcodeMap = [];
                for(i=0;i<data.data.length;i++)
                {
                    if(zipcodeMap.indexOf(data.data[i].Pincode)==-1)
                    {
                        array.push({"id":i,"zipcode":data.data[i].Pincode,"ticked":false});
                        zipcodeMap.push(data.data[i].Pincode);
                    }

                }

                callback(status,array);
            })
            .error(function(status,data){
                callback(status,'error');
            })
    };

    this.getLocalities = function(cityName,stateName,callback)
    {
        var parameters = {"CityName":cityName,"StateName": stateName};

        $http.post(CONSTANT.CountryApiURL+"/api/common/getCityZipCodes",parameters)
            .success(function(data,status){

                var i;
                var array = [];
                for(i=0;i<data.data.length;i++)
                {
                    array.push({"id":i,"locality":data.data[i].AreaName,"ticked":false});
                }

                callback(status,array);
            })
            .error(function(status,data){
                callback(status,'error');
            })
    };


});


