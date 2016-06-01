/* eslint-disable */



(function(){

  'use strict';


  angular.module('triremeApp')
    .service('umrService', function ($http) {
      return {
        GetBrokerCode: function (organisation) {
          //return $http.post("../../Process/GetBrokerCode", { organisation: organisation });
          return $http.get("app/json/broker_codes.json");
        },
        ValidateUMR: function (organisation, umr) {
          return $http.get("app/json/bool.json");
          //return $http.post("../../Umr/ValidateUmr", { organisation: organisation, umr: umr });
        },
        CheckValidUmr: function (organisation, umr) {
          //return $http.post("../../Umr/CheckValidUmr", { organisation: organisation, umr: umr });
          return $http.get("app/json/bool.json");
        },
        GetDepCode: function (organisation) {
          //return $http.post("../../Process/GetDepartmentCodes", { organisation: organisation });
          return $http.get("app/json/dep.json")
        },
        GetCOB: function (organisation) {
          //return $http.post("../../Process/GetClassesOfBusiness", { organisation: organisation });
          return $http.get("app/json/cob.json")
        },
        CreateUMR: function (organisation, clientFolderNodeId, clientName, clientCode, location, brokerCode, policyReference,
                             internalPolicyReference, fromQuote, quoteFolderNodeId, riskYear, insuredName, departmentCode,
                             classOfBusiness, lineSlip, bindingAuthority, openMarket) {


          return $http.get("app/json/creation_success.json");

          //return $http.post("../../Umr/CreateUmr", {
          //  organisation: organisation,
          //  clientFolderNodeId: clientFolderNodeId,
          //  clientName: clientName,
          //  clientCode: clientCode,
          //  location: location,
          //  brokerCode: brokerCode,
          //  policyReference: policyReference,
          //  internalPolicyReference: internalPolicyReference,
          //  fromQuote: fromQuote,
          //  quoteFolderNodeId: quoteFolderNodeId,
          //  riskYear: riskYear,
          //  insuredName: insuredName,
          //  departmentCode: departmentCode,
          //  classOfBusiness: classOfBusiness,
          //  lineSlip: lineSlip,
          //  bindingAuthority: bindingAuthority,
          //  openMarket: openMarket
          //});
        },
        SearchUmrFolder: function (organisation, queryString, numberOfResults) {
          return $http.get("app/json/umr.json");
          //return $http.post("../../Umr/SearchUmrFolder", { organisation: organisation, queryString: queryString, numberOfResults: numberOfResults });
        }
      }
    });

})();

