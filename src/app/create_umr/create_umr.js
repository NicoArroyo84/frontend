

(function () {

    'use strict';

    angular
       .module('triremeApp')
       .controller('CreateUmrController', CreateUmrController);

    function CreateUmrController($scope, $state, clientsService, umrService, quoteService, userService) {
        var vm = this;

        vm.open_market = true;
        vm.binding_authority = false;
        vm.lineslip = false;
        vm.from_quote = false;
        vm.include_archived = false;
        vm.quote = "";
        vm.umr_text = "";
        vm.dep_code = "";
        vm.risk_year = "";
        vm.unique_policy_number = "";
        vm.policy_ref = "";
        vm.clientsList = [];


        vm.UpdateAutocomplete = UpdateAutocomplete;
        vm.UpdateAutocompleteClient = UpdateAutocompleteClient;
        vm.ValidateUMR = ValidateUMR;
        vm.ResetQuote = ResetQuote;
        vm.CheckQuote = CheckQuote;
        vm.CreateUMR = CreateUMR;
        vm.organisation_name = localStorage.getItem("organisation_name");

        vm.Cancel = Cancel;

        vm.client_details = "";
        vm.UpdateClientDetails = UpdateClientDetails;
        vm.UpdateUMR = UpdateUMR;


        vm.FormValid = FormValid;

        function FormValid() {
            return ((vm.risk_year) && (vm.risk_year.length != 4))  || !vm.umrValid || (vm.from_quote && !vm.quoteValid) || ((vm.broker_code != vm.main_broker_code) && (!vm.policy_ref));
        }

        IsUserAllowed();


        function IsUserAllowed() {
            $.loadingLayerTIW();
            userService.IsUserAllowed($state.params.organisation, "CreateUMR").then(function (res) {
                userService.IsUserAllowedPermission = res.data;
                if (res.data) {
                    GetDepartmentCodes();
                } else {
                    $.loadingLayerTIW();
                    $state.go("main");
                }

            }, function (res) {
                $.loadingLayerTIW();
                $state.go("main");
            });
        }

        angular.element('#accordion').on('show.bs.collapse', function () {
            //if (angular.element("#client_name").attr("idelement")) {

            //}
            //return false;
        });

        angular.element('#accordion').on('shown.bs.collapse', function () {
            vm.arrow = true;
            $scope.$apply();
        });

        angular.element('#accordion').on('hidden.bs.collapse', function () {
            vm.arrow = false;
            $scope.$apply();

        });


        function ResetQuote() {
            vm.include_archived = false;
            vm.quote = "";
            vm.quoteValid = false;
        }

        function UpdateUMR() {

            vm.umr_text = (vm.dep_code ? vm.dep_code : "") +
                          ((vm.risk_year && vm.risk_year.length == 4) ? vm.risk_year.substring(2, 4) : "") +
                          (vm.unique_policy_number ? vm.unique_policy_number : "");
        }

        //angular.element("#accordion").collapse('hide');
        function UpdateClientDetails() {
            if (!angular.element("#client_name").data('ui-autocomplete')) {
                return false;
            }

            vm.umrValid = false;
            if (angular.element("#client_name").autocomplete("option", "source")) {

                var hasData = angular.element("#client_name").autocomplete("option", "source").filter(function (val, i) { return val.label == angular.element("#client_name").val() });
                if (hasData && hasData.length) {
                    //angular.element("#accordion").collapse('show');
                    vm.umrValid = true;
                    GetClientDetails();

                } else {
                    $(".accordion-body").empty();

                }
            }

        }

        function CreateUMR() {
            if (!(vm.broker_code && vm.umr_text)) {
                $.modalTIW({
                    headerText: "Warning",
                    bodyText: $("<div>Please complete mandatory fields.</div>"),
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

            $.loadingLayerTIW();
            umrService.ValidateUMR(vm.organisation_name, vm.broker_code + vm.umr_text).then(function (res) {
                if (res.data && res.data.IsValid) {
                    ProceedUMRCreation();

                } else if (res.data && res.data.FailReason) {

                    $.loadingLayerTIW();
                    $.modalTIW({
                        headerText: "Warning",
                        bodyText: $("<div>" + res.data.FailReason + "</div>"),
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

        //organisation, clientFolderNodeId, clientName, clientCode, location, brokerCode, policyReference,
        //                                     internalPolicyReference, fromQuote, quoteFolderNodeId, riskYear, insuredName, departmentCode, classOfBusiness,
        //                                     lineSlip, bindingAuthority, openMarket


        function ProceedUMRCreation() {
            if (CheckMandatoryFields()) {

                var quote_reference = "", idQuoteNode = 0;
                if (angular.element("#quote_reference").attr("idelement")) {
                    quote_reference = angular.element("#quote_reference").attr("idelement");
                }
                if (!!angular.element("#quote_reference").attr("idelement")) {
                    idQuoteNode = angular.element("#quote_reference").attr("idelement");
                }

                umrService.CreateUMR(vm.organisation_name, angular.element("#client_name").attr("idelement"), angular.element("#ClientName").val(), angular.element("#ClientCode").val(), angular.element("#Location").val(), vm.broker_code, vm.umr_text,
                    vm.policy_ref, vm.from_quote, idQuoteNode, vm.risk_year, vm.insurance_name, vm.dep_code, vm.class_buss,
                    vm.lineslip, vm.binding_authority, vm.open_market).then(function (res) {

                        $.loadingLayerTIW();
                        if (res.data) {
                            if (res.data == -1) {
                                $.modalTIW({
                                    headerText: "",
                                    bodyText: $("<div>Unable to create umr. Please contact helpdesk.</div>"),
                                    style: "tiw",
                                    acceptButton: {
                                        text: "OK",
                                        action: function () {
                                            $(".modal-footer .btn-default").click();
                                            $state.go("main")
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
                                bodyText: $("<div>Umr created successfully with the id : " + res.data + "</div>"),
                                style: "tiw",
                                acceptButton: {
                                    text: "OK",
                                    action: function () {
                                        $(".modal-footer .btn-default").click();
                                        $state.go("main")
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
                    });
            } else {
                $.loadingLayerTIW();
                $.modalTIW({
                    headerText: "Warning",
                    bodyText: $("<div>Please complete mandatory fields.</div>"),
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

        function Cancel() {

            $state.go("main", { organisation: localStorage.getItem("organisation_name") });
        }

        function UpdateAutocompleteClient() {
            clientsService.SearchClient(vm.organisation_name, vm.client_name, 10)
            .then(function (data) {
                vm.clientsList = [];

                angular.forEach(data.data, function (val, i) {
                    vm.clientsList.push({ "label": val.Name, "value": val.NodeId });
                });

            });
        }

        function UpdateAutocomplete() {
            quoteService.SearchQuote(localStorage.getItem("organisation_name"), vm.quote, vm.include_archived, 10)
            .then(function (data) {
                vm.quotesList = [];

                angular.forEach(data.data, function (val, i) {
                    vm.quotesList.push({ "label": val.QuoteValue, "value": val.QuoteNodeId });
                });


            });
        }

        function CheckQuote() {
            if (!angular.element("#quote_reference").data('ui-autocomplete')) {
                return false;
            }
            vm.quoteValid = false;
            if (angular.element("#quote_reference").autocomplete("option", "source")) {

                var hasData = angular.element("#quote_reference").autocomplete("option", "source").filter(function (val, i) { return val.label == angular.element("#quote_reference").val() });
                if (hasData && hasData.length) {
                    vm.quoteValid = true;

                }
            }
        }


        function GetClientDetails() {

            if (!angular.element("#client_name").attr("idelement")) {
                return false;
            }

            $.loadingLayerTIW();
            clientsService.GetClientDetails(localStorage.getItem("organisation_name"), angular.element("#client_name").attr("idelement")).then(function (client) {
                var str = "<div>";
                $.loadingLayerTIW();

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
                $(".accordion-body").empty().append(str);

            }, function () {
                $.loadingLayerTIW();

            });
        }

        function GetDepartmentCodes() {
            umrService.GetDepCode(localStorage.getItem("organisation_name")).then(function (dep) {
                if (dep.data) {
                    vm.dep_codes_list = dep.data;
                }
                GetClassOfBussiness();
            }, function () {
                $.loadingLayerTIW();
            });
        }

        function GetClassOfBussiness() {
            umrService.GetCOB(localStorage.getItem("organisation_name")).then(function (codes) {
                if (codes.data) {
                    vm.class_of_bussiness_list = codes.data;
                    GetBrokerCodes();
                }

            }, function () {
                $.loadingLayerTIW();
            });
        }


        function GetBrokerCodes() {
            umrService.GetBrokerCode(localStorage.getItem("organisation_name")).then(function (codes) {
                $.loadingLayerTIW();
                if (codes.data) {
                    vm.broker_code_list = codes.data;

                    var main = codes.data.filter(function (val, i) {
                        return val.MainBrokerCode
                    });

                    if (main) {
                        vm.main_broker_code = main[0].BrokerCode;
                    }
                }

            }, function () {
                $.loadingLayerTIW();
            });
        }


        function ValidateUMR() {

            if ((vm.broker_code) && (vm.umr_text)) {
                umrService.ValidateUMR(localStorage.getItem("organisation_name"), vm.broker_code + vm.umr_text).then(function (res) {
                    if (res && res.IsValid) {



                    } else {
                        if (res && res.FailReason) {
                            $.modalTIW({
                                headerText: "Warning",
                                bodyText: $("<div>" + res.FailReason + "</div>"),
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


        angular.element("#headingOne").on("click", function (e) {
            if (!angular.element("#client_name").attr("idelement")) {
                e.preventDefault();
                return false;
            }

        });


    }

})();
