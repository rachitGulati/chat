define(['angular','socketio'],function(angular,io){
  
  angular.module('app').run(function(){
    $('body').addClass('loaded');
  });

angular.module('app').controller('mainController', ['$scope','$rootScope','ngDialog','socket','$http',function ($scope,$rootScope,ngDialog,socket,$http) {
       $scope.profileImage = {
         backgroundImage: 'url(../../images/Male.png)'
      };
       $scope.messages=[];
       $scope.users=[];
       $scope.keyBinded=false;
      $scope.getImageSource=function(gender){
          var val;
          if(gender=="Male"){
            val= "../../images/Male.png";
          }else if(gender=="Female"){
            val="../../images/Female.png";
          }else if(gender=="Anonymous"){
            val="../../images/Anonymous.png";
          }
          return val;
      }
        socket.on('chat message', function(message_body){
        	$scope.messages.push(message_body);
          	
        });

         $scope.formSubmit=function(message,event){
          var user=$rootScope.user;
          var time=new Date().getTime();
          var message_body={'messages':message,"timestamp":time,'check':'1','user':user};
          socket.emit('chat message',message_body);
          $scope.messages.push(message_body);
          $scope.newMessage='';
          event.preventDefault();
        };

     	  $scope.getKey=function(user){
          $scope.keyBinded=true;
          $http.post("/getKey",user).success(function(data){
            $scope.keyBinded=true;
          }).error(function(data){

          });   
        }

			$scope.joinChat=function(user){
        $http.post("/join",user).success(function(data){
            socket.emit('join',user);
            $rootScope.user=user;
            $scope.closeThisDialog("HEllo");
          }).error(function(data, status, headers, config){
              if(status=="401"){
                $scope.invalidKey=true;
              }
          });
			}

		socket.on('userUpdate', function(users){
          $scope.users=users;
          /*$('#users').append($('<li class="others col-sm-8">').text(person.name));*/
        });
          $scope.timestampToDate=function(timestamp){
            var date=new Date(timestamp);
            var hours=date.getHours();
            var minutes=date.getMinutes();
            var seconds=date.getSeconds();
            var ampm = (hours >= 12) ? "PM" : "AM";
            var myTime=hours+":"+minutes+":"+seconds+" "+ampm;
            return myTime;
          };
      	$scope.$watch('user.gender', function(value) {
       		if (typeof value != 'undefined'){
       			if(value=="Male"){
       				$scope.profileImage.backgroundImage='url(../../images/Male.png)';
       			}else if(value=="Female"){
       				$scope.profileImage.backgroundImage='url(../../images/Female.png)';

       			}else {
       				$scope.profileImage.backgroundImage='url(../../images/Anonymous.png)';

       			}
       		}
       		
 		});
        $scope.clickToOpen = function () {
        ngDialog.open(
        	{ 
        		template: '../partials/modal/join.html',
        		className: 'ngdialog-theme-default',
        		controller:'mainController',
        		showClose :false,
        		closeByDocument:false,
        		closeByEscape :false,
        		scope: $scope
        	});

    };
      }]);
});