var ngApp = angular.module('ngApp', ['mod-header-full']);
if (!ArtJS.cookie.get('toKen')) location.href = '/';
$(function() {
	ArtJS.load(['address'], function () {
		ADDRESS.init({
			parent: $('#addressWarp'),
			activeFn: function (data) {
				console.log(data);
			}
		});
	});
});