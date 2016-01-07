;var modCopy = angular.module('modUserCopyright', []);
modCopy.directive('modcopyright', function () {
	return {
		restrict: 'EA',
		templateUrl: '/module/mod-user-copyright.html',
		transclude: true,
		link: function (scope, http, timeout) {
		}
	}
});