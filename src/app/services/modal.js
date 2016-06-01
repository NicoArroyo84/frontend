/* eslint-disable */

(function(){

  'use strict';

  angular
    .module('triremeApp')
    .factory('modalFactory', modalFactory);

  function modalFactory(){
    return {
      showModal: function (header,msg) {
        angular.element.modalTIW({
          headerText: header,
          bodyText:angular.element("<div>" + msg + "</div>"),
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
    }
  }

})();

