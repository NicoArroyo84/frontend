'use strict';

/**
 * @ngdoc service
 * @name workdirApp.user
 * @description
 * # user
 * Service in the workdirApp.
 */
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
          IsUserAllowedPermission : false
      }
  });
