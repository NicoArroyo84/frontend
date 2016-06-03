(function () {

    'use strict';

    angular
       .module('triremeApp')
       .controller('CreateUmrController', CreateUmrController);

    function CreateUmrController($scope, $state, clientsService, umrService, quoteService, userService,modalFactory) {
      var vm = this;

      vm.open_market = true;
      vm.binding_authority = false;
      vm.lineslip = false;
      vm.from_quote = false;
      vm.include_archived = false;
      vm.quote = "";
      vm.insurance_name = "";
      vm.umr_text = "";
      vm.dep_code = "";
      vm.class_buss = "";
      vm.risk_year = "";
      vm.unique_policy_number = "";
      vm.policy_ref = "";

      vm.brokerCodeSelected = "";

      vm.UpdateAutocomplete = UpdateAutocomplete;
      vm.UpdateAutocompleteClient = UpdateAutocompleteClient;
      vm.ValidateUMR = ValidateUMR;
      vm.ResetQuote = ResetQuote;
      vm.CheckQuote = CheckQuote;
      vm.CreateUMR = CreateUMR;
      vm.organisation_name = localStorage.getItem("organisation_name");
      vm.BrokerCodeChanged = BrokerCodeChanged;
      vm.Cancel = Cancel;


      vm.UpdateClientDetails = UpdateClientDetails;
      vm.UpdateUMR = UpdateUMR;


      vm.FormValid = FormValid;

        function FormValid() {
          return ((vm.unique_policy_number) && (vm.unique_policy_number.length != 4)) ||
            ((vm.risk_year) && (vm.risk_year.length != 4)) ||
            !vm.umrValid ||
            (vm.from_quote && !vm.quoteValid) ||
            ((vm.broker_code != vm.main_broker_code) && (!vm.policy_ref)) ||
            !vm.umr_text ||
            (vm.umr_text.length < 5);
        }

        IsUserAllowed();
        function CheckPristine() {
          return $scope.umrForm.quote_reference.$pristine &&
            $scope.umrForm.umr_text.$pristine &&
            $scope.umrForm.insurance_name.$pristine &&
            $scope.umrForm.dep_code.$pristine &&
            $scope.umrForm.class_buss.$pristine &&
            $scope.umrForm.risk_year.$pristine &&
            $scope.umrForm.unique_policy_number.$pristine &&
            $scope.umrForm.policy_ref.$pristine &&
            $scope.umrForm.open_market.$pristine &&
            $scope.umrForm.binding_authority.$pristine &&
            $scope.umrForm.from_quote.$pristine &&
            $scope.umrForm.lineslip.$pristine;
        }

        function BrokerCodeChanged() {

          if (vm.brokerCodeSelected && (!CheckPristine())) {
            modalFactory.showModal("Warning", "All data provided will be reset, do you wish to continue?", function () {

              vm.include_archived = false;

              vm.quote = "";
              $scope.umrForm.quote_reference.$setPristine();

              vm.umr_text = "";
              $scope.umrForm.umr_text.$setPristine();

              vm.insurance_name = "";
              $scope.umrForm.insurance_name.$setPristine();

              vm.dep_code = "";
              $scope.umrForm.dep_code.$setPristine();

              vm.class_buss = "";
              $scope.umrForm.class_buss.$setPristine();

              vm.risk_year = "";
              $scope.umrForm.risk_year.$setPristine();

              vm.unique_policy_number = "";
              $scope.umrForm.unique_policy_number.$setPristine();

              vm.policy_ref = "";
              $scope.umrForm.policy_ref.$setPristine();

              vm.open_market = true;
              $scope.umrForm.open_market.$setPristine();

              vm.binding_authority = false;
              $scope.umrForm.binding_authority.$setPristine();

              vm.lineslip = false;
              $scope.umrForm.open_market.$setPristine();


              vm.from_quote = false;
              $scope.umrForm.from_quote.$setPristine();

              vm.brokerCodeSelected = angular.copy(vm.broker_code);


              $scope.$apply();

            }, true, function () {
              vm.broker_code = angular.copy(vm.brokerCodeSelected);
              $scope.$apply();
            });
          } else {
            vm.brokerCodeSelected = angular.copy(vm.broker_code);
          }
        }

        function IsUserAllowed() {
            angular.element.loadingLayerTIW();
            userService.IsUserAllowed($state.params.organisation, "CreateUMR").then(function (res) {
                userService.IsUserAllowedPermission = res.data;
                if (res.data) {
                    GetDepartmentCodes();
                } else {
                    angular.element.loadingLayerTIW();
                    $state.go("main");
                }

            }, function () {
                angular.element.loadingLayerTIW();
                $state.go("main");
            });
        }

        function ResetQuote() {
            vm.include_archived = false;
            vm.quote = "";
            vm.quoteValid = false;
        }

        function UpdateUMR() {
          if (vm.broker_code == vm.main_broker_code) {

            vm.umr_text = (vm.dep_code ? vm.dep_code : "") +
              ((vm.risk_year && vm.risk_year.length == 4) ? vm.risk_year.substring(2, 4) : "") +
              (vm.unique_policy_number ? vm.unique_policy_number : "");
          }
        }

        function UpdateClientDetails() {

          var hasData;

          if (!angular.element("#client_name").data('ui-autocomplete')) {
            return;
          }

          vm.umrValid = false;
          if (angular.element("#client_name").autocomplete("option", "source")) {

            hasData = angular.element("#client_name")
              .autocomplete("option", "source")
              .filter(function (val) { return val.label == angular.element("#client_name").val() });

            if (hasData && hasData.length) {
              vm.umrValid = true;
              GetClientDetails();
            } else {
              angular.element(".accordion-body").empty();
            }
          }
        }

        function CreateUMR() {
            if (!(vm.broker_code && vm.umr_text)) {
              modalFactory.showModal("Warning", "<div>Please complete mandatory fields.</div>");
              return;
            }

            angular.element.loadingLayerTIW();
            umrService.ValidateUMR(vm.organisation_name, vm.broker_code + vm.umr_text).then(function (res) {
              if (res.data && res.data.IsValid) {
                  ProceedUMRCreation();

              } else if (res.data && res.data.FailReason) {
                angular.element.loadingLayerTIW();
                modalFactory.showModal("Warning", "<div>" + res.data.FailReason + "</div>");
              }

            }, function () {
              angular.element.loadingLayerTIW();
              modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
            });
        }

        //organisation, clientFolderNodeId, clientName, clientCode, location, brokerCode, policyReference,
        //                                     internalPolicyReference, fromQuote, quoteFolderNodeId, riskYear, insuredName, departmentCode, classOfBusiness,
        //                                     lineSlip, bindingAuthority, openMarket


        function ProceedUMRCreation() {
            if (CheckMandatoryFields()) {

                var idQuoteNode = 0;

                if (angular.element("#quote_reference").attr("idelement")) {
                    idQuoteNode = angular.element("#quote_reference").attr("idelement");
                }

                umrService.CreateUMR(vm.organisation_name, angular.element("#client_name").attr("idelement"), angular.element("#ClientName").val(), angular.element("#ClientCode").val(), angular.element("#Location").val(), vm.broker_code,vm.umr_text.toUpperCase(),
                    vm.policy_ref, vm.from_quote, idQuoteNode, vm.risk_year, vm.insurance_name, vm.dep_code, vm.class_buss,
                    vm.lineslip, vm.binding_authority, vm.open_market).then(function (res) {

                      angular.element.loadingLayerTIW();
                      if (res.data && res.data.OperationSuccess) {
                        modalFactory.showModal("", "<div>The UMR was created successfully.<br><br>Press <a target='_blank' href='" + res.data.Url + "'>here</a> to go to the folder or continue to return to the main menu. </div><br>", function () {
                          $state.go("main");
                          $scope.$apply();
                        });

                      } else {
                        if (res.data) {
                          modalFactory.showModal("Warning", "<div>" + res.data.FailReason + "</div>", function () {
                            $state.go("main");
                            $scope.$apply();
                          });
                        }
                      }
                    }, function () {
                        angular.element.loadingLayerTIW();
                    });
            } else {
              angular.element.loadingLayerTIW();
                modalFactory.showModal("Warning", "<div>Please complete mandatory fields.</div>");
            }
        }

        function Cancel() {
            $state.go("main", { organisation: localStorage.getItem("organisation_name") });
        }

        function UpdateAutocompleteClient() {
            clientsService.SearchClient(vm.organisation_name, vm.client_name, 10)
            .then(function (data) {
                vm.clientsList = [];

                angular.forEach(data.data, function (val) {
                    vm.clientsList.push({ "label": val.Name, "value": val.NodeId });
                });
            });
        }

        function UpdateAutocomplete() {
            quoteService.SearchQuote(localStorage.getItem("organisation_name"), vm.quote, vm.include_archived, 10)
            .then(function (data) {
                vm.quotesList = [];
                angular.forEach(data.data, function (val) {
                    vm.quotesList.push({ "label": val.QuoteValue, "value": val.QuoteNodeId });
                });
            });
        }

        function CheckQuote() {
            if (!angular.element("#quote_reference").data('ui-autocomplete')) {
                return;
            }
            vm.quoteValid = false;
            if (angular.element("#quote_reference").autocomplete("option", "source")) {

                var hasData = angular.element("#quote_reference").autocomplete("option", "source")
                  .filter(function (val) { return val.label == angular.element("#quote_reference").val() });

                if (hasData && hasData.length) {
                    vm.quoteValid = true;
                }
            }
        }


        function GetClientDetails() {

            if (!angular.element("#client_name").attr("idelement")) {
                return;
            }
            angular.element.loadingLayerTIW();
            clientsService.GetClientDetails(localStorage.getItem("organisation_name"), angular.element("#client_name").attr("idelement")).then(function (client) {
                var str = "<div>";
                angular.element.loadingLayerTIW();

                if (client.data) {
                    angular.forEach(client.data, function (val, i) {
                        if (val && val.Visible) {
                            if (angular.isNumber(val.Value)) {
                                str += "<div class='form-group'>" +
                                    "<label class='col-xs-3 control-label'>" + val.Label + "</label>" +
                                    "<div class='col-xs-8'>" +
                                         "<input id='" + val.Id + "' readonly='readonly' class='form-control  input-sm' value='" + val.Value + "' />" +
                                  "</div>" +
                              "</div>";
                            } else {
                                if (val.Value) {
                                    str += "<div class='form-group'>" +
                                        "<label class='col-xs-3 control-label'>" + val.Label + "</label>" +
                                        "<div class='col-xs-8'>" +
                                            (val.Value.toLowerCase() == "true" || val.Value.toLowerCase() == "false" ? "<input id='" + i + "' readonly='readonly' type='checkbox' checked='" + (val.Value.toLowerCase() == "true" ? "checked" : "") + "' />" : "<input id='" + val.Id + "' readonly='readonly' class='form-control disabled input-sm' value='" + val.Value + "' />") +
                                      "</div>" +
                                  "</div>";
                                } else {
                                    str += "<div class='form-group'>" +
                                           "<label class='col-xs-3 control-label'>" + val.Label + "</label>" +
                                           "<div class='col-xs-8'>" +
                                                "<input id='" + i + "' readonly='readonly' class='form-control disabled input-sm' value='' />" +
                                         "</div>" +
                                     "</div>";
                                }
                            }
                        }
                    });
                }

                str += "</div>";
                angular.element(".accordion-body").empty().append(str);

            }, function () {
              angular.element.loadingLayerTIW();
              modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
            });
        }

        function GetDepartmentCodes() {
            umrService.GetDepCode(localStorage.getItem("organisation_name")).then(function (dep) {
                if (dep.data) {
                    vm.dep_codes_list = dep.data;
                }
                GetClassOfBussiness();
            }, function () {
              angular.element.loadingLayerTIW();
              modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
            });
        }

        function GetClassOfBussiness() {
            umrService.GetCOB(localStorage.getItem("organisation_name")).then(function (codes) {
                if (codes.data) {
                    vm.class_of_bussiness_list = codes.data;
                    GetBrokerCodes();
                }

            }, function () {
              angular.element.loadingLayerTIW();
              modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
            });
        }


        function GetBrokerCodes() {
            umrService.GetBrokerCode(localStorage.getItem("organisation_name")).then(function (codes) {
                angular.element.loadingLayerTIW();
                if (codes.data) {
                    vm.broker_code_list = codes.data;

                    var main = codes.data.filter(function (val) {
                        return val.MainBrokerCode
                    });

                    if (main) {
                        vm.main_broker_code = main[0].BrokerCode;
                    }
                }

            }, function () {
              angular.element.loadingLayerTIW();
              modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
            });
        }


        function ValidateUMR() {

            if ((vm.broker_code) && (vm.umr_text)) {
                umrService.ValidateUMR(localStorage.getItem("organisation_name"), vm.broker_code + vm.umr_text).then(function (res) {
                    if (!(res.data && res.data.IsValid)) {
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

        function CheckMandatoryFields() {
            var res;
            res = (vm.client_name && vm.broker_code && vm.umr_text && vm.risk_year && vm.dep_code && vm.class_buss && vm.unique_policy_number);
            if (vm.broker_code != vm.main_broker_code) { //policy_ref is mandatory if it is displayed
                res = res && vm.policy_ref;
            }

            //check year
            if (vm.risk_year.length != 4) {
                res = false;
            }
            //check unique policy number
            if (vm.unique_policy_number.length != 4) {
                res = false;
            }

            //check client name
            if (!angular.element("#client_name").attr("idelement")) {
                res = false;
            }

            //check from_quote
            if (vm.from_quote) {
                if (!angular.element("#quote_reference").attr("idelement")) {
                    res = false;
                }
            }

            return res;
        }

      angular.element('#accordion').on('shown.bs.collapse', function () {
        vm.arrow = true;
        $scope.$apply();
      });

      angular.element('#accordion').on('hidden.bs.collapse', function () {
        vm.arrow = false;
        $scope.$apply();

      });

      angular.element("#headingOne").on("click", function (e) {
          if (!angular.element("#client_name").attr("idelement")) {
              e.preventDefault();
              return false;
          }

      });


    }

})();
