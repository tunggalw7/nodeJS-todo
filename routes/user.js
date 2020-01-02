
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var email= post.email;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`email`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + email + "','" + name + "','" + pass + "')";
    console.log('sigunp', sql);
      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};
 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session; 

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
     
      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";                           
      db.query(sql, function(err, results){      
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('index.ejs',{message: message});
         }
                 
      });
   } else {
      res.render('index.ejs',{message: message});
   }
           
};
//-----------------------------------------------dashboard page functionality----------------------------------------------
           
exports.dashboard = function(req, res, next){
           
   var user =  req.session.user,
   userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});    
   });       
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";          
   db.query(sql, function(err, result){  
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};
//---------------------------------TODO-------------------------------------------------------------
exports.todo = function(req, res){

    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
 
    var sql="SELECT * FROM `todo` WHERE `userid`='"+userId+"'";          
    db.query(sql, function(err, result){  
       res.render('todo.ejs',{data:result});
    });
 };

 exports.addtodo = function(req, res){
    message = '';
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }
    if(req.method == "POST"){
       var post  = req.body;
       var userid= userId;
       var todo= post.todo;
 
       var sql = "INSERT INTO `todo`(`userid`,`todo`) VALUES ('" + userid + "','" + todo + "')";
 
       var query = db.query(sql, function(err, result) {
            res.redirect('/home/todo');
       });
 
    } else {
       res.render('todo');
    }
 };

 exports.edittodo = function(req, res){
    message = '';
    console.log('masuk edit',  req.params.id);
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }

    var post  = req.body;
    var edittodo= post.edittodo;

    console.log('masuk edit todo',  post);
    console.log('masuk edit todo',  edittodo);
    var sql = "UPDATE `todo` SET `id` = '" + req.params.id + "' , `todo`='" + edittodo + "'";

    var query = db.query(sql, function(err, result) {
    console.log('masuk edit sukses',  result);
        message = "Succesfully! Your todo has been created.";
        res.redirect('/home/todo');
    });

 };

 exports.deletetodo = function(req, res){
    var userId = req.session.userId;
    if(userId == null){
       res.redirect("/login");
       return;
    }

    var sql="DELETE FROM `todo` WHERE `id`='"+req.params.id+"'";    
    db.query(sql, function(err, result){   
        res.redirect('/home/todo');
    });
 };
