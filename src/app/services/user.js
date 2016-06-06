/* eslint-disable */



(function(){
  'use strict';

  angular.module('triremeApp')
    .service('userService', function ($http) {
      return {
        GetUserOrganisation: function () {
          return $http.get("app/json/bool.json");
          // return $http.post("../../User/GetUserOrganisation");
        },
        GetAllowedOperations: function (organisation) {
          return $http.get("app/json/package.json");
          //return $http.post("../../User/GetAllowedOperations", { organisation: organisation });
        },
        IsUserAllowed: function (organisation, operation) {
          return $http.get("app/json/bool.json");
          //return $http.post("../../User/IsUserAllowed", { organisation: organisation, operation: operation });
        },
        GetOrganisationFolderUrl: function (organisation) {
          return $http.get("app/json/url.json");
          //return $http.post("../../Process/GetOrganisationFolderUrl", { organisation: organisation });
        },
        IsUserAllowedPermission : false
      }
    });
})();
