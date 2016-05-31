(function () {
	'use strict';

	angular
	  .module('tiwUI',[])
	  .directive('modalPanel', ModalPanel);

	function ModalPanel($uibModal ,$uibModalInstance) {
		return function (scope, iElement, iAttrs) {
			$uibModal.open({
				animation: true,
				templateUrl: 'FrontEnd/app/scripts/directives/modal/modal.html',
				controller: 'ModalInstanceController',
				controllerAs: 'modal',
				resolve: {
					usersList: function () {
						return vm.usersList;
					}
				}
			});
		}
	}


	angular
  .module('tiwUI', [])
  .controller('ModalInstanceController', ModalInstanceController);
	function ModalInstanceController($scope, $uibModalInstance) {
		var vm = this;
		vm.firstname = "HOLA";
		vm.Cancel = Cancel;
		vm.modalTitle = "Modal Title";
	

		function Cancel() {
			$uibModalInstance.dismiss('cancel');
		}
	}
})();

