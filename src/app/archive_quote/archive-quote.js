(function () {
  'use strict';


  angular
    .module('triremeApp')
    .controller('ArchiveQuoteController', ArchiveQuoteController);

  function ArchiveQuoteController($scope, $state, quoteService, userService, modalFactory) {
    var vm = this;
    vm.quotesList = [];

    vm.Cancel = Cancel;
    vm.Finish = Finish;
    vm.UpdateAutocomplete = UpdateAutocomplete;

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
          modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
        });
    }


    function UpdateAutocomplete() {

      quoteService.SearchQuote(localStorage.getItem("organisation_name"), vm.quote,false,10)
        .then(function (data) {
          vm.quotesList = [];
          angular.forEach(data.data, function (val) {
            vm.quotesList.push({ "label": val.name, "value": val.nodeId });
            //vm.quotesList.push({ "label": val.QuoteValue, "value": val.QuoteNodeId });
          });
        });
    }

    function Finish() {
      if (!(vm.selectedQuote && vm.archive_reason)) {
        modalFactory.showModal("Warning", "<div>Please complete all mandatory fields.</div>");
        return;
      }

      angular.element.loadingLayerTIW();
      quoteService.QuoteToNTU(vm.selectedQuote, localStorage.getItem("organisation_name"), vm.archive_reason).then(function (res) {

        angular.element.loadingLayerTIW();

        if (res.data) {
          modalFactory.showModal("", "<div>Quote has been successfully archived.</div>", function () {
            $state.go("main", { organisation: localStorage.getItem("organisation_name") });
            $scope.$apply();
          });
        } else {
          modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
        }
      }, function () {
        angular.element.loadingLayerTIW();
        modalFactory.showModal("Warning", "<div>An unexpected error occurred. Please try again later</div>");
      });
    }

    function Cancel() {
      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
    }


  }

})();
