require.config({
  paths:{
    'angular':'../bower_components/angular/angular.min',
    'bootstrap':'../bower_components/bootstrap/dist/js/bootstrap.min',
    'jquery':'../bower_components/jquery/dist/jquery.min',
    'domReady':'../bower_components/requirejs-domready/domReady',
    'socketio': '../socket.io/socket.io',
    'ngDialog':'../bower_components/ngDialog/js/ngDialog',
    'angular-scroll-glue':'../bower_components/angular-scroll-glue/src/scrollglue',
    'angular-sanitize':'../bower_components/angular-sanitize/angular-sanitize',
    'ng-emoticons':'../bower_components/ng-emoticons/src/ng-emoticons',
      

  },
  shim:{
    'angular': {exports: 'angular'},
    'bootstrap':{deps:['jquery']},
    'socketio': {exports: 'io'},
    'ngDialog':{deps:['angular']},
    'angular-scroll-glue':{deps:['angular']},
    'angular-sanitize':{deps:['angular']},
    'ng-emoticons':{deps:['angular','angular-sanitize']}  
  }
});