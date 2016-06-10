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
                return $http.post("http://localhost:8000/quotes/save_quote", { organisation: organisation, name: quoteName, reference: quoteReference});
                //return $http.post("../../Quote/CreateQuote", { organisation: organisation, quoteReference: quoteReference, quoteName: quoteName });
            },
            CreateQuoteResponseAndArchive: function (organisation, quoteReference, quoteName, idReason) {
                return $http.post("http://localhost:8000/quotes/save_quote", { organisation: organisation, name: quoteName, reference: quoteReference,ntuReason: idReason});
                //return $http.post("../../Quote/CreateQuoteAndArchive", { organisation: organisation, quoteReference: quoteReference, quoteName: quoteName, idReason: idReason });
            },
            SearchQuote: function (organisation, queryString, includeArchived, numberOfResults) {

                //return $http.post("../../Quote/SearchQuote", { organisation: organisation, queryString: queryString, includeArchived: includeArchived, numberOfResults: numberOfResults });
                //return $http.get("app/json/search_quote.json");
              return $http.get('http://localhost:8000/quotes/search/' + queryString + "/" + organisation + "/" + includeArchived );
            },
            QuoteToNTU: function (quoteNodeId, organisation, idReason) {
              //return $http.get("app/json/true.json");
              return $http.post("http://localhost:8000/quotes/archive_quote", { quoteNodeId: quoteNodeId, organisation: organisation, idReason: idReason });
              //return $http.post("../../Quote/ArchiveQuote", { quoteNodeId: quoteNodeId, organisation: organisation, idReason: idReason });


            },
            getQuotesList: function(organisation) {
              return $http.get('http://localhost:8000/quotes/list/' + organisation );
            },
            deleteQuote : function(quote){
              return $http.post("http://localhost:8000/quotes/delete_quote", {quote : quote});
          }
        }
    }

})();
