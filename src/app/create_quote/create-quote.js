

(function () {
    'use strict';



    angular
       .module('triremeApp')
       .controller('CreateQuoteController', CreateQuoteController);

    function CreateQuoteController($state, $scope, quoteService, userService) {
     var vm = this;
      vm.Cancel = Cancel;
      vm.Finish = Finish;
      vm.UpdateAutocomplete = UpdateAutocomplete;
      angular.element("#quote_reference").ForceStrictAlphaNumerics();
      angular.element("#quote_name").ForceStrictAlphaNumerics(true);
      IsUserAllowed();

      function IsUserAllowed() {
          angular.element.loadingLayerTIW();
          userService.IsUserAllowed($state.params.organisation, "CreateQuote").then(function (res) {
              userService.IsUserAllowedPermission = res.data;
              if (res.data) {
                  GetNTUReasons();
              } else {
                  angular.element.loadingLayerTIW();
                  $state.go("main")
              }

          }, function () {
              angular.element.loadingLayerTIW();
              $state.go("main")
          });
      }


      function UpdateAutocomplete() {
          quoteService.SearchQuote(localStorage.getItem("organisation_name"), vm.quote, false, 10)
          .then(function (data) {
              vm.quotesList = [];

              angular.forEach(data, function (val) {
                  vm.quotesList.push({ "label": val.QuoteValue, "value": val.QuoteNodeId });
              });

              angular.element("#quote_reference").autocomplete("option", "source", vm.quotesList);

          });
      }


      function GetNTUReasons() {
          quoteService.GetNTUReason(localStorage.getItem("organisation_name")).then(function (reasons) {
              angular.element.loadingLayerTIW();
              if (reasons.data) {
                  vm.ntu_reasons = reasons.data;
              }

          },
          function () {
              angular.element.loadingLayerTIW();
          });
      }

      function Finish() {

          if (!((vm.quote_name) && (vm.quote_reference))) {
              angular.element.modalTIW({
                  headerText: "Warning",
                  bodyText: angular.element("<div>Please complete all required fields.</div>"),
                  style: "tiw",
                  acceptButton: {
                      text: "OK",
                      action: function () {
                          angular.element(".modal-footer .btn-default").click();
                      }

                  },
                  closeButton: {
                      visible: false,
                      text: "No"
                  }
              });

              return false;
          }


          if (vm.archived && (!vm.archive_reason)) {
              angular.element.modalTIW({
                  headerText: "Warning",
                  bodyText: angular.element("<div>Please complete all required fields.</div>"),
                  style: "tiw",
                  acceptButton: {
                      text: "OK",
                      action: function () {
                          angular.element(".modal-footer .btn-default").click();
                      }

                  },
                  closeButton: {
                      visible: false,
                      text: "No"
                  }
              });
              return false;
          }

          angular.element.loadingLayerTIW();
          quoteService.IsQuoteReferenceUnique(localStorage.getItem("organisation_name"),  vm.quote_reference).then(function (res) {
              angular.element.loadingLayerTIW();
              if (res) {
                  CreateQuote();


              } else {
                  angular.element.modalTIW({
                      headerText: "Warning",
                      bodyText: angular.element("<div>Quote reference already exists for that quote name.</div>"),
                      style: "tiw",
                      acceptButton: {
                          text: "OK",
                          action: function () {
                              angular.element(".modal-footer .btn-default").click();
                          }

                      },
                      closeButton: {
                          visible: false,
                          text: "No"
                      }
                  });
              }

          }, function () {
              angular.element.loadingLayerTIW();
          });

      }

      function Cancel() {
          $state.go("main", { organisation: localStorage.getItem("organisation_name") });
      }



      function CreateQuote() {
          angular.element.loadingLayerTIW();
          if (vm.archived) {

              quoteService.CreateQuoteResponseAndArchive(localStorage.getItem("organisation_name"), vm.quote_reference, vm.quote_name, vm.archive_reason).then(function (response) {
                  var res = response.data;
                  angular.element.loadingLayerTIW();
                  if (res && res.OperationSuccess) {
                      CreationSuccess(res.QuoteNodeId);
                  } else {
                      if (res) {
                          CreationFailed(res.FailReason);
                      }
                  }
              }, function () {
                  angular.element.loadingLayerTIW();
                  CreationFailed("An error occurred.");
              });

          } else {
              quoteService.CreateQuoteResponse(localStorage.getItem("organisation_name"), vm.quote_reference, vm.quote_name).then(function (response) {
                  var res = response.data;
                  angular.element.loadingLayerTIW();
                  if (res && res.OperationSuccess) {
                      CreationSuccess(res.QuoteNodeId);
                  } else {
                      if (res) {
                          CreationFailed(res.FailReason);
                      }
                  }
              }, function () {
                  angular.element.loadingLayerTIW();
                  CreationFailed("An error occurred.");
              });
          }
      }

      function CreationFailed(reason) {
          angular.element.modalTIW({
              headerText: "Warning",
              bodyText: angular.element("<div>" + reason + "</div>"),
              style: "tiw",
              acceptButton: {
                  text: "OK",
                  action: function () {
                      angular.element(".modal-footer .btn-default").click();
                  }

              },
              closeButton: {
                  visible: false,
                  text: "No"
              }
          });
      }

      function CreationSuccess(nodeId){
          angular.element.modalTIW({
              headerText: "",
              bodyText: angular.element("<div>Quote created successfully with the id " + nodeId + "</div>"),
              style: "tiw",
              acceptButton: {
                  text: "OK",
                  action: function () {
                      angular.element(".modal-footer .btn-default").click();
                      $state.go("main")
                      $scope.$apply();
                  }

              },
              closeButton: {
                  visible: false,
                  text: "No"
              }
          });
      }


    }

})();

