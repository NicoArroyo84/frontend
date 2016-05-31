(function () {
  'use strict';
  angular
    .module('triremeApp')
    .controller('MainController', MainController);

  function MainController($state, userService) {
    var vm = this;

    vm.GoToCreateQuote = GoToCreateQuote;
    vm.GoToCreateClientFolder = GoToCreateClientFolder;
    vm.GoToArchiveQuote = GoToArchiveQuote;
    vm.GoToCreateUMR = GoToCreateUMR;
    vm.GoToCreateUCR = GoToCreateUCR;

    vm.userPermissions = {};
    vm.IsUserAllowed = true;
    vm.menuCaption = "Option Menu";

    GetAllowedOperations();


    function GetAllowedOperations() {
      $.loadingLayerTIW();
      userService.GetAllowedOperations(localStorage.getItem("organisation_name")).then(function (res) {
        $.loadingLayerTIW();
        vm.userPermissions = res.data;
        userService.IsUserAllowedPermission = vm.userPermissions.IsUserAllowed  && $state.params.organisation;
        if (!userService.IsUserAllowedPermission) {
          vm.menuCaption = "WARNING";
          vm.IsUserAllowed = false;
        }

      }, function (res) {
        $.loadingLayerTIW();
      });
    }


    function GoToCreateQuote() {
      $state.go("create_quote", { organisation: localStorage.getItem("organisation_name") });
    }
    function GoToCreateClientFolder() {
      $state.go("create_client_folder", { organisation: localStorage.getItem("organisation_name") });
    }
    function GoToArchiveQuote() {
      $state.go("archive_quote", { organisation: localStorage.getItem("organisation_name") });
    }
    function GoToCreateUMR() {
      $state.go("create_umr", { organisation: localStorage.getItem("organisation_name") });
    }
    function GoToCreateUCR() {
      $state.go("create_ucr", { organisation: localStorage.getItem("organisation_name") });
    }
  }

})();

