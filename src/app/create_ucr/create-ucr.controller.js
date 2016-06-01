(function () {
    'use strict';


    angular
       .module('triremeApp')
       .controller('CreateUcrController', CreateUcrController);

    function CreateUcrController($scope, $state, ucrService, umrService, userService,modalFactory) {
        var vm = this;
        vm.UmrList = [];
        vm.UpdateUmr = UpdateUmr;


        vm.ValidateUMR = ValidateUMR;
        vm.ValidateUCR = ValidateUCR;
        vm.Cancel = Cancel;
        vm.CreateUCR = CreateUCR;

        vm.organisation_name = localStorage.getItem("organisation_name");
        vm.tooltip_context = "";
        vm.umrErrorText = "";
        vm.umrValid = true;
        vm.UmrList = [];


        ucrService.GetToolTip("UcrHelp").then(function (response) {
            if (response.data) {
                var text = response.data;
                angular.element("#ucr_help").attr("data-content", text)
                                            .popover({ title: "Help", html: true });
            }
        }, function () {
            angular.element("#ucr_help").attr("data-content", "Unable to retrieve tooltip text.");
        });


        IsUserAllowed();


        function IsUserAllowed() {
            angular.element.loadingLayerTIW();
            userService.IsUserAllowed($state.params.organisation, "CreateUCR").then(function (res) {
                userService.IsUserAllowedPermission = res.data;
                if (res.data) {
                    GetBrokerCodes();
                } else {
                    angular.element.loadingLayerTIW();
                    $state.go("main")
                }

            }, function () {
                angular.element.loadingLayerTIW();
                $state.go("main")
            });
        }


        function GetBrokerCodes() {
            umrService.GetBrokerCode(localStorage.getItem("organisation_name")).then(function (codes) {
                angular.element.loadingLayerTIW();
                if (codes.data) {
                    vm.broker_code_list = codes.data;

                    var main = vm.broker_code_list.filter(function (val) {
                        return val.MainBrokerCode;
                    });

                    if (main) {
                        vm.main_broker_code = main[0].BrokerCode;
                    }
                }

            }, function () {
                angular.element.loadingLayerTIW();
            });
        }

        function UpdateUmr() {
            umrService.SearchUmrFolder(vm.organisation_name, vm.umr, 10)
             .then(function (data) {

                 vm.UmrList = [];

                 angular.forEach(data.data, function (val) {
                     vm.UmrList.push({ "label": val.FolderName, "value": val.FolderNodeId });
                 });

             });
        }

        function ValidateUCR(create) {
            if (vm.claim_reference) {
                if (!create) {
                    angular.element.loadingLayerTIW();
                }
                ucrService.ValidateUCR(localStorage.getItem("organisation_name"), angular.element("#umr").val() + vm.claim_reference).then(function (res) {

                    if (res.data && res.data.IsValid) {
                        if (create) {
                            ProceedCreateUCR();
                        } else {
                          angular.element.loadingLayerTIW();
                        }
                    } else {
                        angular.element.loadingLayerTIW();
                        if (res.data && res.data.FailReason) {

                          modalFactory.showModal("Warning", "<div>" + res.data.FailReason + "</div>");

                        }
                    }
                }, function () {
                  angular.element.loadingLayerTIW();
                  modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
                });
            }
        }

        function ValidateUMR(create) {
            vm.umrValid = false;
            if (angular.element("#umr").val()) {
                angular.element.loadingLayerTIW();

                umrService.CheckValidUmr(localStorage.getItem("organisation_name"), angular.element("#umr").val()).then(function (response) {
                    var res = response.data;
                    if (res) {
                        vm.umrValid = true;
                        if (create) {
                            ValidateUCR(true);
                        } else {
                            angular.element.loadingLayerTIW();
                        }

                    } else {
                        angular.element.loadingLayerTIW();

                        vm.umrErrorText = "UMR is not valid.";

                    }
                }, function () {
                  angular.element.loadingLayerTIW();
                  modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
                });
            }
        }

        function CreateUCR() {
            if (CheckMandatoryFields()) {
                ValidateUMR(true);
            } else {
              modalFactory.showModal("Warning", "<div>Please complete mandatory fields.</div>");
            }
        }

        function ProceedCreateUCR() {
            ucrService.CreateUCR(localStorage.getItem("organisation_name"), angular.element("#umr").attr("idelement"), angular.element("#umr").val() + vm.claim_reference).then(function (response) {

              angular.element.loadingLayerTIW();

              if (response.data == -1) {
                modalFactory.showModal("Warning", "<div>Unable to create ucr. Please contact helpdesk.</div>");
                return false;
              }

              modalFactory.showModal("", "<div>Ucr created successfully with the id : " + response.data + "</div>", function () {
                $state.go("main", { organisation: localStorage.getItem("organisation_name") });
                $scope.$apply();
              });

            }, function () {
              angular.element.loadingLayerTIW();
              modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
            });

        }

        function CheckMandatoryFields() {
            return (vm.claim_reference && angular.element("#umr").val());
        }

        function Cancel() {

            angular.element("#ucr_help").popover("hide");
            $state.go("main", { organisation: localStorage.getItem("organisation_name") });

        }


        angular.element("#umr,#claim_reference").ForceStrictAlphaNumerics();

    }

})();

