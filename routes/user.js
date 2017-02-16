var firebase = require("firebase");
var math = require("mathjs");
var HashMap = require("hashmap");
math.config({
	  number: 'BigNumber', // Default type of number:
	                       // 'number' (default), 'BigNumber', or 'Fraction'
	  precision: 20        // Number of significant digits for BigNumbers
	});

var config = {
		  apiKey: "AIzaSyDr59x4BllLBI3GueP-rrGTAGqCI-FpiX0",
		  authDomain: "insighters-67d01.firebaseapp.com",
		  databaseURL: "https://insighters-67d01.firebaseio.com/",
		  storageBucket: "insighters-67d01.appspot.com",
		};
firebase.initializeApp(config);

exports.saveProfileDetails = function(req, res) {
	//var email = req.param('email');
	var fName = req.param('fName');
	var lName  = req.param('lName');
	var phone = req.param('phone');
	firebase.database().ref('/users/'+req.session.user.uid+'/profile').set({
		email: req.session.user.email,
	    firstName: fName,
	    lastName: lName,
	    phone: phone
	});
	
	//comment this in production
		  firebase.database().ref('/users/'+req.session.user.uid+'/classifiedData').set([{
			  location: {lat: 37.3352, long: 121.8811},
			  coordinates: {x: 0.06320692449808121, y: 0.08906430220231414, z: 10.255323600769042},
			  creation_time: "02/12/2016 20:09:50",
			  state: "walk"
		  }, {
			  location: {lat: 37.3352, long: 121.8811},
			  coordinates: {x: 0.06320692449808121, y: 0.08906430220231414, z: 10.255323600769042},
			  creation_time: "02/11/2016 20:09:50",
			  state: "walk"
		  }]);
		  firebase.database().ref('/users/'+req.session.user.uid+'/currentState').set("walk");
	res.send({statusCode: 200});
};

exports.showProfileDetails = function(req, res){
	var email = req.param('email');
	var password  = req.param('password');
	console.log("At create account: " + email);
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
			req.session.user = user;
			res.send({statusCode: 200});
		}).catch(function(error) {
		  // Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			res.send({statusCode: 401, error: error});
		  
		});
};

exports.signInAccount = function(req, res){
	var email = req.param('email');
	var password  = req.param('password');
	
	console.log("At sign in: " + email);
	
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
		req.session.user = user;
		res.send({statusCode: 200});
	}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  res.send({statusCode: 401, error: error});
		});
};

//exports.getCurrentUserDetails = function(req, res){
//	//var cuUser = firebase.auth().currentUser;
//	var userId = firebase.auth().currentUser.uid;
//	var state_json = {};
//	firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
//	  var profile = snapshot.val().profile;
//	  req.session.user_profile = snapshot.val().profile;
//	  req.session.user_emergency_contact = snapshot.val().emergencyContact;
//	  console.log(snapshot.val());
//	  	var endDate = new Date().getTime();
//		var startDate = new Date().getTime() - 24*60*60*1000;
//		var c, magnitudes = [], mean, std, noOfPeaks = 0, i;
//		var stats_json = {};
//		var total_count = 0;
//		firebase.database().ref('/users/' + firebase.auth().currentUser.uid).child('classifiedData').on('value', function(cd) {
//		    var cds = cd.val();
//		   
//		    for (c in cds) {
//		    	firebase.database().ref('/users/' + firebase.auth().currentUser.uid).child('classifiedData/'+c)
//		    		.orderByValue()
//		    		.startAt(startDate)
//		    		.endAt(endDate)
//		            .on('child_added', function(sess_data) {
//		                 console.log('Object: ', cds[c]);
//		                 var x = cds[c].coordinates.x;
//		                 var y = cds[c].coordinates.y;
//		                 var z = cds[c].coordinates.z;
//		                 magnitudes.push(math.sqrt(math.add(x*x, y*y, z*z)));
//		                 if(cds[c].state in state_json){
//		                	 var count = state_json[cds[c].state];
//		                	 count++;
//		                	 state_json[cds[c].state] = count;
//		                 } else {
//		                	 state_json[cds[c].state] = 1;
//		                 }
//		                 total_count++;
//		        });
//		    }
//		    if(magnitudes.length > 0){
//		    	mean = math.mean(magnitudes);
//		    }
//		    for(i = 0; i < magnitudes.length; i++){
//		    	magnitudes[i] -= mean;
//		    }
//		    if(magnitudes.length > 0){
//		    	std = math.std(magnitudes);
//		    }
//		    for(i = 0; i < magnitudes.length; i++){
//		    	if(magnitudes[i] > std){
//		    		noOfPeaks++;
//		    	}
//		    }
//		    state_json.total_count = total_count;
//		    res.send({statusCode: 200, user_details: profile, current_state: snapshot.val().currentState, steps: noOfPeaks, state_json: state_json});
//		});
//	
//	  
//	});
//	
//};

exports.getCurrentUserDetails = function(req, res){
	//var cuUser = firebase.auth().currentUser;
	//var userId = firebase.auth().currentUser.uid;
	var currUserStateDetails = firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/currentState');
	var currUserProfileDetails = firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/profile');
	var currUserEmergencyContactDetails = firebase.database().ref('/users/' + firebase.auth().currentUser.uid+'/emergencyContact');
	currUserStateDetails.on('value', function(snapshot1) {
		console.log('curr1 state: '+snapshot1.val());
		req.session.current_state = snapshot1.val();
		currUserProfileDetails.on('value', function(snapshot2) {
			console.log('curr1 state: '+snapshot2.val());
			req.session.user_profile = snapshot2.val();
			currUserEmergencyContactDetails.on('value', function(snapshot3) {
				console.log('curr1 state: '+snapshot3.val());
				req.session.user_emergency_contact = snapshot3.val();
				res.send({statusCode: 200, user_details: req.session.user_profile, current_state: req.session.current_state});
			});
		});
	});
	
	
	
	
	
//	firebase.database().ref('/users/' + userId+'/profile').on('value', function(snapshot1) {
//		console.log('000000 = '+snapshot1.val().profile);
//		req.session.user_profile = snapshot1.val().profile;
//		
//	});
//	firebase.database().ref('/users/' + userId+'/profile').once('value', function(snapshot1) {
//		req.session.user_profile = snapshot1.val().profile;
//		firebase.database().ref('/users/' + userId+'/emergencyContact').once('value', function(snapshot2) {
//			req.session.user_emergency_contact = snapshot2.val().emergencyContact;
//			firebase.database().ref('/users/' + userId+'/currentState').once('value', function(snapshot3) {
//				req.session.current_state = snapshot3.val().currentState;
//				res.send({statusCode: 200, user_details: req.session.user_profile, current_state: req.session.current_state});
//			});
//		});
//	});
};

exports.getCurrentUserWithEmergencyContact = function(req, res){
	res.send({statusCode: 200, user_profile: req.session.user_profile, emergency_contact: req.session.user_emergency_contact});
};


exports.saveEmergencyContact = function(req, res){
	var updated_emergency_contact = req.param('updated_emergency_contact');
	firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/emergencyContact').set(updated_emergency_contact);
	req.session.user_emergency_contact = updated_emergency_contact;
	res.send({statusCode: 200, emergency_contact: req.session.user_emergency_contact});
};

exports.saveUserProfile = function(req, res){
	var updated_user_profile = req.param('updated_user_profile');
	firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/profile').set(updated_user_profile);
	req.session.user_profile = updated_user_profile;
	res.send({statusCode: 200, user_profile: req.session.user_profile});
};

exports.currentUser = function(){
	return firebase.auth().currentUser;
};

exports.logout = function(req, res){
	firebase.auth().signOut().then(function() {
		  req.session.user = undefined;
		  res.render('login');
		}, function(error) {
			res.send({statusCode: 401, error: error});
		});
	
};

exports.firebase = firebase;
exports.math = math;