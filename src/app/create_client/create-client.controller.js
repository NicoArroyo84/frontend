

(function () {
  'use strict';


  angular
    .module('triremeApp')
    .controller('CreateClientController', CreateClientController);

  function CreateClientController($scope, $state, clientsService, userService,modalFactory) {
    var vm = this;
    //$stateParams.organisation
    vm.accCodeValid = true;

    vm.CheckAccCode = CheckAccCode;
    vm.Cancel = Cancel;
    vm.Finish = Finish;

    vm.OrganisationTypeList = [];
    vm.costumColumns = [{ "name": "col1", "template": "<a ng-click='client.EditOrganisation(dat.Type)'>Edit</a>" }, { "name": "col2", "template": "<a ng-class='{\"disabled\":dat.InUse}' ng-click='client.DeleteOrganisation(dat)'>Delete</a>" }];
    getOrganisationTypes();
    vm.EditOrganisation = function(str){
      modalFactory.showModal("Edit organisation","Edit organisation :  " + str.toUpperCase());
    }

    vm.DeleteOrganisation= function (org) {
      modalFactory.showModal("Warning","Confirm deletion <br><br> ID: " + org.IdOrganisationType + ". Name: " + org.Type.toUpperCase());
    }

    function getOrganisationTypes() {

      clientsService.getOrganisationTypes().then(function (orgs) {
        if (orgs) {
          vm.OrganisationTypeList = orgs.data;
          vm.NotPublishedPages = Math.ceil(orgs.length / vm.DocsPerPage);
        }
      }, function () {
      });
    }

    IsUserAllowed();

    function IsUserAllowed() {
      angular.element.loadingLayerTIW();
      userService.IsUserAllowed($state.params.organisation, "CreateClient").then(function (res) {
        userService.IsUserAllowedPermission = res.data;
        if (res.data) {
          GetClientGroup();
        } else {
          angular.element.loadingLayerTIW();
          $state.go("main");
        }

      }, function () {
        angular.element.loadingLayerTIW();
        $state.go("main");
      });
    }


    function GetClientGroup() {

      clientsService.GetClientGroup(localStorage.getItem("organisation_name")).then(function (list) {
        angular.element.loadingLayerTIW();
        if (list && list.data) {
          vm.clients_list = list.data;
        }
      }, function () {
        angular.element.loadingLayerTIW();
      });
    }

    function CheckAccCode(client_code) {

      if (!vm.client_code) {
        return;
      }

      angular.element.loadingLayerTIW();

      clientsService.CheckAccCode(localStorage.getItem("organisation_name"), client_code).then(function (res) {
        vm.accCodeValid = true;
        angular.element.loadingLayerTIW();
        if (res.data && res.data.FailReason && res.data.DuplicateClientFolderUrl) {
          vm.accCodeValid = false;
          modalFactory.showModal("Warning", "<div>" + res.data.FailReason + "</div><br><a target='_blank' href='" + res.data.DuplicateClientFolderUrl + "'>Please click here to go to the folder.</a>");
        }

      }, function () {
        angular.element.loadingLayerTIW();
        vm.accCodeValid = false;
        modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
      });
    }

    function Cancel() {
      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
    }

    function Finish() {
      if (!(vm.client_group && vm.client_name && vm.client_code)) {
        modalFactory.showModal("Warning", "<div>Please complete all mandatory fields.</div>");
        return;
      }

      CheckAccCodeAndFinish();
    }

    function CheckAccCodeAndFinish() {

      angular.element.loadingLayerTIW();

      clientsService.CheckAccCode(localStorage.getItem("organisation_name"), vm.client_code).then(function (res) {

        if (res.data && res.data.IsValid) {
          CreateClientFolder();
        } else {
          angular.element.loadingLayerTIW();
          if (res.data.FailReason && res.data.DuplicateClientFolderUrl) {
            vm.accCodeValid = false;
            modalFactory.showModal("Warning", "<div>" + res.data.FailReason + "</div><br><a target='_blank' href='" + res.data.DuplicateClientFolderUrl + "'>Please click here to go to the folder.</a>");
          }
        }
      }, function () {
        angular.element.loadingLayerTIW();
        vm.accCodeValid = false;
        modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
      });
    }

    function CreateClientFolder() {
      clientsService.CreateClientFolder(localStorage.getItem("organisation_name"), vm.client_name, vm.client_code, vm.client_group, vm.location).then(function (res) {
        angular.element.loadingLayerTIW();
        if (res.data) {

          if (res.data == -1) {
            modalFactory.showModal("Warning", "<div>Unable to create client folder. Please contact helpdesk.</div>", function () {
              $state.go("main", { organisation: localStorage.getItem("organisation_name") });
              $scope.$apply();
            });

            return false;
          }

          modalFactory.showModal("", "<div>Client Folder created successfully with the id : " + res.data + "</div>", function () {
            $state.go("main", { organisation: localStorage.getItem("organisation_name") });
            $scope.$apply();
          });
        }

      }, function () {
        angular.element.loadingLayerTIW();
        modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
      })
    }

    angular.element("#location").ForceStrictAlpha(true);
    angular.element("#client_code").ForceStrictAlphaNumerics();
    angular.element("#client_name").on("keydown", function (e) {
      if (e.keyCode == 186) {
        e.preventDefault();
      }
    });

  }

})();
