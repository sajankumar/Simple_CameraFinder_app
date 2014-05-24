var myapp = angular.module('myapp',['ngRoute']);

myapp.config(function($routeProvider){
	 $routeProvider.
	 when('/campage',{
		 //templateUrl:'pages/home.html',
		 //controller :'campagecontroller'
	 }).otherwise({redirectTo:'/'});
	
	  
	
});



myapp.factory('myappfactory',function($rootScope,$http){

     var cameras      = [];
     var flickerkey   = "put your flickr api key here";
     var cambrandname = "nikon";  
     var camobj       = {};
     
     var factories    = 
     {
      
                     getData         : function(){return cameras;},  
                     setCameraBrand  : function(brandname){cambrandname = brandname;}, 
                     getCamBrandName : function(){return cambrandname;},
                     updateCameras   : function(name){
                     
		      var path = "https://api.flickr.com/services/rest/?method=flickr.cameras.getBrandModels&brand="+ name+"&format=json&nojsoncallback=1&api_key="+flickerkey;
		      
		       $http({method:'GET',url:path}).success(function(data, status, headers, config){
     
		                //console.log(data + " " + status + " " + headers + " " + config + " success")
				        cambrandname = data.cameras.brand;
				        cameras      = data.cameras.camera;
				        $rootScope.$emit('data_recieved');
		               // console.log( cameras);
		     }).error(function(data, status, headers, config){
		        alert("something went wrong,  Unable to fetch data from flicker service.")
		             //console.log(data + " " + status + " " + headers + " " + config + " error")
		      });
		  },
	    
	      setCurrentCamData 		: function(data){ camobj = data; $rootScope.$emit('camobj_data'); },
	      getRootScope 				: function(){ return $rootScope;},
	      getCurrentCamData			: function() { return camobj;}      
    }
     
         
     factories.updateCameras(cambrandname);
     return factories;
});






myapp.controller('first', function($rootScope,$scope, myappfactory){
    myappfactory.getRootScope().$on('data_recieved',function(){
	         $scope.cameras = myappfactory.getData();    
    });

    $scope.search = function()
    {

        if($scope.name != undefined) myappfactory.setCameraBrand($scope.name);
        
        myappfactory.updateCameras(myappfactory.getCamBrandName());
    }
      
    $scope.setData = function(value){ myappfactory.setCurrentCamData(value.cam); }
    
    
});


myapp.controller('campagecontroller', function($scope, myappfactory){
	
	myappfactory.getRootScope().$on('camobj_data',function(){
	  //console.log(myappfactory.getCurrentCamData().details.memory_type._content)
	  
	     $scope.camname 		= myappfactory.getCurrentCamData().name._content;
	     $scope.megapixels 		= "Megapixels : " + myappfactory.getCurrentCamData().details.megapixels._content;
	     $scope.lcd_screen_size = "Lcd_screen_size : " + myappfactory.getCurrentCamData().details.lcd_screen_size._content; 
	     $scope.memory_type 	= "Memory_type : " + myappfactory.getCurrentCamData().details.memory_type._content; 
	     $scope.small           = myappfactory.getCurrentCamData().images.small._content; 
	    // $scope.large           = myappfactory.getCurrentCamData().images.large._content; 
		//$scope.camname = data.name._content;
		//console.log($scope.large)
	})
    
})

