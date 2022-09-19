const e = require('express');
const { response } = require('express');
let fs = require('fs');
let mysqlConnection = require('../database');


const FILE_NAME = './assets/Students.json';

let StudentRepo = {
    get: function (resolve, reject) 
    {
        mysqlConnection.query('SELECT * FROM umg_test.alumnos_login;', (err,data , fields) => 
        {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    },

    getByid: function (id, resolve, reject) {
        mysqlConnection.query('SELECT * FROM umg_test.alumnos_login WHERE username = ?', [id], (err, data, fields) =>  {
            if (!err) {
               let student =  data.find(p => p.username == id);
               resolve(student);
        }
        else {
            reject(err);
    }
});
},

search: function (searchObject,resolve, reject){
    fs.readFile(FILE_NAME, function (err,data) {
        if (err) {
            reject(err);
        }
        else{
            let Students = JSON.parse(data);
    
            if(searchObject) {


            Students = Students.filter(
                p => (searchObject.id ? p.id == searchObject.id : true) && 
                (searchObject.name ? p.name.toLowerCase().indexOf(searchObject.name.toLowerCase()) >=  0 : true));
            }
            resolve(Students);
        }

    } 
)
},

//Insert Method
insert: function (newData, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
        if (err){
            reject(err);
        }
        else {
           
            let Students = JSON.parse(data);
          
            Students.push(newData);
            fs.writeFile(FILE_NAME, JSON.stringify(Students), function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(newData);
                }

            })
        }

    })
}
,

update: function (newData, id, resolve, reject) {
fs.readFile(FILE_NAME, function (err, data) {
if (err) {
    reject(err);
}
else {
    let Students = JSON.parse(data);
    let Student = Students.find(p => p.id == id);
    if (Student) {
        Object.assign(Student, newData);
        fs.writeFile(FILE_NAME, JSON.stringify(Students), function(err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(newData);
            }
        });
    }
}

});

}
,

//Delete
delete:function(id, resolve, reject) {
    fs.readFile(FILE_NAME, function (err, data) {
        if (err) {
            reject(err);
        }
        else{
            
            let Students = JSON.parse(data);
           
            let index = Students.findIndex(p => p.id == id);
           
            if (index != -1) {
                Students.splice(index, 1);
                fs.writeFile(FILE_NAME, JSON.stringify(Students), function (err){
                    if (err) {
                        reject (err);
                    }
                    else{
                        resolve(index);
                    }
                })
            }
        }
    })

}
};

module.exports = StudentRepo;