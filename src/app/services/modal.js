/* eslint-disable */

(function(){

  'use strict';

  angular
    .module('triremeApp')
    .factory('modalFactory', modalFactory);

  function modalFactory(){
    return {
      showModal: function (header,msg,fn) {
        angular.element.modalTIW({
          headerText: header,
          bodyText:angular.element("<div>" + msg + "</div>"),
          style: "tiw",
          acceptButton: {
            text: "OK",
            action: function () {
              angular.element(".modal-footer .btn-default").click();
              if(angular.isFunction(fn)){
                fn();
              }
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

