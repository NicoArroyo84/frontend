(function () {

  'use strict';

  angular
    .module('triremeApp')
    .factory('modalFactory', modalFactory);

  function modalFactory() {
    return {
      showModal: function (header, msg, fn, isConfirmModal,fnCloseButton) {

        var strTextAcceptButton = "OK";
        if (angular.isFunction(fn)) {
          strTextAcceptButton = "Continue";
        }

        if (angular.isDefined(isConfirmModal) && isConfirmModal) {
          strTextAcceptButton = "Yes";
        }


        var modal = angular.element.modalTIW({
          headerText: header,
          bodyText: angular.element("<div>" + msg + "</div>"),
          style: "tiw",
          acceptButton: {
            text: strTextAcceptButton,
            action: function () {
              modal.closeModal();
              if (angular.isFunction(fn)) {
                fn();
              }
            }
          },
          closeButton: {
            visible: angular.isDefined(isConfirmModal) && isConfirmModal,
            action: function () {
              if (angular.isFunction(fnCloseButton)) {
                fnCloseButton();
              }
            },
            text: "No"
          }
        });
      }
    }
  }

})();
