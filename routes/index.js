/*
 * GET home page.
 */


exports.login = function(req, res){
  res.render('login');
};	
	
exports.register = function(req, res){
  res.render('register');
};	

exports.profile = function(req, res){
  res.render('profile');
};

exports.dashboard = function(req, res){
  res.render('dashboard');
};

exports.statistics = function(req, res){
  res.render('statistics');
};

exports.emContact = function(req, res){
  res.render('emergencyContact');
};
	
exports.locMap = function(req, res){
  res.render('locMap');
};		