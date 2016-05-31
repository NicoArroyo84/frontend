'use strict';

angular.module('tiwUI',[]).directive('autoComplete', function ($timeout) {
      return function (scope, iElement, iAttrs) {

          //iElement.autocomplete();
          scope.$watch(function () {
              return scope.$eval(iAttrs.uiItems);
          }
         ,
             function (data) {
                 
                 angular.element(iElement).removeClass("ui-autocomplete-loading");

                 if (data && data.length) {
                     
                     iElement.autocomplete({
                         source: data,
                         change: function (event, ui) {
                             angular.element(iElement.attr("idElement", ""));

                             var aux = iElement.autocomplete("option", "source").filter(function (val, i) { return val.label == iElement.val() });
                             if (aux.length) {
                                 angular.element(iElement.attr("idElement", aux[0].value));
                                 angular.element(iElement.val(aux[0].label));
                                 scope.idElement = aux[0].value;
                             } else {
                                 scope.idElement = 0;
                             }
                         },
                         focus: function (event, ui) {
                            // angular.element(iElement).removeClass("ui-autocomplete-loading");
                         },

                         select: function (event, ui) {
                             event.preventDefault();
                             angular.element(iElement.attr("idElement", ui.item.value));
                             angular.element(iElement.val(ui.item.label));
                             scope.idElement = ui.item.value;
                             if (scope[iElement.attr("ng-model")] !== iElement[0].value) { //fix for IE9
                                 scope[iElement.attr("ng-model")] = iElement[0].value;
                             }

                             $("input:disabled").prop("disabled", false);
                             angular.element(iElement).removeClass("ui-autocomplete-loading");
                             $timeout(function () {
                               //  iElement.trigger('input'); by commenting this avoid the list of results to display after select one of them    
                             }, 0);

                         }
                     }).on("autocompletefocus", function (event) {
                         return false;
                     }).on("keyup", function (event) {
                         if (typeof iElement.data("autocomplete") != "undefined") {
                             iElement.data("autocomplete")._trigger("change");
                         }

                         if ((event.keyCode != 9 && event.keyCode != 16 && event.target.value) || (!event.target.value)) {
                             angular.element(iElement).addClass("ui-autocomplete-loading");
                         }

                         if (event.keyCode == 40 || event.keyCode == 38) {
                             angular.element(iElement).removeClass("ui-autocomplete-loading");
                         }


                     }).on("focusout", function () {
                         angular.element(iElement).removeClass("ui-autocomplete-loading");
                     });

                     iElement.autocomplete("search");
                  
                 }
             }, true
           );
          
      };
  });
