var app = angular.module('userDashboard', []);

app.controller('userDashboardCntrl', function($scope, $http, $compile) {
	$scope.profileDetails = true;
	$scope.user_details = {};
	$scope.steps = 0;
	$scope.showProfileDetails = function(){
		$http({
			method : "POST",
			url : '/showProfileDetails',
			data : {
				email: $scope.email,
				password: $scope.password			
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				$scope.profileDetails = false;
			}
			else {
				
			}
				
		}).error(function(error) {
			
		});
	};//end register Account
	
	$scope.saveProfileDetails = function(){
		$http({
			method : "POST",
			url : '/saveProfileDetails',
			data : {
				fName: $scope.fName,
				lName: $scope.lName,
				phone: $scope.phone,
				email: $scope.email		
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				window.location.assign("/dashboard");
			}
			else {
				
			}
				
		}).error(function(error) {
			
		});
	};//end register Account
	
	$scope.signInAccount = function(){
		$http({
			method : "POST",
			url : '/signInAccount',
			data : {
				email: $scope.email,
				password: $scope.password,
				login_method: "google_login"
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				$scope.user = data.user;
				window.location.assign("/dashboard");
			}
			else {
				// TBA
			}
				
		}).error(function(error) {
			
		});
	};//end sign in account
	
	$scope.getCurrentUserDetails = function(){
		$http({
			method : "POST",
			url : '/getCurrentUserDetails',
			data : {
			}
		}).success(function(data1) {
			//checking the response data for statusCode
			if (data1.statusCode === 200) {
				var socket = io.connect();
				var imagePath = "images/stand.gif";
				socket.on('user_data_event', function(data){
				    console.log(data);
				    
				});
				socket.on('user_current_state', function(data){
					$('#currentStateDiv').html(data.state);
					if(data.state === 'walk'){
						$('#stateImage').html('<img src="images/walk2.gif" height="100" width="100">');
						imagePath = "images/walk2.gif";
					} else if(data.state === 'sit'){
						$('#stateImage').html('<img src="images/sit1.gif" height="100" width="100">');
						imagePath = "images/sit1.gif";
					} else if(data.state === 'run'){
						$('#stateImage').html('<img src="images/run.gif" height="100" width="100">');
						imagePath = "images/run.gif";
					} else if(data.state === 'fall'){
						$('#stateImage').html('<img src="images/fall.png" height="100" width="100">');
						imagePath = "images/fall.png";
					} else {
						$('#stateImage').html('<img src="images/stand.gif" height="100" width="100">');
					}
				    console.log(data.state);
				    console.log(data.steps);
				    $scope.steps = data.steps;
				});
				$scope.user_profile = data1.user_details;
				$('#currentStateDiv').html(data1.current_state);
				if(data1.current_state === 'walk'){
					$('#stateImage').html('<img src="images/walk2.gif" height="100" width="100">');
					imagePath = "images/walk2.gif";
				} else if(data1.current_state === 'sit'){
					$('#stateImage').html('<img src="images/sit1.gif" height="100" width="100">');
					imagePath = "images/sit1.gif";
				} else if(data1.current_state === 'run'){
					$('#stateImage').html('<img src="images/run.gif" height="100" width="100">');
					imagePath = "images/run.gif";
				} else if(data1.current_state === 'fall'){
					$('#stateImage').html('<img src="images/fall.png" height="100" width="100">');
					imagePath = "images/fall.png";
				} else {
					$('#stateImage').html('<img src="images/stand.gif" height="100" width="100">');
				}
				socket.on('user_classified_data', function(data){
				
					
					
					var dataProvider = [];
					Object.keys(data.state_json).forEach(function(k) {
						if(k !== 'total_count'){
					    	var temp_json = {};
					    	var per = data.state_json[k] * 100 / data.state_json.total_count;
					    	per = per.toFixed(1);
					    	temp_json.percent = per;
					    	temp_json.state = k.toUpperCase() + " ("+per+"%)";
					    	if(k === 'walk'){
					    		temp_json.color = "#FEC514";
						    	temp_json.image = "images/walk2.gif";
							} else if(k === 'sit'){
								temp_json.color = "#DB4C3C";
						    	temp_json.image = "images/sit1.gif";
							} else if(k === 'run'){
								temp_json.color = "#26C6DA";
						    	temp_json.image = "images/run.gif";
							} else if(k === 'fall'){
								temp_json.color = "#3498DB";
						    	temp_json.image = "images/fall.png";
							} else {
								temp_json.color = "#8E44AD";
						    	temp_json.image = "images/stand.gif";
							}
					    	dataProvider.push(temp_json);
						}
				    });
					//CHARTS
					var chart = AmCharts.makeChart("chartdiv",
							{
							    "type": "serial",
							    "theme": "light",
							    "dataProvider": dataProvider,
							    "valueAxes": [{
							        "maximum": 100,
							        "minimum": 0,
							        "axisAlpha": 0,
							        "dashLength": 4,
							        "position": "left"
							    }],
							    "startDuration": 1,
							    "graphs": [{
							        "balloonText": "<span style='font-size:13px; text-transform: uppercase;'><b>[[category]]</b></span>",
							        "bulletOffset": 10,
							        "bulletSize": 52,
							        "colorField": "color",
							        "cornerRadiusTop": 8,
							        "customBulletField": "image",
							        "fillAlphas": 0.8,
							        "lineAlpha": 0,
							        "type": "column",
							        "valueField": "percent"
							    }],
							    "marginTop": 0,
							    "marginRight": 0,
							    "marginLeft": 0,
							    "marginBottom": 0,
							    "autoMargins": false,
							    "categoryField": "state",
							    "categoryAxis": {
							        "axisAlpha": 0,
							        "gridAlpha": 0,
							        "inside": true,
							        "tickLength": 0
							    },
							    "export": {
							    	"enabled": true
							     }
							});
				});
				
			}
			else {
				// TBA
			}
				
		}).error(function(error) {
			
		});
	};
	
	$scope.getCurrentUserWithEmergencyContact = function(){
		$http({
			method : "POST",
			url : '/getCurrentUserWithEmergencyContact',
			data : {
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				$scope.user_emergency_contact = data.emergency_contact;
				$scope.user_profile = data.user_profile;
			}
			else {
			}
				
		}).error(function(error) {
			
		});
	};
	
	$scope.saveEmergencyContact = function(){
		$http({
			method : "POST",
			url : '/saveEmergencyContact',
			data : {
				updated_emergency_contact: $scope.user_emergency_contact
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				$scope.user_emergency_contact = data.emergency_contact;
				$scope.msg = 'Emergency contact saved successfully!';
			}
			else {
				$scope.msg = 'Emergency contact could not be saved successfully!';
			}
				
		}).error(function(error) {
			
		});
	};
	$scope.saveUserProfile = function(){
		$http({
			method : "POST",
			url : '/saveUserProfile',
			data : {
				updated_user_profile: $scope.user_profile
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				$scope.user_profile = data.user_profile;
				$scope.msg = 'Profile data saved successfully!';
			}
			else {
				$scope.msg = 'Profile data could not be saved successfully!';
			}
				
		}).error(function(error) {
			
		});
	};
	
	/* Start getUserLocationDetails*/
	$scope.getUserLocationDetails = function() {
		/*$http({
			method : "GET",
			url : '/getUserLocationDetails',			
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode === 200) {
				var socket = io.connect();

				socket.on('user_current_location', function(data){
					console.log("Inside socket event: " + data.lat + " " + data.long);
					//console.log("Inside socket event: " + JSON.stringify(data));
					$scope.lt = data.lat;
					$scope.lg = data.long;
				});

				console.log("Inside location success function: " + data.location.lat + " " +  data.location.long);
				//console.log("Inside location success function: " + JSON.stringify(data));
				$scope.lt = data.location.lat;
				$scope.lg = data.location.long;

			}//end if
			else {
				// TBA
			}
				
		}).error(function(error) {
			
		});*/
		var socket = io.connect();

		socket.on('user_current_location', function(data){
			console.log("Inside socket event: " + data.lat + " " + data.long);
			
			$scope.lt = data.lat;
			$scope.lg = data.long;


			// Styles a map in night mode.
		        var map = new google.maps.Map(document.getElementById('map'), {
		          center: {lat: 37.3352, lng: -121.8811},
		          zoom: 12,
		          styles: [
		            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
		            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
		            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
		            {
		              featureType: 'administrative.locality',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#d59563'}]
		            },
		            {
		              featureType: 'poi',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#d59563'}]
		            },
		            {
		              featureType: 'poi.park',
		              elementType: 'geometry',
		              stylers: [{color: '#263c3f'}]
		            },
		            {
		              featureType: 'poi.park',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#6b9a76'}]
		            },
		            {
		              featureType: 'road',
		              elementType: 'geometry',
		              stylers: [{color: '#38414e'}]
		            },
		            {
		              featureType: 'road',
		              elementType: 'geometry.stroke',
		              stylers: [{color: '#212a37'}]
		            },
		            {
		              featureType: 'road',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#9ca5b3'}]
		            },
		            {
		              featureType: 'road.highway',
		              elementType: 'geometry',
		              stylers: [{color: '#746855'}]
		            },
		            {
		              featureType: 'road.highway',
		              elementType: 'geometry.stroke',
		              stylers: [{color: '#1f2835'}]
		            },
		            {
		              featureType: 'road.highway',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#f3d19c'}]
		            },
		            {
		              featureType: 'transit',
		              elementType: 'geometry',
		              stylers: [{color: '#2f3948'}]
		            },
		            {
		              featureType: 'transit.station',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#d59563'}]
		            },
		            {
		              featureType: 'water',
		              elementType: 'geometry',
		              stylers: [{color: '#17263c'}]
		            },
		            {
		              featureType: 'water',
		              elementType: 'labels.text.fill',
		              stylers: [{color: '#515c6d'}]
		            },
		            {
		              featureType: 'water',
		              elementType: 'labels.text.stroke',
		              stylers: [{color: '#17263c'}]
		            }
		          ]
		        });

		        /* Start marker code*/
		        var loc = new google.maps.LatLng(data.lat, data.long);
		  		console.log("Lat: " + data.lat);
		  		console.log("Lng: " + data.long);

	  			var marker = new google.maps.Marker({		
				position : loc,
				map : map,
				animation: google.maps.Animation.DROP,
				icon : {
						url: '/images/foot.png',
						scaledSize: new google.maps.Size(20, 32),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(0, 32)
					}
				});
				marker.setMap(map); 
				/* End marker code */

				/* Start infowindow code*/
				var contentString = '<div id="content" style="width:250px;height:300px;"></div>';

				var infoWindow = new google.maps.InfoWindow({
					content: contentString
				});
				/* End infowindow code*/

				/* Start add infowindow to location */
				google.maps.event.addListener(marker, 'click', (function(marker, infoWindow) {
					return function() {
						var pano = null;
						infoWindow.open(map, marker);
						google.maps.event.addListener(infoWindow, 'domready', function() {
							if (pano != null) {
								pano.unbind("position");
								pano.setVisible(false);
							}
							pano = new google.maps.StreetViewPanorama(document.getElementById("content"), {
								navigationControl: true,
								navigationControlOptions: {
									style: google.maps.NavigationControlStyle.ANDROID
								},
								enableCloseButton: false,
								addressControl: false,
								linksControl: false
							});
							pano.bindTo("position", marker);
							pano.setVisible(true);
						});

						google.maps.event.addListener(infoWindow, 'closeclick', function() {
							pano.unbind("position");
							pano.setVisible(false);
							pano = null;
						});
					};
				})(marker, infoWindow));
				/* End add infowindow to location */

		});

	}; 
	/* End getUserLocationDetails*/
	
});
