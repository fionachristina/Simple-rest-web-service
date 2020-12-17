const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'StudentDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is running at port no : 3000'));


//Get all Student
app.get('/students', (req, res) => {
    mysqlConnection.query('SELECT * FROM Student', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get a Student
app.get('/students/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Student WHERE ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete a Student
app.delete('/students/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Student WHERE ID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});

//Insert a Student
app.post('/students', (req, res) => {
    let emp = req.body;
    var sql = "SET @ID = ?;SET @Name = ?;SET @Address = ?;SET @Adm = ?; \
    CALL StudentAddOrEdit(@ID,@Name,@Address,@Adm);";
    mysqlConnection.query(sql, [emp.ID, emp.Name, emp.Address, emp.Adm], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted Student id : '+element[0].ID);
            });
        else
            console.log(err);
    })
});

//Update a Student
app.put('/students', (req, res) => {
    let emp = req.body;
    var sql = "SET @ID = ?;SET @Name = ?;SET @Address = ?;SET @Adm = ?; \
    CALL StudentAddOrEdit(@ID,@Name,@Address,@Adm);";
    mysqlConnection.query(sql, [emp.ID, emp.Name, emp.Address, emp.Adm], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});
