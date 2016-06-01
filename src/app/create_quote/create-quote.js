

(function () {
    'use strict';



    angular
       .module('triremeApp')
       .controller('CreateQuoteController', CreateQuoteController);

    function CreateQuoteController($state, $scope, quoteService, userService,modalFactory) {
      var vm = this;


      vm.Cancel = Cancel;
      vm.Finish = Finish;
      vm.UpdateAutocomplete = UpdateAutocomplete;

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
              modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
          });
      }

      function Finish() {

          if ((!((vm.quote_name) && (vm.quote_reference))) || (vm.archived && (!vm.archive_reason))) {

            modalFactory.showModal("Warning", "<div>Please complete all required fields.</div>");
            return;
          }

          angular.element.loadingLayerTIW();
          quoteService.IsQuoteReferenceUnique(localStorage.getItem("organisation_name"),  vm.quote_reference).then(function (res) {
              angular.element.loadingLayerTIW();
              if (res.data) {
                  CreateQuote();
              } else {
                modalFactory.showModal("Warning", "<div>Quote reference already exists for that quote name.</div>");
              }

          }, function () {
            angular.element.loadingLayerTIW();
            modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
          });

      }

      function Cancel() {
          $state.go("main", { organisation: localStorage.getItem("organisation_name") });
      }

      function CreateQuote() {
          angular.element.loadingLayerTIW();
          if (vm.archived) {

              quoteService.CreateQuoteResponseAndArchive(localStorage.getItem("organisation_name"), vm.quote_reference, vm.quote_name, vm.archive_reason).then(function (response) {

                  angular.element.loadingLayerTIW();
                  if (response.data && response.data.OperationSuccess) {
                    modalFactory.showModal("", "<div>Quote created successfully with the id " + response.data.QuoteNodeId + "</div>",function(){
                      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
                      $scope.$apply();
                    });
                  } else {
                    if (response.data) {
                      modalFactory.showModal("Warning", "<div>" + response.data.FailReason + "</div>");
                    }
                  }
              }, function () {
                  angular.element.loadingLayerTIW();
                  modalFactory.showModal("Warning", "<div>An error occurred. Please try again later</div>");
              });

          } else {
              quoteService.CreateQuoteResponse(localStorage.getItem("organisation_name"), vm.quote_reference, vm.quote_name).then(function (response) {

                  angular.element.loadingLayerTIW();
                  if (response.data && response.data.OperationSuccess) {
                    modalFactory.showModal("", "<div>Quote created successfully with the id " + response.data.QuoteNodeId + "</div>", function () {
                      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
                      $scope.$apply();
                    });
                  } else {
                      if (response.data) {
                        modalFactory.showModal("Warning", "<div>" + response.data.FailReason + "</div>");
                      }
                  }
              }, function () {
                  angular.element.loadingLayerTIW();
                  modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
              });
          }
      }


      angular.element("#quote_reference").ForceStrictAlphaNumerics();
      angular.element("#quote_name").ForceStrictAlphaNumerics(true);

    }

})();

