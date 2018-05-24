angular.module('Frugal').config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/welcomeScreen');
    $urlRouterProvider.when('/CP','/CP/myProjects');
    $urlRouterProvider.when('/SP','/SP/myProjects');

    $stateProvider

        .state('welcomeScreen', {
            url: '/welcomeScreen',
            templateUrl: 'app/welcomeScreen/welcomeScreen.view.html',
            controller : 'welcomeScreenCtrl',
            authentication:'none'
        })

        // CP states

        .state('CP', {
            url: '/CP',
            abstract:true,
            templateUrl: 'app/CP/CP.view.html',
            controller : 'CPCtrl',
            authentication: "CP"
        })
        .state('CP.serviceForm',{
            url: '/serviceForm/{subCatId}',
            templateUrl: 'app/CP/serviceForm/serviceForm.view.html',
            controller : 'serviceFormCtrl',
            authentication: "CP"
        })
        .state('CP.SPsList',{
            url: '/SPsList',
            templateUrl: 'app/CP/SPsList/SPsList.view.html',
            controller : 'SPsListCtrl',
            authentication: "CP"
        })
        .state('CP.SPDetails',{
            url: '/SPDetails/{spId}/{ancestor}',
            templateUrl: 'app/CP/SPDetails/SPDetails.view.html',
            controller : 'SPDetailsCtrl',
            authentication: "CP"
        })
        .state('CP.auctionForm',{
            url: '/auctionForm',
            templateUrl: 'app/CP/auctionForm/auctionForm.view.html',
            controller : 'auctionFormCtrl',
            authentication: "CP"
        })
        .state('CP.myRequests',{
            url: '/myRequests',
            templateUrl: 'app/CP/myRequests/myRequests.view.html',
            controller : 'myRequestsCtrl',
            authentication: "CP"
        })
        .state('CP.myProjects',{
            url: '/myProjects',
            templateUrl: 'app/CP/myProjects/myProjects.view.html',
            controller : 'myProjectsCtrl',
            authentication: "CP"
        })
        .state('CP.viewRequest',{
            url: '/viewRequest/{projectId}',
            templateUrl: 'app/CP/viewRequest/viewRequest.view.html',
            controller : 'viewRequestCtrl',
            authentication: "CP"
        })
        .state('CP.viewEngagement',{
            url: '/viewEngagement/{projectId}/{engId}/{ancestor}',
            templateUrl: 'app/CP/viewEngagement/viewEngagement.view.html',
            controller : 'viewEngagementCtrl',
            authentication: "CP"
        })
        .state('CP.viewProfile',{
            url: '/viewProfile',
            templateUrl: 'app/CP/viewProfile/viewProfile.view.html',
            controller : 'viewProfileCtrl',
            authentication: "CP"
        })

        // SP states

        .state('SP', {
            url: '/SP',
            abstract:true,
            templateUrl: 'app/SP/SP.view.html',
            controller : 'SPCtrl',
            authentication: "SP"
        })
        .state('SP.myServices',{
            url: '/myServices',
            templateUrl: 'app/SP/myServices/myServices.view.html',
            controller : 'myServicesCtrl',
            authentication: "SP"
        })
        .state('SP.addService',{
            url: '/addService',
            templateUrl: 'app/SP/addService/addService.view.html',
            controller : 'addServiceCtrl',
            authentication: "SP"
        })
        .state('SP.myEngagements',{
            url: '/myEngagements',
            templateUrl: 'app/SP/myEngagements/myEngagements.view.html',
            controller : 'myEngagementsCtrl',
            authentication: "SP"
        })
        .state('SP.customerDetails',{
            url: '/customerDetails/{customerId}',
            templateUrl: 'app/SP/customerDetails/customerDetails.view.html',
            controller : 'customerDetailsCtrl',
            authentication: "SP"
        })
        .state('SP.myProjects',{
            url: '/myProjects',
            templateUrl: 'app/SP/myProjects/myProjects.view.html',
            controller : 'myProjectsSPCtrl',
            authentication: "SP"
        })
        .state('SP.viewEngagement',{
            url: '/viewEngagement/{projectId}/{engId}/{ancestor}',
            templateUrl: 'app/SP/viewEngagement/viewEngagement.view.html',
            controller : 'viewEngagementSPCtrl',
            authentication: "SP"
        })
        .state('SP.viewProfile',{
            url: '/viewProfile',
            templateUrl: 'app/SP/viewProfile/viewProfile.view.html',
            controller : 'viewProfileSPCtrl',
            authentication: "SP"
        })

});

angular.module('Frugal').config(function (localStorageServiceProvider){
    localStorageServiceProvider
        .setPrefix('Frugal')
        .setStorageType('localStorage');
});


angular.module('Frugal').config(function($httpProvider){
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.transformRequest = function(data){
        if (data === undefined) {
            return data;
        }
        return $.param(data);
    };
    $httpProvider.defaults.cache= false;
});



