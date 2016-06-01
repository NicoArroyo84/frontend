/* eslint-disable */


(function () {
    'use strict';

    angular.module('triremeApp')
      .service('quoteService', quoteService);

    function quoteService($http) {
        return {

            GetNTUReason: function (organisation) {
                return $http.get("app/json/ntu_reason.json");
                //return $http.post("../../Process/GetNtuReasons", { organisation: organisation });
            },
            IsQuoteReferenceUnique: function (organisation, reference) {
                return $http.get("app/json/true.json");
                //return $http.post("../../Quote/IsQuoteReferenceUnique", { organisation: organisation, reference: reference });
            },
            CreateQuoteResponse: function (organisation, quoteReference, quoteName) {
                return $http.get("app/json/create_quote.json");
                //return $http.post("../../Quote/CreateQuote", { organisation: organisation, quoteReference: quoteReference, quoteName: quoteName });
            },
            CreateQuoteResponseAndArchive: function (organisation, quoteReference, quoteName, idReason) {
                return $http.get("app/json/create_quote.json");
                //return $http.post("../../Quote/CreateQuoteAndArchive", { organisation: organisation, quoteReference: quoteReference, quoteName: quoteName, idReason: idReason });
            },
            SearchQuote: function (organisation, queryString, includeArchived, numberOfResults) {

                //return $http.post("../../Quote/SearchQuote", { organisation: organisation, queryString: queryString, includeArchived: includeArchived, numberOfResults: numberOfResults });
                return $http.get("app/json/search_quote.json");
            },
            QuoteToNTU: function (quoteNodeId, organisation, idReason) {
              return $http.get("app/json/true.json");
              //return $http.post("../../Quote/ArchiveQuote", { quoteNodeId: quoteNodeId, organisation: organisation, idReason: idReason });


            }
        }
    }

})();
