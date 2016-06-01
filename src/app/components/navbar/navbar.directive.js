
(function() {
  'use strict';

  angular
    .module('triremeApp')
    .directive('tiwNavbar', tiwNavbar);

  /** @ngInject */
  function tiwNavbar($rootScope,$state,userService,$log,$document) {
    return {
      restrict: 'E',
      link  : function($scope,$element,$attrs){
        var vm = this;
        var organisation =  ($state.params.organisation ? $state.params.organisation : "");




        vm.showHeader = false;


          userService.IsUserAllowedPermission = !!organisation;
          $log.log("im hitting THIS");
        var deregistrationCallback = $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams){
            localStorage.setItem("organisation_name", toParams.organisation);
          });
        $rootScope.$on('$destroy', deregistrationCallback);

        $document.title = organisation;

        $scope.$watch(
          function () {
            return userService.IsUserAllowedPermission;
          }, function () {
            if(userService.IsUserAllowedPermission && $state.params.organisation) {
              $attrs.$updateClass($state.params.organisation, 'hide'  );
            }
          });
      },
      controller: function(){},
      controllerAs : "nav",
      templateUrl: 'app/components/navbar/navbar.html'
    };
  }
})();
