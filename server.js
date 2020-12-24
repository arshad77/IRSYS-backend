require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const utils = require('./utils');
const mysql = require("mysql")

const app = express();
const port = process.env.PORT || 4000;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "irsystemdb"
});

connection.connect()


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    let token = req.headers['Authorization'];
    if (!token)
        return next();

    token = token.replace('Bearer', '');
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
        if (err) {
            return res.status(401).json({
                error: true,
                message: 'Invalid user token'
            });
        } else {
            req.user = user;
            next();
        }
    });
});


app.post("/users/doctors", function(req, res) {
    const { speciality, apikey } = req.body;
    if (!speciality || !apikey) {
        return res.status(400).json({
            error: true,
            message: 'Credentials missing'
        });
    }
    const keySql = `select * from roles where apikey = '${apikey}'; `
    const docSql = `select * from doctors where speciality = '${speciality}';`
    connection.query(
        keySql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'apikey invalid'
                });
            } else {
                connection.query(
                    docSql,
                    (err, result, feilds) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                error: 'server error'
                            })
                        }

                        if (result.length == 0) {
                            return res.status(401).json({
                                error: true,
                                message: 'NO values found'
                            });
                        } else {
                            res.json(result)
                        }

                    })
            }

        })

})

app.post("/newAppointment", function(req, res) {
    const { appointment, apikey } = req.body;
    if (!appointment || !apikey) {
        return res.status(400).json({
            error: true,
            message: 'Credentials missing'
        });
    }
    if (appointment.specialist == "Physician") {
        appointment.status = 'CONFIRM'
    }
    const keySql = `select * from roles where apikey = '${apikey}'; `
    const aptSql = `insert into appointments(fname,lname,email,phone,date,time,specialist,description,doctor,insurance,status,location,notes)
    values('${appointment.fname}','${appointment.lname}','${appointment.email}','${appointment.phone}','${appointment.date}','${appointment.time}','${appointment.specialist}','${appointment.description}','${appointment.doctor}','${appointment.insurance}','${appointment.status}','${appointment.location}','${appointment.notes}');`
    connection.query(
        keySql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'apikey invalid'
                });
            } else {
                connection.query(
                    aptSql,
                    (err, result, feilds) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                error: 'server error'
                            })
                        }

                        if (result.length == 0) {
                            return res.status(401).json({
                                error: true,
                                message: 'NO values found'
                            });
                        } else {
                            res.json(result)
                        }

                    })
            }

        })

})

app.post("/statusCheck", function(req, res) {
    const { appointment, apikey } = req.body;
    if (!appointment || !apikey) {
        return res.status(400).json({
            error: true,
            message: 'Credentials missing'
        });
    }
    const keySql = `select * from roles where apikey = '${apikey}'; `
    const statSql = `select * from appointments where email = '${appointment.email}' and date = '${appointment.date}';`
    connection.query(
        keySql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'apikey invalid'
                });
            } else {
                connection.query(
                    statSql,
                    (err, result, feilds) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                error: 'server error'
                            })
                        }

                        if (result.length == 0) {
                            return res.status(401).json({
                                error: true,
                                message: 'No appointment request found'
                            });
                        } else {
                            res.json(result)
                        }

                    })
            }

        })

})

app.post('/consult', (req, res) => {
    const { appointment, apikey } = req.body;
    if (!appointment || !apikey) {
        return res.status(400).json({
            error: true,
            message: 'Credentials missing'
        });
    }
    const keySql = `select * from roles where apikey = '${apikey}'; `
    const statSql = `select * from appointments where specialist = '${appointment.specialist}'; `
    connection.query(
        keySql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'apikey invalid'
                });
            } else {
                connection.query(
                    statSql,
                    (err, result, feilds) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                error: 'server error'
                            })
                        }

                        if (result.length == 0) {
                            return res.status(401).json({
                                error: true,
                                message: 'No appointment request found'
                            });
                        } else {
                            res.json(result)
                        }

                    })
            }

        })

})

app.post('/history', (req, res) => {
    const { appointment, apikey } = req.body;
    if (!appointment || !apikey) {
        return res.status(400).json({
            error: true,
            message: 'Credentials missing'
        });
    }
    const keySql = `select * from roles where apikey = '${apikey}'; `
    const statSql = `select * from appointments where fname = '${appointment.fname}' and lname = '${appointment.lname}'and email = '${appointment.email}'; `
    connection.query(
        keySql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'apikey invalid'
                });
            } else {
                connection.query(
                    statSql,
                    (err, result, feilds) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                error: 'server error'
                            })
                        }

                        if (result.length == 0) {
                            return res.status(401).json({
                                error: true,
                                message: 'No appointment request found'
                            });
                        } else {
                            res.json(result)
                        }

                    })
            }

        })

})

app.post('/updateStatus', (req, res) => {
    const { appointment, apikey } = req.body;

    if (!appointment || !apikey) {
        return res.status(400).json({
            error: true,
            message: 'Credentials missing'
        });
    }
    const keySql = `select * from roles where apikey = '${apikey}'; `
    const updSql = `update appointments set status = '${appointment.status}', notes='${appointment.notes}', scan='${appointment.scans}' where aid =${appointment.aid}; `
    connection.query(
        keySql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'apikey invalid'
                });
            } else {
                connection.query(
                    updSql,
                    (err, result, feilds) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                error: 'server error'
                            })
                        }

                        if (result.length == 0) {
                            return res.status(401).json({
                                error: true,
                                message: 'No appointment request found'
                            });
                        } else {
                            res.json(result)
                        }

                    })
            }

        })

})

app.get("/", (req, res) => {
    if (!req.user)
        return res.status(401).json({
            success: false,
            message: 'Invalid user.'
        });
    res.send("Hello There...!" + req.user);
});


app.post("/users/signin", function(req, res) {
    const user = req.body.username;
    const pwd = req.body.password;
    const sql = `select * from roles where rname = '${user}'`;

    if (!user || !pwd) {
        return res.status(401).json({
            error: true,
            message: "Username or password is required"
        });
    }

    connection.query(
        sql,
        (err, result, feilds) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'server error'
                })
            }

            if (result.length == 0) {
                return res.status(401).json({
                    error: true,
                    message: 'user not found'
                });
            } else if (pwd == result[0].password) {
                const token = utils.generateToken(result[0]);
                userObj = result[0]
                userObj.token = token
                return res.json({ user: userObj });
            } else {
                return res.status(401).json({
                    error: true,
                    message: 'password invalid'
                });
            }

        })

});

app.get('/verifyToken', function(req, res) {
    const token = req.query.token || req.body.token;
    if (!token) {
        return res.status(400).json({
            error: true,
            message: 'Token is required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
        if (err)
            return res.status(401).json({
                error: true,
                message: 'Invalid Token'
            });

        if (user.userId !== userData.userId) {
            return res.status(401).json({
                error: true,
                message: 'Invalid user.'
            });
        }

        const userObj = utils.getCleanUser(userData);
        return res.json({ user: userObj, token });
    });
});


app.listen(port, () => {
    console.log('Server started on: ' + port);
});