(function () {

'use strict';
angular.module('tiwUI', ['tiwUI.autocomplete','tiwUI.table']);

angular.module('tiwUI.autocomplete', [])
     .directive('autoComplete', function ($timeout) {
      return function (scope, iElement, iAttrs) {

          scope.$watch(function () {
              return scope.$eval(iAttrs.uiItems);
          }
         ,
             function (data) {

                 angular.element(iElement).removeClass("ui-autocomplete-loading");

                 if (data && data.length) {

                     iElement.autocomplete({
                         source: data,
                         change: function () {
                             angular.element(iElement.attr("idElement", ""));

                             var aux = iElement.autocomplete("option", "source").filter(function (val) { return val.label == iElement.val() });
                             if (aux.length) {
                                 angular.element(iElement.attr("idElement", aux[0].value));
                                 angular.element(iElement.val(aux[0].label));
                                 scope.idElement = aux[0].value;
                             } else {
                                 scope.idElement = 0;
                             }
                         },
                         select: function (event, ui) {
                             event.preventDefault();
                             angular.element(iElement.attr("idElement", ui.item.value));
                             angular.element(iElement.val(ui.item.label));
                             scope.idElement = ui.item.value;
                             if (scope[iElement.attr("ng-model")] !== iElement[0].value) { //fix for IE9
                                 scope[iElement.attr("ng-model")] = iElement[0].value;
                             }

                             angular.element("input:disabled").prop("disabled", false);
                             angular.element(iElement).removeClass("ui-autocomplete-loading");
                             $timeout(function () {
                               //  iElement.trigger('input'); by commenting this avoid the list of results to display after select one of them
                             }, 0);

                         }
                     }).on("autocompletefocus", function () {
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





  angular.module('tiwUI.table',[]);

  angular.module('tiwUI.table').directive('bindHtmlCompile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(function () {
            return scope.$eval(attrs.bindHtmlCompile);
        }, function (value) {
          // In case value is a TrustedValueHolderType, sometimes it
          // needs to be explicitly called into a string in order to
          // get the HTML string.
          element.html(value && value.toString());
          // If scope is provided use it, otherwise use parent scope
          var compileScope = scope;
          if (attrs.bindHtmlScope) {
            compileScope = scope.$eval(attrs.bindHtmlScope);
          }
          $compile(element.contents())(compileScope);
        });
      }
    };
  });




  angular.module('tiwUI.table')
    .directive('tiwTable', tiwTable);


  function tiwTable($sce){
    return {
      template: ['<div class="table-container">',
        '<table class="table table-bordered table-striped">',
        '<thead>',
        '<tr>',
        '<th type="{{h}}" ng-click="order(h)" ng-show="columns.indexOf(h) >= 0" ng-repeat="h in header">{{costumColumnsName[h]}}<span ng-class="{ \'glyphicon-chevron-down\' : {{h+\'Sorting\'}} ,\'glyphicon-chevron-up\' : {{h+\'SortingInverted\'}}  }" class="glyphicon"></span></th>',
        '</tr>',
        '</thead>',
        '<tr  ng-show="($index < (currentPage*docsPerPage)) && ($index >= (currentPage*docsPerPage - docsPerPage)) " ng-repeat="dat in rows | orderBy:predicate:reverse">', // "
        '<td bind-html-compile="dat[col]"  ng-repeat="col in columns" class="table-name-column">{{dat[col]}}</td>', //ng-bind-html allow to insert html content. {{dat[col]}} is the key that allows to get the columns order in regards the array columns provided
        '</tr>',
        '</table>',
        '</div>',
        '<div class="pagination-container">',
        '<ul class="pagination">',
        '<li>',
        '<a ng-click="currentPage = 1" aria-label="First">',
        '<span aria-hidden="true">&laquo;</span>',
        '</a>',
        '</li>',
        '<li>',
        '<a ng-click="(currentPage > 1)&&(currentPage = currentPage-1)" aria-label="Prev">',
        '<span aria-hidden="true">&lt;</span>',
        '</a>',
        '</li>',
        '<li  ng-show="($index < (currentPage + 5)) && ($index >= (currentPage - 5))" ng-repeat="a in TableRange(notPublishedPages) track by $index"><a ng-class="{\'highlighted\': currentPage - 1 == $index }" ng-click="ChangePage($index+1)">{{$index + 1}}</a></li>',
        '<li>',
        '<a ng-click="(currentPage < notPublishedPages) && (currentPage = currentPage+1)" aria-label="Next">',
        '<span aria-hidden="true">&gt;</span>',
        '</a>',
        '</li>',
        '<li>',
        '<a ng-click="currentPage = notPublishedPages" aria-label="Last">',
        '<span aria-hidden="true">&raquo;</span>',
        '</a>',
        '</li>',
        '</ul>',
        '</div>'].join(""),
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs) {
      //this will allow to get the reference to the parent model, it can be provided via an "controller as syntax" such as CtrlMain as main --> main.data, or without the "as syntax" CtrlMain --> data
      var ctrlData = attrs.data;

      //if the data is provided in the page bootstrapping this will construct the table
      scope.$watch(function () {
          return scope.$eval(ctrlData);
      },function (data) {
        if (data) {
          ShowTable(data);
        }
      }, true );

      function ShowTable(data) {

        scope.header = [];
        scope.rows = data;
        scope.predicateList = [];

        if (!scope.currentPage) {
          scope.currentPage = 1;
        } else {
          if ((scope.currentPage > Math.ceil(scope.rows.length / scope.docsPerPage)) && (scope.currentPage > 1)) {
            scope.currentPage = scope.currentPage - 1;
          }
        }

        if (attrs.recordsPerPage) {
          scope.docsPerPage = attrs.recordsPerPage;
        } else {
          scope.docsPerPage = 5;
        }
        //SORTING MODULE
        scope.TableRange = function (n) {
          if (n)
            return new Array(n);
        };

        scope.ChangePage = function (n) {
          scope.currentPage = n;
        };

        scope.order = function (predicate) {
          if (!scope.costumColumnsName[predicate].length) {
            return false;
          }

          if (scope.predicateList.indexOf(predicate) < 0) {
            scope.predicateList.push(predicate);

          }
          angular.forEach(scope.predicateList, function (val) {
            scope[val + "SortingInverted"] = false;
            scope[val + "Sorting"] = false;
          });
          scope.reverse = (scope.predicate === predicate) ? !scope.reverse : false;
          scope.predicate = predicate;

          if (scope.reverse) {
            scope[predicate + "Sorting"] = true;
          } else {
            scope[predicate + "SortingInverted"] = true;
          }

        };
        //END SORTING MODULE

        for (var prop in data[0]) {
          if (prop !== "$$hashKey") {
            scope.header.push(prop);
          }
        }

        scope.costumColumnsName = [];
        if (attrs.costumColumnsNames) {
          attrs.columns.split(",").forEach(function (val, i) {
            scope.costumColumnsName.push([val, attrs.costumColumnsNames.split(",")[i]]);
          });
        } else {
          attrs.columns.split(",").forEach(function (val, i) {
            scope.costumColumnsName.push([val, attrs.columns.split(",")[i]]);
          });
        }

        if (attrs.costumColumns && attrs.costumColumns.length) {
          angular.forEach(angular.fromJson(attrs.costumColumns), function (val) {
            scope.header.push(val.name);

            angular.forEach(scope.rows, function (val1) {

              val1[val.name] = $sce.trustAsHtml(val.template);
            });
          });
        }


        scope.costumColumnsName = {};
        if (attrs.costumColumnsNames) {
          attrs.columns.split(",").forEach(function (val, i) {
            scope.costumColumnsName[val] = attrs.costumColumnsNames.split(",")[i];
          });
        } else {
          attrs.columns.split(",").forEach(function (val, i) {
            scope.costumColumnsName[val] = attrs.columns.split(",")[i];
          });
        }

        scope.columns = attrs.columns.split(",");
        scope.header = scope.columns.concat(scope.header.filter(function (val) {
          return scope.columns.indexOf(val) < 0;
        }));

        scope.notPublishedPages = Math.ceil(scope.rows.length / scope.docsPerPage);


      }
    }
  }


})();
