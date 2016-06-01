

(function () {
  'use strict';


  angular
    .module('triremeApp')
    .controller('ArchiveQuoteController', ArchiveQuoteController);

  function ArchiveQuoteController($scope, $state, quoteService, userService) {
    var vm = this;
    vm.quotesList = [];

    vm.Cancel = Cancel;
    vm.Finish = Finish;
    vm.UpdateAutocomplete = UpdateAutocomplete;
    vm.CheckQuote = CheckQuote;

    angular.element("#quote_reference").ForceStrictAlphaNumerics();

    IsUserAllowed();


    function IsUserAllowed() {
      angular.element.loadingLayerTIW();
      userService.IsUserAllowed($state.params.organisation, "CreateQuote").then(function (res) {
        userService.IsUserAllowedPermission = res.data;
        if (res.data) {
          GetNTUReasons();
        } else {
          angular.element.loadingLayerTIW();
          $state.go("main");
        }

      }, function () {
        angular.element.loadingLayerTIW();
        $state.go("main");
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

    function UpdateAutocomplete() {
      quoteService.SearchQuote(localStorage.getItem("organisation_name"), vm.quote,false,10)
        .then(function (data) {
          vm.quotesList = [];

          angular.forEach(data.data, function (val) {
            vm.quotesList.push({ "label": val.QuoteValue, "value": val.QuoteNodeId });
          });


        });
    }

    function Finish() {
      if (!(angular.element("#quote_reference").attr("idelement") && vm.archive_reason)) {
        angular.element.modalTIW({
          headerText: "Warning",
          bodyText: angular.element("<div>Please complete all mandatory fields.</div>"),
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
      quoteService.QuoteToNTU(angular.element("#quote_reference").attr("idelement"), localStorage.getItem("organisation_name"), vm.archive_reason).then(function (res) {

        angular.element.loadingLayerTIW();
        if (res && res.data) {

          CreationSuccess(angular.element("#quote_reference").attr("idelement"));
        } else {
          CreationFailed("error to be expecified");
        }
      }, function () {
        angular.element.loadingLayerTIW();
      });

    }


    function CheckQuote() {
      if (!angular.element("#quote_reference").data('ui-autocomplete')) {
        return;
      }
      vm.quoteValid = false;
      if (angular.element("#quote_reference").autocomplete("option", "source")) {

        var hasData = angular.element("#quote_reference").autocomplete("option", "source").filter(function (val) { return val.label == angular.element("#quote_reference").val() });
        if (hasData && hasData.length) {
          vm.quoteValid = true;

        }
      }
    }


    function Cancel() {
      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
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

    function CreationSuccess() {
      angular.element.modalTIW({
        headerText: "",
        bodyText: angular.element("<div>Quote has been successfully archived.</div>"),
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
