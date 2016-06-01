/* eslint-disable */



(function(){

  'use strict';

  angular.module('triremeApp')
    .service('ucrService', function ($http) {
      return {


        GetToolTip: function (tooltipLabel) {
          //return $http.post("../../Process/GetTooltipContent", { tooltipLabel: tooltipLabel });
          return $http.get("app/json/tooltip.json");
        },
        ValidateUCR: function (organisation, ucr) {
          //return $http.post("../../Ucr/ValidateUcr", { organisation: organisation, ucr: ucr });
          return $http.get("app/json/bool.json");
        },
        CreateUCR: function (organisation, umrFolderNodeId, ucr) {

          return $http.post("../../Ucr/CreateUcrFolder", { organisation: organisation, umrFolderNodeId: umrFolderNodeId, ucr: ucr });
          //return $http.get("json/bool.json");

        }
      }
    });

})();



