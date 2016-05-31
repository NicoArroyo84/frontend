

(function () {
  'use strict';


  angular
    .module('triremeApp')
    .controller('CreateClientController', CreateClientController);

  function CreateClientController($scope, $state, clientsService, userService, $http,$uibModal,$stateParams) {
    var vm = this;
    //$stateParams.organisation
    vm.accCodeValid = true;

    vm.CheckAccCode = CheckAccCode;
    vm.Cancel = Cancel;
    vm.Finish = Finish;

    vm.test = function () {
      $uibModal.open({
        animation: true,
        templateUrl: 'scripts/directives/modal/modal.html',
        controller: 'ModalInstanceController',
        controllerAs: 'modal'

      });
    }


    IsUserAllowed();

    function IsUserAllowed() {
      $.loadingLayerTIW();
      userService.IsUserAllowed($state.params.organisation, "CreateClient").then(function (res) {
        userService.IsUserAllowedPermission = res.data;
        if (res.data) {
          GetClientGroup();
        } else {
          $.loadingLayerTIW();
          $state.go("main");
        }

      }, function (res) {
        $.loadingLayerTIW();
        $state.go("main");
      });
    }


    function GetClientGroup() {

      clientsService.GetClientGroup(localStorage.getItem("organisation_name")).then(function (list) {
        $.loadingLayerTIW();
        if (list && list.data) {
          vm.clients_list = list.data;
        }
      }, function () {
        $.loadingLayerTIW();
      });
    }

    function CheckAccCode(client_code) {

      if (!vm.client_code) {
        return false;
      }

      $.loadingLayerTIW();

      clientsService.CheckAccCode(localStorage.getItem("organisation_name"), client_code).then(function (res) {
        vm.accCodeValid = true;
        $.loadingLayerTIW();
        if (res.data && res.data.FailReason && res.data.DuplicateClientFolderUrl) {
          vm.accCodeValid = false;
          $.modalTIW({
            headerText: "Warning",
            bodyText: $("<div>" + res.data.FailReason + "</div><br><a target='_blank' href='" + res.data.DuplicateClientFolderUrl + "'>Please click here to go to the folder.</a>"),
            style: "tiw",
            acceptButton: {
              text: "OK",
              action: function () {
                $(".modal-footer .btn-default").click();
              }
            },
            closeButton: {
              visible: false,
              text: "No"
            }
          });
        }


      }, function () {
        $.loadingLayerTIW();
      });
    }


    function Cancel() {


      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
    }


    angular.element("#location").ForceStrictAlpha(true);
    angular.element("#client_code").ForceStrictAlphaNumerics();

    angular.element("#client_name").on("keydown", function (e) {
      if (e.keyCode == 186) {
        e.preventDefault();
        return false;
      }
    });


    function Finish() {
      if (!(vm.client_group && vm.client_name && vm.client_code)) {
        $.modalTIW({
          headerText: "Warning",
          bodyText: $("<div>Please complete all mandatory fields.</div>"),
          style: "tiw",
          acceptButton: {
            text: "OK",
            action: function () {
              $(".modal-footer .btn-default").click();
            }

          },
          closeButton: {
            visible: false,
            text: "No"
          }
        });
        return false;
      }

      CheckAccCodeAndFinish();
    }

    function CheckAccCodeAndFinish() {

      $.loadingLayerTIW();

      clientsService.CheckAccCode(localStorage.getItem("organisation_name"), vm.client_code).then(function (res) {
        if (res.data && res.data.IsValid) {
          CreateClientFolder();
        } else {
          $.loadingLayerTIW();
          if (res && res.data.FailReason && res.data.DuplicateClientFolderUrl) {
            $.modalTIW({
              headerText: "Warning",
              bodyText: $("<div>" + res.data.FailReason + "</div><br><a target='_blank' href='" + res.data.DuplicateClientFolderUrl + "'>Please click here to go to the folder.</a>"),
              style: "tiw",
              acceptButton: {
                text: "OK",
                action: function () {
                  $(".modal-footer .btn-default").click();
                }
              },
              closeButton: {
                visible: false,
                text: "No"
              }
            });

          }
        }


      }, function () {
        $.loadingLayerTIW();
      });
    }

    function CreateClientFolder() {
      clientsService.CreateClientFolder(localStorage.getItem("organisation_name"), vm.client_name, vm.client_code, vm.client_group, vm.location).then(function (res) {
        $.loadingLayerTIW();
        if (res.data) {

          if (res.data == -1) {
            $.modalTIW({
              headerText: "",
              bodyText: $("<div>Unable to create client folder. Please contact helpdesk.</div>"),
              style: "tiw",
              acceptButton: {
                text: "OK",
                action: function () {
                  $(".modal-footer .btn-default").click();
                  $state.go("main");
                  $scope.$apply();
                }

              },
              closeButton: {
                visible: false,
                text: "No"
              }
            });

            return false;
          }

          $.modalTIW({
            headerText: "",
            bodyText: $("<div>Client Folder created successfully with the id : " + res.data + "</div>"),
            style: "tiw",
            acceptButton: {
              text: "OK",
              action: function () {
                $(".modal-footer .btn-default").click();
                $state.go("main");
                $scope.$apply();
              }

            },
            closeButton: {
              visible: false,
              text: "No"
            }
          });
        } else {

        }

      }, function () {
        $.loadingLayerTIW();
      })
    }

  }

})();
