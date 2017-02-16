
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
//  , firebase = require('./routes/firebaseConfig')
  , sessionMgmt = require('./routes/sessionMgmt')
  , http = require('http')
  , path = require('path');

var session = require('client-sessions');
var io = require('socket.io');

var app = express();

//all environments
//configure the sessions with our application
app.use(session({   
      
    cookieName        : 'session',    
    secret            : 'cmpe239_test_string',
    secure            : true,    
    duration        : 30 * 60 * 1000,    //setting the time for active session
    activeDuration    : 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.login);
app.get('/login', routes.login);
app.get('/logout', user.logout);
app.get('/register', routes.register);
app.get('/profile', sessionMgmt.restrict, routes.profile);
app.get('/dashboard',  sessionMgmt.restrict, routes.dashboard);
app.get('/stats',  sessionMgmt.restrict, routes.statistics);
app.get('/emergencyContact',  sessionMgmt.restrict, routes.emContact);
app.get('/locMap',  sessionMgmt.restrict, routes.locMap);

app.post('/showProfileDetails', user.showProfileDetails);
app.post('/signInAccount', user.signInAccount);
app.post('/saveProfileDetails', user.saveProfileDetails);
app.post('/getCurrentUserDetails',  sessionMgmt.restrict, user.getCurrentUserDetails);
app.post('/getCurrentUserWithEmergencyContact',  sessionMgmt.restrict, user.getCurrentUserWithEmergencyContact);
app.post('/saveEmergencyContact', sessionMgmt.restrict, user.saveEmergencyContact);
app.post('/saveUserProfile', sessionMgmt.restrict, user.saveUserProfile);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var listener = io.listen(server);

listener.sockets.on('connection', function(socket){ 
	var stepCount = 0;
		//var temp = user.getCurrentUserDashboardDetails();
		if(user.firebase.auth().currentUser){
			var currUserDetails = user.firebase.database().ref('/users/' + user.firebase.auth().currentUser.uid+'/currentState');
			currUserDetails.on('value', function(snapshot) {
				console.log('curr state: '+snapshot.val());
				if(snapshot.val() === 'walk'){
					stepCount++;
				}
				socket.emit('user_current_state', {state: snapshot.val(), steps: stepCount});
			});
			
			//socket.emit('user_classified_data', {steps: noOfPeaks, state_json: state_json});
			
			var state_json = {};
			
			var endDate = new Date().getTime();
			var startDate = new Date().getTime() - 24*60*60*1000;
			var c, magnitudes = [], mean, std, noOfPeaks = 0, i;
			var stats_json = {};
			var total_count = 0;
				   
			user.firebase.database().ref('/users/' + user.firebase.auth().currentUser.uid+'/classifiedData')
				    		.orderByChild('creation_time')
				    		.startAt(startDate)
				    		.endAt(endDate)
				            .on('child_added', function(data) {
				            	var cd = data.val();
				                 //console.log('Object: ', cd);
				            	if(cd !== undefined){
					                 var x = cd.coordinates.x;
					                 var y = cd.coordinates.y;
					                 var z = cd.coordinates.z;
					                 magnitudes.push(user.math.sqrt(user.math.add(x*x, y*y, z*z)));
					                 if(cd.state in state_json){
					                	 var count = state_json[cd.state];
					                	 count++;
					                	 state_json[cd.state] = count;
					                 } else {
					                	 state_json[cd.state] = 1;
					                 }
					                 total_count++;
					                 if(magnitudes.length > 0){
								    	mean = user.math.mean(magnitudes);
									    }
									    for(i = 0; i < magnitudes.length; i++){
									    	magnitudes[i] -= mean;
									    }
									    if(magnitudes.length > 0){
									    	std = user.math.std(magnitudes);
									    }
									    for(i = 0; i < magnitudes.length; i++){
									    	if(magnitudes[i] > std){
									    		noOfPeaks++;
									    	}
									    }
									    state_json.total_count = total_count;
									    socket.emit('user_classified_data', {steps: noOfPeaks, state_json: state_json});
				            	}
				        });
				          
			var currLocDetails = user.firebase.database().ref('/users/' + user.firebase.auth().currentUser.uid +'/currentLocation');
		     
		     currLocDetails.on('value', function(snapshot) {
		       //console.log("Location in app js: " + snapshot.val().lat + " " + snapshot.val().long);
		       socket.emit('user_current_location', snapshot.val());
		     });
		}
		
});
