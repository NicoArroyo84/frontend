(function() {
  'use strict';

  angular
    .module('triremeApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
