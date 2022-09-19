//Bring in the express server and create application
let express = require('express')
let app = express();
let studentRepo = require('./repos/studentRepo');
let errorHelper = require('./helpers/errorHelpers');
let mysqlConnection = require('./database');
let randomToken = require('./random');
let addUs = require('./userCreation');


let router = express.Router();
 

app.use(express.json());



//Mysql GET Method
router.get('/', function (req, res, next) {
  studentRepo.get(function (data) {
    res.status(200).json({
      "status": 200,
      "statusText": "OK",
      "message": "All students retrieved.",
      "data": data
    });
  }, function (err) {
    next(err);
  });
});

//MYSQL GET by ID method
router.get('/:id', function (req, res, next) {
  studentRepo.getByid(req.params.id, function (data) {
    if (data) {
      res.status(200).json({
       
        "data": data
       
      });
    }
    else {
      res.status(404).send({
        "status": 404,
        "statusText": "Not Found",
        "message": "The student '" + req.params.id + "' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The student '" + req.params.id + "' could not be found."
        }
      });
    }
  }, function (err) {
    next(err);
  });
}); 


  // Create GET/search?id=n&name=str to search for students by 'id' and/or 'name'
  router.get('/search', function (req, res, next) {
    let searchObject = {
      "id": req.query.id,
      "name": req.query.name
    };
  
    studentRepo.search(searchObject, function (data) {
      res.status(200).json({
        "data": data
      });
    }, function (err) {
      next(err);
    });
  });

 //POST METHOD mysql  
router.post('/',  (req, res) => {

  const { password, name, last_name, email} = req.body;

  var username = addUs(name, last_name);
  var token = randomToken(8);

  const query = 'INSERT INTO alumnos_login (username, password, name, last_name, token, email) VALUES (?, ?, ?, ?, ?, ?);';
 
  mysqlConnection.query(query, [username, password, name, last_name, token, email], (err, data, fields) => {
      if(!err){
        "token " + token
        res.status(201).json({
          "status": 201, 
          "statusText": "Created",
          "message": "New User Added",
          "token": token,
          "data": data 
          
          
        })
        
      }
        else {
          reject(err);
        }

  });
});


//PUT Mysql
router.put('/:id', (req, res) => {
  const { password } = req.body;
  const { username } = req.body;

  const query = 'CALL umg_test.AlumnoPut(?,?);';

  console.log(password);
  console.log(username);
  console.log(req.body);
  console.log(query);
  mysqlConnection.query(query, [username, password ], (err, rows, fields) => {
    if(!err) {
      console.log(query);
      
      res.json({ status: 'Student Updated'});
    } 
    else {
      console.log(err);
     
    }

  });
});






//DELETE Method
router.delete('/:id', function(req, res, next) {
studentRepo.getByid(req.params.id, function(data) {
  if (data) {
    
    studentRepo.delete(req.params.id, function(data) {
      res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "The Student '" + req.params.id +"' was successfully deleted successfully",
        "data": "Student '" + req.params.id +"'deleted."
      })
    })
  }
  
  else {
    res.status(404).json({
      "status": 404,
      "statusText": "Not Found",
      "message": "The Student '" + req.params.id +"' could not be found.",
      "error": {
        "code": "NOT_FOUND",
        "message": "The Student '" + req.params.id +"' could not be found."
                        }
                      }); 
      }

}, function (err) {
  next(err);
});

});

//Patch Method
router.patch('/:id', function (req, res) {
  studentRepo.getByid(req.params.id, function (data) {
    if (data) {
      
      studentRepo.update(req.body, req.params.id, function (data){
        res.status(200).json({
        "status": 200,
        "statusText": "OK",
        "message": "Student '" + req.params.id +"' Patched.",
        "data": data 
        })
      })
    }
    else {
      res.status(404).json({
        "status": 404,
        "statusText": "Not Found",
        "message": "The Student '" + req.params.id +"' could not be found.",
        "error": {
          "code": "NOT_FOUND",
          "message": "The Student '" + req.params.id +"' could not be found."
        }})
      }
  })
})


//configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

app.use(errorHelper.logErrors);
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);


//Configure exception middleware last

app.use(function(err, req, res, next) {
  res.status(500).json(errorBuilder(err));
});


let port = 5000;
var server = app.listen(port, function() {  
    console.log('Node Server is running on http://localhost:'+ port);
});


