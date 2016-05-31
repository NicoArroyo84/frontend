(function() {
  'use strict';

  angular
    .module('triremeApp')
    .config(routerConfig);


  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("main", {
        url: "/?organisation",
        templateUrl: 'app/main/main.html',
        controller: "MainController",
        controllerAs: "main"
      })
      .state("create_quote", {
        url: "/create_quote?organisation",
        templateUrl: 'app/create_quote/create_quote.html',
        controller: "CreateQuoteController",
        controllerAs: "quote"
      })
      .state("archive_quote", {
        url: "/archive_quote?organisation",
        templateUrl: 'app/archive_quote/archive_quote.html',
        controller: "ArchiveQuoteController",
        controllerAs : "quote"
      })
      .state("create_client_folder", {
        url: "/create_client?organisation",
        templateUrl: 'app/create_client/create_client_folder.html',
        controller: "CreateClientController",
        controllerAs : "client"
      })
      .state("create_umr", {
        url: "/create_umr?organisation",
        templateUrl: 'app/create_umr/create_UMR.html',
        controller: "CreateUmrController",
        controllerAs : "umr"
      })
      .state("create_ucr", {
        url: "/create_ucr?organisation",
        templateUrl: 'app/create_ucr/create_UCR.html',
        controller: "CreateUcrController",
        controllerAs : "ucr"
      });

    $urlRouterProvider.otherwise('/');
  }

})();
