/* eslint-disable */


(function () {
    'use strict';

    angular
      .module('triremeApp')
      .service('clientsService', clientsService);

    /** @ngInject */
    function clientsService($http) {
          return {
          SearchClient: function (organisation, queryString, numberOfResults) {
              return $http.get("app/json/clients.json");
              //return $http.post("../../Client/SearchClient", { organisation: organisation, queryString: queryString, numberOfResults: numberOfResults });
          },
          GetClientDetails: function (organisation, clientNodeId) {
               return $http.get("app/json/client_details.json");
              //return $http.post("../../Client/GetClientDetails", { organisation: organisation, clientNodeId: clientNodeId});
          },
          GetClientGroup: function (organisation) {
              return $http.get("app/json/client_group.json");
              //return $http.post("../../Client/GetClientGroups", { organisation: organisation });
          },
          CheckAccCode: function (organisation, clientCode) {
              return $http.get("app/json/bool.json");
              //return $http.post("../../Client/CheckClientCode", { organisation: organisation, clientCode: clientCode });
          },
          CreateClientFolder: function (organisation, clientName, clientCode, groupFolderNodeId, location) {
            return $http.get("app/json/creation_success.json");
              //return $http.post("../../Client/CreateClientFolder", { organisation: organisation, clientName: clientName, clientCode: clientCode, groupFolderNodeId: groupFolderNodeId, location: location });
          },
          getOrganisationTypes : function(){
            return $http.get("app/json/organisations.json");
          }

      }
    }

})();
