var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var app = express();
const cors=require('cors');
// parse application/x-www-form-urlencoded
app.options('*',cors())
app.use(bodyParser.urlencoded({ extended: false }))
let port =process.env.PORT||5000;

var connection = mysql.createConnection({
    host: "localhost", user: "root", password: '', database: 'ngo_project'
}
);

connection.connect((err) => {
    if (err)
        console.log(err)
    else
        console.log("connection successful")
})


// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.send("Hello world!");
});

//users
app.get('/users/list/', function (req, res) {
    try {
        connection.query('select * from users', (err, result, fields) => {
            console.log(fields);
            if (!err) {
                let users = JSON.parse(JSON.stringify(result))
                res.send({ data: users, status: 200 });
            } else {
                res.send({ data: [], status: 400, message: "error" });
            }
        })
    } catch (err) {
        console.log("inside catch")
        res.status(500).json({ message: err, status: 200 });

    }

});

app.get('/users/:id', function (req, res) {
    try {
        let id = req.params.id;
        connection.query('select * from users where id=?', [id], (err, result, fields) => {
            console.log(err);
            if (!err) {
                let users = JSON.parse(JSON.stringify(result))
                res.send({ data: users, status: 200 });
            } else {
                res.send({ data: [], status: 400, message: err });
            }
        })
    } catch (err) {
        console.log("inside catch")
        res.status(500).json({ message: err, status: 200 });

    }

});

app.post('/users', async (req, res) => {
    let data = req.body;
    if (!(data.hasOwnProperty('name') && data.name != "")) {
        res.send({ "message": "name missing" })
    } else if (!(data.hasOwnProperty('phone') && data.phone != "")) {
        res.send({ "message": "phone number missing" })
    } else if (!(data.hasOwnProperty('address') && data.address != "")) {
        res.send({ "message": "address missing" })
    } else if (!(data.hasOwnProperty('email') && data.email != "")) {
        res.send({ "message": "email id missing" })
    }
    else if (!(data.hasOwnProperty('password') && data.password != "")) {
        res.send({ "message": "enter password" })
    } else {
        console.log(data);
        let password = await bcrypt.hash(data.password, saltRounds)
        console.log("===>passwod", password);
        connection.query('insert into users (name,phone,address,email,password) values (?,?,?,?,?)', [req.body.name, req.body.phone, req.body.address, req.body.email, password], (err, result, fields) => {
            if (result) {
                let users = JSON.parse(JSON.stringify(result))
                res.send({ data: users, status: 200 });
            }
        })
    }
})

app.patch('/users/:id', (req, res) => {
    // let id=JSON.parse(req.query.filter)
    //  id=id.id
    let id = req.params.id;
    // let id=req.query.id;
    console.log("id===>", id)
    let data = req.body
    let find = connection.query('select * from users where id=?', [id], (err, result, fields) => {
        if (result) {
            if (result.length == 0) {
                res.send({ data: "data not found", status: 200 });
            } else {
                if (Object.keys(data).length == 0) {
                    res.send({ data: "parameters are missing", status: 200 });
                } else if (data.hasOwnProperty('name')) {
                    if (data.name == '') {
                        res.send({ data: "name can not be blank", status: 200 });
                    }

                    else {
                        connection.query('update users set name=? where id=?', [data.name, id], (err, result, fields) => {
                            if (result) {
                                let users = JSON.parse(JSON.stringify(result))
                                res.send({ data: users, status: 200 });
                            }
                        })
                    }
                } else if ((data.hasOwnProperty('phone'))) {
                    if (data.phone == '') {
                        res.send({ data: "phone number can not be blank", status: 200 });
                    }
                    else {
                        connection.query('update users set phone=? where id=?', [data.phone, id], (err, result, fields) => {
                            if (result) {
                                let users = JSON.parse(JSON.stringify(result))
                                res.send({ data: users, status: 200 });
                            }
                        })
                    }
                }
                else if ((data.hasOwnProperty('address'))) {
                    if (data.address == '') {
                        res.send({ data: "address number can not be blank", status: 200 });
                    }
                    else {
                        connection.query('update users set address=? where id=?', [data.address, id], (err, result, fields) => {
                            if (result) {
                                let users = JSON.parse(JSON.stringify(result))
                                res.send({ data: users, status: 200 });
                            }
                        })
                    }
                }
                else if ((data.hasOwnProperty('email'))) {
                    if (data.email == '') {
                        res.send({ data: "email number can not be blanck", status: 200 });
                    }
                    else {
                        connection.query('update users set email=? where id=?', [data.email, id], (err, result, fields) => {
                            if (result) {
                                let users = JSON.parse(JSON.stringify(result))
                                res.send({ data: users, status: 200 });
                            }
                        })
                    }
                }
            }

        } else {
            res.send({ data: "data not found", status: 200 });
        }
    })



})

app.delete('/users/:id', (req, res) => {
    console.log("in dalate")
    let id = req.params.id;
    connection.query('select * from users where id=?', [id], (err, result, fields) => {
        if (result) {
            connection.query('delete from users where id=?', [id], (err, result, fields) => {
                if (result) {
                    res.send({ data: result, status: 200 });
                }
            })
        } else {
            res.send({ data: "data not found", status: 200 });
        }
    })
})
//payments
app.get('/payment/list', function (req, res) {
    try {
        connection.query('select * from payment', (err, result, fields) => {
            console.log(result);
            if (result) {
                let payment = JSON.parse(JSON.stringify(result))
                res.send({ data: payment, status: 200 });
            } else {
                res.send({ data: [], status: 200 });
            }
        })
    } catch (err) {
        console.log("inside catch")
        res.status(500).json({ message: err, status: 200 });

    }

});

app.get('/payment/:id', function (req, res) {
    try {
        let id = req.params.id;
        connection.query('select * from payment where id=?', [id], (err, result, fields) => {
            console.log(id);
            if (result) {
                let payment = JSON.parse(JSON.stringify(result))
                res.send({ data: payment, status: 200 });
            } else {
                res.send({ data: [], status: 200 });
            }
        })
    } catch (err) {
        console.log("inside catch")
        res.status(500).json({ message: err, status: 200 });

    }

});

//insert
app.post('/payment', (req, res) => {
    let data = req.body;
    if (!(data.hasOwnProperty('userid') && data.userid != "")) {
        res.send({ "message": "enter user id" })
    } else if (!(data.hasOwnProperty('date') && data.date != "")) {
        res.send({ "message": "date missing" })
    } else if (!(data.hasOwnProperty('amount') && data.amount != "")) {
        res.send({ "message": "amount missing" })
    } else if (!(data.hasOwnProperty('paymentMethod') && data.paymentMethod != "")) {
        res.send({ "message": "enter payment mathod" })
    } else {
        connection.query('select * from users where id=?', [data.userid], (err, result, fields) => {
            console.log("=================>>>", result);
            if (result.length > 0) {
                connection.query('insert into payment (userid,date,amount,paymentMethod) values (?,?,?,?)', [req.body.userid, req.body.date, req.body.amount, req.body.paymentMethod], (err, result, fields) => {
                    if (result) {
                        let payment = JSON.parse(JSON.stringify(result))
                        res.send({ data: payment, status: 200 });
                    }
                })
            } else {
                res.send({ message: "user id not found" });
            }
        })

    }
})
//detete
app.delete('/payment/:id', (req, res) => {
    let id = req.params.id;
    connection.query('select * from payment where id=?', [id], (err, result, fields) => {
        if (result) {
            connection.query('delete from payment where id=?', [id], (err, result, fields) => {
                if (result) {
                    res.send({ data: result, status: 200 });
                }
            })
        } else {
            res.send({ data: "data not found", status: 200 });
        }
    })
})
//update
app.patch('/payment/:id', (req, res) => {
    let id = req.params.id;
    let data = req.body
    let find = connection.query('select * from payment where id=?', [id], (err, result, fields) => {
        if (result) {
            if (result.length == 0) {
                res.send({ data: "data not found", status: 200 });
            } else {
                if (Object.keys(data).length == 0) {
                    res.send({ data: "parameters are missing", status: 200 });
                } else if (data.hasOwnProperty('userid')) {
                    if (data.userid == '') {
                        res.send({ data: "user id can not be blank", status: 200 });
                    }

                    else {
                        connection.query('update payment set userid=? where id=?', [data.userid, id], (err, result, fields) => {
                            if (result) {
                                let payment = JSON.parse(JSON.stringify(result))
                                res.send({ data: payment, status: 200 });
                            }
                        })
                    }
                } else if ((data.hasOwnProperty('date'))) {
                    if (data.date == '') {
                        res.send({ data: "date can not be blank", status: 200 });
                    }
                    else {
                        connection.query('update payment set date=? where id=?', [data.date, id], (err, result, fields) => {
                            if (result) {
                                let payment = JSON.parse(JSON.stringify(result))
                                res.send({ data: payment, status: 200 });
                            }
                        })
                    }
                }
                else if ((data.hasOwnProperty('amount'))) {
                    if (data.amount == '') {
                        res.send({ data: "amount can not be blank", status: 200 });
                    }
                    else {
                        connection.query('update payment set amount=? where id=?', [data.amount, id], (err, result, fields) => {
                            if (result) {
                                let payment = JSON.parse(JSON.stringify(result))
                                res.send({ data: payment, status: 200 });
                            }
                        })
                    }
                }
                else if ((data.hasOwnProperty('paymentMethod'))) {
                    if (data.paymentMethod == '') {
                        res.send({ data: "paymentMethod number can not be blanck", status: 200 });
                    }
                    else {
                        connection.query('update payment set paymentMethod=? where id=?', [data.paymentMethod, id], (err, result, fields) => {
                            if (result) {
                                let payment = JSON.parse(JSON.stringify(result))
                                res.send({ data: payment, status: 200 });
                            }
                        })
                    }
                }
            }

        } else {
            res.send({ data: "data not found", status: 200 });
        }
    })



})

app.post('/login', async (req, res) => {
    let data = req.body;
    if (!(data.hasOwnProperty('username') && data.username != "")) {
        res.send({ "message": "enter user name" })
    }
    else if(!(data.hasOwnProperty('password') && data.password != "")){
        res.send({ "message": "enter password" })
    }
    else{
    connection.query('select * from users where email=?', [data.username], async function (err, result, fields) {
        if (err) {
            res.status(400).json({ message: "login unsuccesssful!", success: false, status: 400 })
        } else if (result.length > 0) {
            result = JSON.parse(JSON.stringify(result))
            console.log(result)
            let login = await bcrypt.compare(data.password, result[0].password)
            console.log("===============>>", login);
            if (login)
                res.send({ message: "login successsful!", success: login, status: 200 })
            else
                res.status(400).json({ message: "login unsuccesssful!", success: login, status: 400 })
        } else {
            res.status(400).json({ message: "login unsuccesssful!", success: false, status: 400 })
        }
    })
    }
})

app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
});