
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

        vm.showHeader = false;
        var organisation =  ($state.params.organisation ? $state.params.organisation : "");




          userService.IsUserAllowedPermission = !!organisation;
          $log.log("im hitting THIS");
        $rootScope.$on('$stateChangeSuccess',
          function(event, toState, toParams, fromState, fromParams){
            localStorage.setItem("organisation_name", toParams.organisation);
            console.log(event);
          });


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

      //controller: function($scope,$location, userService,$state,$log){
      //  var vm = this;
      //
      //  vm.showHeader = false;
      //  var organisation = "";
      //
      //  //if ($location.$$search.organisation === localStorage.getItem("organisation_name")) {
      //  //    userService.IsUserAllowedPermission = true;
      //  //}
      //
      //
      //  if ($location.$$search.organisation) {
      //    organisation = $location.$$search.organisation;
      //    localStorage.setItem("organisation_name", organisation);
      //
      //  }
      //  else {
      //    organisation = "";
      //    localStorage.setItem("organisation_name", "");
      //    userService.IsUserAllowedPermission = false;
      //    $log.log("im hitting THIS");
      //  }
      //
      //  document.title = organisation;
      //  vm.organisation_name = organisation;
      //
      //  $scope.$watch(
      //    function () {
      //      return userService.IsUserAllowedPermission;
      //    }, function () {
      //      vm.showHeader = userService.IsUserAllowedPermission;
      //
      //    });
      //
      //},
      controller: function(){},
      controllerAs : "nav",
      templateUrl: 'app/components/navbar/navbar.html'
    };
  }
})();
