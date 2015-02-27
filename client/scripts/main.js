window.name = "NG_DEFER_BOOTSTRAP!";


define([
	'angular',
	'domReady',
	'socketio',
	'bootstrap',
	'jquery',
	'app',
	'include',
	'ngDialog',
	'angular-scroll-glue',
	'angular-sanitize',
	'ng-emoticons'
	],function(angular,domReady,io){
	domReady(function (document) {
			angular.bootstrap(document, ['app']);
        	angular.resumeBootstrap();
		});
});