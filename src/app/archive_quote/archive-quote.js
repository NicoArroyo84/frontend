

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

    IsUserAllowed();


    function IsUserAllowed() {
      $.loadingLayerTIW();
      userService.IsUserAllowed($state.params.organisation, "CreateQuote").then(function (res) {
        userService.IsUserAllowedPermission = res.data;
        if (res.data) {
          GetNTUReasons();
        } else {
          $.loadingLayerTIW();
          $state.go("main");
        }

      }, function (res) {
        $.loadingLayerTIW();
        $state.go("main");
      });
    }



    function GetNTUReasons() {
      quoteService.GetNTUReason(localStorage.getItem("organisation_name")).then(function (reasons) {
          $.loadingLayerTIW();
          if (reasons.data) {
            vm.ntu_reasons = reasons.data;
          }

        },
        function () {
          $.loadingLayerTIW();
        });
    }

    function UpdateAutocomplete() {
      quoteService.SearchQuote(localStorage.getItem("organisation_name"), vm.quote,false,10)
        .then(function (data) {
          vm.quotesList = [];

          angular.forEach(data.data, function (val, i) {
            vm.quotesList.push({ "label": val.QuoteValue, "value": val.QuoteNodeId });
          });


        });
    }

    function Finish() {
      if (!($("#quote_reference").attr("idelement") && vm.archive_reason)) {
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
      $.loadingLayerTIW();
      quoteService.QuoteToNTU($("#quote_reference").attr("idelement"), localStorage.getItem("organisation_name"), vm.archive_reason).then(function (res) {

        $.loadingLayerTIW();
        if (res & res.data) {

          CreationSuccess($("#quote_reference").attr("idelement"));
        } else {
          CreationFailed("error to be expecified");
        }
      }, function () {
        $.loadingLayerTIW();
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


    function Cancel() {
      $state.go("main", { organisation: localStorage.getItem("organisation_name") });
    }

    function CreationFailed(reason) {
      $.modalTIW({
        headerText: "Warning",
        bodyText: $("<div>" + reason + "</div>"),
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

    function CreationSuccess(nodeId) {
      $.modalTIW({
        headerText: "",
        bodyText: $("<div>Quote has been successfully archived.</div>"),
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
    }

  }

})();
