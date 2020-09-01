const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//const cookie = require('cookie');
const lodash = require("lodash");
const path = require('path');
var serverPath = path.dirname(require.main.filename) + "/server";
const server = require(serverPath);
const fs = require('fs');
const _ = require("underscore");

//mongoose.set('useFindAndModify', false);
//const path = require('path');

//var serverPath = path.dirname(require.main.filename) + "/server";
//const server = require(serverPath);


Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
var today = new Date();
var week = today.getWeek();
console.log(today);

//user signup
exports.user_signup = (req, res, next) => {
  User.find({
      email: req.body.email
    })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              //substring(0, req.body.email.lastIndexOf("@")
              user_name: req.body.username,
              display_name: req.body.username,
              user_aboutme: "Hello, I am your new friend..",
              user_gender: "Female",
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);

                //res.redirect("http://localhost:3000/user/userVerification");
                const url = 'http://localhost:3000/user/userVerification';
                axios.post(url, {
                    "username": req.body.email
                  })
                  .then(response => {
                    console.log("Can axios Post");
                  })
                  .catch(error => {
                    console.log("Cant Axios Post");
                  });
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

//for verification of user user_verification
exports.user_verification = (req, res, next) => {
  loginName = User.findOne({
    email: req.body.username
  });
  //console.log(loginName);
  if (req.body.username.includes('.')) {
    console.log("#############Email##############");
    loginName = User.find({
      email: req.body.username
    });
  } else {
    console.log("#######UserName########");
    loginName = User.find({
      user_name: req.body.username
    });
  }
  //User.find({ email: req.body.username })
  loginName
    .exec()
    .then(user => {

      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed as user is not registered."
        });
      }
      console.log("\"shinighami@001\"");
      const token = jwt.sign({
          userId: user[0]._id
        },
        process.env.JWT_KEY, {
          expiresIn: "1h"
        }
      );

      var nodemailer = require('nodemailer');
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: true,
        auth: {
          user: 'peopletalkingstudio@gmail.com',
          pass: "\"shinighami@001\""
        }
      });
      const vUrl = `http://localhost:3000/confirmation/${token}`;
      var mailOptions = {
        from: 'peopletalkingstudio@gmail.com',
        to: user[0].email,
        subject: 'Sending Email using Node.js',
        html: `Please click this email to confirm your email: <a href="${vUrl}">${vUrl}</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          //console.log(error);
          console.log("##Email sending failed##");
          return res.status(401).json({
            message: "Email Sending Failed"
          });
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(201).json({
            message: "Email Sending Successful"
          });
        }
      });

      


    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

//exports.user_valid = async (req, res, next) => {
//  try {
//    const token = req.params.token;
//    const decoded = jwt.verify(token, process.env.JWT_it remote remove origin
//    console.log("#########################");
//    console.log(req.params.token + " is req param o");it remote remove origin
//    User.findOneAndUpdate(decoded.userId, { $set: { user_isVerified: 'true' }}, { new: true }, function (err, user) {
//      if (err) return handleError(err);
//      res.redirect("http://localhost:8080/accountVerified");
//    });
//
//  } catch(e) {
//      res.redirect("http://localhost:8080/urlExpired");
//      console.log(e);
//      console.log("fail");
//  }
//};

//for user login
exports.user_login = async (req, res, next) => {
  //console.log("The Csurf token is : "+req.csrfToken());
  //const { userIdSess } = req.session;
  //console.log("The User session id is" +userIdSess);
  loginName = User.findOne({
    email: req.body.username
  });
  //console.log(loginName);
  if (req.body.username.includes('.')) {
    //console.log("#############Email##############");
    loginName = User.find({
      email: req.body.username
    });
  } else {
    //console.log("#######UserName########");
    loginName = User.find({
      user_name: req.body.username
    });
  }
  //User.find({ email: req.body.username })
  loginName
    .exec()
    .then(user => {
      //console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          console.log("Password Wrong");
          return res.status(401).json({
            message: "Auth failed jksanfjankjn@@@@@@@@@!!!!!!!!!"
          });
        }
        if (result) {

          if (user[0].user_isVerified === true) {
            //console.log(result);
            //const key = [process.env.JWT_KEY];
            const token = jwt.sign({
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY, {
                expiresIn: "12h"
              }
            );

            if (user[0].user_isOnline === false) {
              try {
                const userId = user[0]._id;
                const userName = user[0].user_name;
                const isRoomOwner = user[0].isRoomOwner;
                const displayName = user[0].display_name;




                User.findByIdAndUpdate(userId, {
                  $set: {
                    user_isOnline: true
                  }
                }, {
                  new: true
                }, function (err, user) {
                  if (err) return handleError(err);
                  //console.log("The user is is : " +userId);
                  //req.session.userIdSess = userId;
                  //console.log(req.session);
                  return res.status(200)
                    .json({
                      message: "Auth successful",
                      token: token,
                      userId: userId,
                      userName: userName,
                      displayName: displayName,
                      isRoomOwner: isRoomOwner,

                      //csrfToken: req.csrfToken(),
                    });

                });


              } catch (error) {
                res.status(200).json({
                  message: "Cant login this user"
                });
              }

            } else {
              console.log("M here");
              return res.status(401).json({
                message: "Your account is online in some other computer or device",
                log: "isOnline"
              });
            }

          }
          if (user[0].user_isVerified === false) {
            return res.status(401).json({
              message: "Email Not Verified",
              log: user[0].user_isVerified
            });
          }
        }
        if (!result) {
          res.status(401).json({
            message: "Auth failed as passowrd is incorrect"
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

////user forget paasword
//exports.forget_password = (req, res, next) => {
//  loginName = User.findOne({ email: req.body.username });
//  //console.log(loginName);
//  if(req.body.username.includes('.')) {
//    console.log("#############Email##############");
//    loginName = User.find({ email: req.body.username });
//  }
//  else {
//    console.log("#######UserName########");
//    loginName = User.find({ user_name: req.body.username });
//  }
//  //User.find({ email: req.body.username })
//  loginName
//    .exec()
//    .then(user => {
//      if (user.length < 1) {
//        return res.status(401).json({
//          message: "Auth failed as user is not registered."
//        });
//      }
//      
//      console.log("i am here");
//      const token = jwt.sign(
//        {
//          userId: user[0]._id
//        },
//        process.env.JWT_KEY,
//        {
//          expiresIn: "1h"
//        }
//      );
//      
//      var nodemailer = require('nodemailer');
//      var transporter = nodemailer.createTransport({
//        service: 'gmail',
//        port: 587,
//        secure: true,
//        auth: {
//          user: 'peopletalkingstudio@gmail.com',
//          pass: '8Glij@001'
//          
//        }
//      });
//      const vUrl = `http://localhost:3000/user/resetUserPassword/${ token }`;
//      var mailOptions = {
//        from: 'peopletalkingstudio',
//        to: user[0].email,
//        subject: 'Sending Email using Node.js',
//        html: `Please click this link to reset your password: <a href="${vUrl}">${vUrl}</a>`,
//      };
//      
//      transporter.sendMail(mailOptions, function(error, info){
//        if (error) {
//          console.log(error);
//          return res.status(401).json({
//            message: "Email Sending Failed"
//          });
//        } else {
//          console.log('Email sent: ' + info.response);
//          return res.status(201).json({
//            message: "Email Sending Successful"
//          });
//        }
//      });
//
//      
//    })
//    .catch(err => {
//      console.log(err);
//      res.status(500).json({
//        error: err
//      });
//    });
//};


////for verification of user user_verification
//exports.user_verification = (req, res, next) => {
//  loginName = User.findOne({ email: req.body.username });
//  //console.log(loginName);
//  if(req.body.username.includes('.')) {
//    console.log("#############Email##############");
//    loginName = User.find({ email: req.body.username });
//  }
//  else {
//    console.log("#######UserName########");
//    loginName = User.find({ user_name: req.body.username });
//  }
//  //User.find({ email: req.body.username })
//  loginName
//    .exec()
//    .then(user => {
//      if (user.length < 1) {
//        return res.status(401).json({
//          message: "Auth failed as user is not registered."
//        });
//      }
//      
//      console.log("i am here");
//      const token = jwt.sign(
//        {
//          userId: user[0]._id
//        },
//        process.env.JWT_KEY,
//        {
//          expiresIn: "1h"
//        }
//      );
//      
//      var nodemailer = require('nodemailer');
//      var transporter = nodemailer.createTransport({
//        service: 'gmail',
//        port: 587,
//        secure: true,
//        auth: {
//          user: 'peopletalkingstudio@gmail.com',
//          pass: '8Glij@001'
//          
//        }
//      });
//      const vUrl = `http://localhost:3000/confirmation/${token}`;
//      var mailOptions = {
//        from: 'peopletalkingstudio',
//        to: user[0].email,
//        subject: 'Sending Email using Node.js',
//        html: `Please click this email to confirm your email: <a href="${vUrl}">${vUrl}</a>`,
//      };
//      
//      transporter.sendMail(mailOptions, function(error, info){
//        if (error) {
//          console.log(error);
//          return res.status(401).json({
//            message: "Email Sending Failed"
//          });
//        } else {
//          console.log('Email sent: ' + info.response);
//          return res.status(201).json({
//            message: "Email Sending Successful"
//          });
//        }
//      });
//
//      
//    })
//    .catch(err => {
//      console.log(err);
//      res.status(500).json({
//        error: err
//      });
//    });
//};

exports.user_valid = async (req, res, next) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //console.log("#########################");
    //console.log("the userid is " + decoded.userId);
    //console.log("#########################");
    User.findByIdAndUpdate(decoded.userId, {
      $set: {
        user_isVerified: 'true'
      }
    }, {
      new: true
    }, function (err, user) {
      if (err) return handleError(err);
      //console.log(user);
      res.redirect("http://localhost:8080/accountVerified");
    });

  } catch (e) {
    res.redirect("http://localhost:8080/urlExpired");
    console.log(e);
    console.log("fail");
  }
};

////for user login
//exports.user_login = async (req, res, next) => {
//  loginName = User.findOne({ email: req.body.username });
//  //console.log(loginName);
//  if(req.body.username.includes('.')) {
//    console.log("#############Email##############");
//    loginName = User.find({ email: req.body.username });
//  }
//  else {
//    console.log("#######UserName########");
//    loginName = User.find({ user_name: req.body.username });
//  }
//  //User.find({ email: req.body.username })
//  loginName
//    .exec()
//    .then(user => {
//      if (user.length < 1) {
//        return res.status(401).json({
//          message: "Auth failed"
//        });
//      }
//      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
//        if (err) {
//          console.log("Password Wrong");
//          return res.status(401).json({
//            message: "Auth failed jksanfjankjn@@@@@@@@@!!!!!!!!!"
//          });
//        }
//        
//        
//          if (result) {
//            if(user[0].user_isVerified === true) {
//              console.log(result);
//                const token = jwt.sign(
//                  {
//                    email: user[0].email,
//                    userId: user[0]._id
//                  },
//                  process.env.JWT_KEY,
//                  {
//                    expiresIn: "1h"
//                  }
//                );
//                return res.status(200).json({
//                  message: "Auth successful",
//                  token: token
//                });
//            }
//            if(user[0].user_isVerified === false) {
//              return res.status(401).json({
//                message: "Email Not Verified",
//                log: user[0].user_isVerified
//              });
//            }
//          }
//          if(!result) {
//            res.status(401).json({
//              message: "Auth failed as passowrd is incorrect"
//            });
//          }
//      });
//    })
//    .catch(err => {
//      console.log(err);
//      res.status(500).json({
//        error: err
//      });
//    });
//};

//user forget paasword
exports.forget_password = (req, res, next) => {
  loginName = User.findOne({
    email: req.body.username
  });
  //console.log(loginName);
  if (req.body.username.includes('.')) {
    console.log("#############Email##############");
    loginName = User.find({
      email: req.body.username
    });
  } else {
    console.log("#######UserName########");
    loginName = User.find({
      user_name: req.body.username
    });
  }
  //User.find({ email: req.body.username })
  loginName
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed as user is not registered."
        });
      }

      //console.log("i am here");
      const token = jwt.sign({
          userId: user[0]._id
        },
        process.env.JWT_KEY, {
          expiresIn: "1h"
        }
      );

      var nodemailer = require('nodemailer');
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: true,
        auth: {
          user: 'peopletalkingstudio@gmail.com',
          pass: "\"shinighami@001\""
        }
      });
      const vUrl = `http://localhost:3000/user/resetPassword/${ token }`;
      var mailOptions = {
        from: 'peopletalkingstudio',
        to: user[0].email,
        subject: 'Sending Email using Node.js',
        html: `Please click this link to reset your password: <a href="${vUrl}">${vUrl}</a>`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          //console.log(error);
          console.log("\"shinighami@001\"");
          return res.status(401).json({
            message: "Email Sending Failed"
          });
        } else {
          console.log('Email sent: ' + info.response);
          console.log(token);
          return res.status(201).json({
            message: "Email Sending Successful",
            token: token
          });
        }
      });


    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.reset_password = async (req, res, next) => {
  try {
    console.log("The token is : " + req.params.token);
    token = req.params.token;
    decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("#########################");
    return res.redirect("http://localhost:8080/resetPassword");
    //return res.status(201).json({
    //  message: "Here is the success response from reset_password"
    //});
    //const url = "www.google.com";
    //axios.post(url)
    //.then(response => {
    //  console.log("$$$$$$$uccess");
    //  res.redirect("http://localhost:8080/resetPassword");
    //  //return res.status(200).json({
    //  //  message: "Auth successful",
    //  //  token: token
    //  //});
    //  
    //  
    //})
    //.catch(error => {
    //  console.log("errorrrrrrrr");
    //  //res.redirect("http://localhost:8080/resetPassword");
    //  //return res.status(200).json({
    //});
  } catch (e) {
    //res.redirect("http://localhost:8080/urlExpired");
    console.log("Password cant be changed error");
    //return res.status(201).json({
    //  message: "Here is the success response from reset_password"
    //});
    return res.redirect("http://localhost:8080/urlExpired");

  }
};

exports.update_password = (req, res, next) => {

  //console.log("Decoded token is : " +decoded.userId);
  console.log("updating password");
  console.log(req.headers);
  //console.log(req.body.password);
  //console.log(req.body.username);
  loginName = User.findOne({
    email: req.body.username
  });
  //console.log(loginName);
  if (req.body.username.includes('.')) {
    console.log("#############Email##############");
    loginName = User.find({
      email: req.body.username
    });
  } else {
    console.log("#######UserName########");
    loginName = User.find({
      user_name: req.body.username
    });
  }
  loginName
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "User with this email is not registered."
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            try {
              const token = req.headers.authorization.split(" ")[1];
              const decoded = jwt.verify(token, process.env.JWT_KEY);
              if (user[0]._id == decoded.userId) {
                console.log("Decoded id is: " + decoded.userId);
                User.findByIdAndUpdate(decoded.userId, {
                  $set: {
                    password: hash
                  }
                }, {
                  new: true
                }, function (err, user) {
                  if (err) return handleError(err);
                  //res.redirect("http://localhost:8080/accountVerified");
                  res.status(200).json({
                    message: "Password Changed"
                  });
                });
              } else {
                res.status(200).json({
                  message: "Cant change password for this user.."
                });
              }

            } catch (error) {
              res.status(200).json({
                message: "Password is not Changed"
              });
            }
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.reset_passwd = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  User.find({
      _id: decoded.userId
    })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(409).json({
          message: "User with this id is not registered."
        });
      } else {
        bcrypt.compare(req.body.oldPassword, user[0].password, (err, result) => {
          if (err) {
            console.log("Password Wrong");
            return res.status(401).json({
              message: "Auth failed jksanfjankjn@@@@@@@@@!!!!!!!!!"
            });
          }


          if (result) {
            if (user[0].user_isVerified === true) {

              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  return res.status(500).json({
                    error: err
                  });
                } else {
                  try {

                    if (user[0]._id == decoded.userId) {
                      console.log("Decoded id is: " + decoded.userId);
                      User.findByIdAndUpdate(decoded.userId, {
                        $set: {
                          password: hash
                        }
                      }, {
                        new: true
                      }, function (err, user) {
                        if (err) return handleError(err);
                        //res.redirect("http://localhost:8080/accountVerified");
                        res.status(200).json({
                          message: "Password Changed"
                        });
                      });
                    } else {
                      res.status(200).json({
                        message: "Cant change password for this user.."
                      });
                    }

                  } catch (error) {
                    res.status(200).json({
                      message: "Password is not Changed"
                    });
                  }
                }
              });

            }
            if (user[0].user_isVerified === false) {
              res.status(200).json({
                message: "Password is not Changed"
              });
            }
          }
          if (!result) {
            res.status(401).json({
              message: "Auth failed as passowrd is incorrect"
            });
          }
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

};

exports.update_profile = (req, res, next) => {
  console.log(req.file);
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //console.log("#########################");
    //console.log("the userid is " + decoded.userId);
    //console.log("#########################");
    if (req.file == undefined) {
      User.findByIdAndUpdate(decoded.userId, {
        $set: {
          display_name: req.body.payload[0],
          user_gender: req.body.payload[1],
          user_aboutme: req.body.payload[2]
        }
      }, {
        new: true
      }, function (err, user) {
        if (err) return handleError(err);
        //console.log(req.body.payload[0]);
        //console.log(req.body.payload[1]);
        //console.log(req.body.payload[2]);
        //console.log(req.body);
        res.status(200).json({
          userImage: "http://localhost:3000/" + user.user_image.slice(11),
          userName: user.user_name,
          displayName: user.display_name,
          gender: user.user_gender,
          userId: user._id,
          userAbout: user.user_aboutme,
          message: "profile updated"
        });

      });
    } else {



      try {
        User.findOne({
            _id: decoded.userId
          })
          .exec()
          .then(user => {
            let imgName = './' + user.user_image;
            console.log();
            console.log("______________THE USER IMAGE DELETION FOR NEW IMAGE UPDATE__________________");
            console.log(imgName);
            console.log("______________THE USER IMAGE DELETION FOR NEW IMAGE UPDATE__________________");
            console.log();
            if (imgName != "./userAvatar/profile.png") {
              console.log("THe image name is : " + imgName);
              fs.unlink(imgName, function (err) {
                if (err && err.code == 'ENOENT') {
                  // file doens't exist
                  console.log(imgName);
                  console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                  // other errors, e.g. maybe we don't have enough permission
                  console.error("Error occurred while trying to remove file");
                } else {
                  console.info(`removed`);
                }
              });
            }
            User.findByIdAndUpdate(decoded.userId, {
              $set: {
                user_image: req.file.path,
                display_name: req.body.payload[0],
                user_gender: req.body.payload[1],
                user_aboutme: req.body.payload[2]
              }
            }, {
              new: true
            }, function (err, user) {
              if (err) return handleError(err);
              console.log(req.body.payload[0]);
              console.log(req.body.payload[1]);
              console.log(req.body.payload[2]);
              console.log(req.body);
              console.log();
              console.log("______________NEW USER IMAGE HAS BEEN UPDATED__________________");
              console.log(req.file.path);
              console.log("______________NEW USER IMAGE HAS BEEN UPDATED__________________");
              console.log();
              res.status(200).json({
                userImage: "http://localhost:3000/" + user.user_image.slice(11),
                userName: user.user_name,
                displayName: user.display_name,
                gender: user.user_gender,
                userId: user._id,
                userAbout: user.user_aboutme,
                message: "success"
              });

            });
          })
          .catch(err => {
            console.log(err + " on the pic uplod.. update_profile");
          });

      } catch (e) {
        console.log(e);
        console.log("fail");
      }




    }

  } catch (e) {
    console.log(e);
    console.log("fail");
  }
};

exports.send_profile = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("#########################");
    console.log("the userid is " + decoded.userId);
    console.log("#########################");
    User.findOne({
        email: decoded.email
      })
      .exec()
      .then(user => {
        console.log(user);
        console.log("#######info######### " + user.user_gender);

        res.status(200).json({
          userImage: "http://localhost:3000/" + user.user_image.slice(11),
          userName: user.user_name,
          displayName: user.display_name,
          gender: user.user_gender,
          userAbout: user.user_aboutme,
          userId: user._id,
          message: "success",
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });

  } catch (e) {
    console.log(e);
    console.log("fail");
  }
};

exports.show_profile = (req, res, next) => {
  console.log();
  console.log("THE USER ID PASSED IS : " + req.body.userId);
  console.log(req.body);
  console.log();
  try {
    User.findOne({
        _id: req.body.userId
      })
      .exec()
      .then(user => {
        console.log(user);
        console.log("#######info######### " + user.user_gender);

        res.status(200).json({
          userImage: "http://localhost:3000/" + user.user_image.slice(11),
          userName: user.user_name,
          displayName: user.display_name,
          gender: user.user_gender,
          userAbout: user.user_aboutme,
          userId: user._id,
          message: "success",
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });

  } catch (e) {
    console.log(e);
    console.log("fail");
  }
};

exports.add_friend = (req, res, next) => {
  console.log();
  console.log("__________________________USER ID PASSED IS__________________________");

  console.log("__________________________USER ID PASSED IS__________________________");
  console.log();

  //let io = server.chatRoom();

  User.find({
      _id: req.body.friendId
    })
    .exec()
    .then(user => {

      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed as user with this id is not found."
        });
      } else {
        let cr = server.getChatRoomIO();
        //cr.emit('addFriend', 'I just met you...');
        cr.to(`${user[0].chatRoomSocket}`).emit('addFriend', {
          userName: req.body.displayName,
          userImage: req.body.userPic,
          userId: req.body.userId,
          friendId: req.body.friendId,

        });
        res.status(200).json({
          message: "success"
        });
        console.log("THE USER ID PASSED IS : " + req.body.userId);
        console.log("THE FRIEND ID PASSED IS : " + req.body.friendId);
        console.log("The socket stored in friend id is: " + user[0].connected_socket);
      }

    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });


  console.log("FRIEND ADDED");
};
exports.request_accepted = (req, res, next) => {

  User.findByIdAndUpdate(req.body.friendId, {
    $push: {
      friendIds: req.body.userId
    }
  }, function (err, user) {
    if (err) return handleError(err);

    //console.log(user)
  });

  User.findByIdAndUpdate(req.body.userId, {
    $push: {
      friendIds: req.body.friendId
    }
  }, function (err, user) {
    if (err) return handleError(err);
    //console.log(user);
  });




  res.status(200).json({
    message: "success: new friend added"
  });
};



exports.friend_info = (req, res, next) => {
  User.findOne({
      _id: req.body.userId
    })
    .exec()
    .then(user => {

      console.log("__________TESTING FRIEND INFO___________");
      let index = user.friendIds.indexOf(req.body.friendId);
      console.log("the index is: " + index);
      if (index === -1) {
        let fr = server.getChatRoomIO();

        fr.to(`${user.chatRoomSocket}`).emit('notFriend');
      } else {
        let cr = server.getChatRoomIO();

        cr.to(`${user.chatRoomSocket}`).emit('alreadyFriend');
      }
      console.log("__________TESTING FRIEND INFO___________");

      res.status(200).json({
        message: "success fetching friend info",
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.update_friend_list = (req, res) => {
  User.find({
      _id: req.body.userId
    })
    .exec()
    .then((user) => {
      console.log();
      console.log();
      res.status(200).json({
        message: "success fetching friend info",
        friendList: user[0].friendList
        //listLength: friendIdList.length
      });
    })
    .catch((err) => {
      console.log(err);
    });

}


exports.friend_list = async (req, res) => {
  console.log("1");
  let fname = null;
  let fid = null;
  let fgender = null;
  let fpic = null;
  let friendIdList = [];


  console.log("2");
  User.find({
      _id: req.body.userId
    })
    .exec()
    .then((user) => {
      if (user[0].friendIds.length > 0) {
        console.log("3");
        for (let i = 0; i < user[0].friendIds.length; i++) {
          friendIdList.push(user[0].friendIds[i]);
        }
        console.log("4");
        fname = user[0].display_name;
        fid = user[0]._id;
        fgender = user[0].user_gender;
        fOnline = user[0].user_isOnline;
        fpic = "http://localhost:3000/" + user[0].user_image.slice(11);
        console.log("5");
      } else {

      }

    })
    .then(() => {
      console.log("6");
      friendIdList = _.uniq(friendIdList);
      console.log("7");
      for (let i = 0; i < friendIdList.length; i++) {
        resFlag = 0;
        User.find({
            _id: friendIdList[i]
          })
          .exec()
          .then((user) => {
            console.log("8");
            if (user[0].friendList.length > 0) {
              console.log("9");
              pos = user[0].friendList.map(function (e) {
                return e.friendId;
              }).indexOf(req.body.userId);
              console.log("The position is : " + pos);
              if (pos > -1) {
                resFlag = 1;
                console.log("Exists in the friendList array");
                console.log("10");
                console.log("|||||");
                console.log(user[0].display_name);
                console.log(user[0].user_image);
                console.log(user[0]._id);
                console.log(friendIdList[i]);
                console.log(friendIdList[i].display_name);

                User.findOneAndUpdate({
                  "_id": req.body.userId,
                  "friendList.friendId": user[0]._id
                }, {
                  "$set": {
                    "friendList.$.friendPic": "http://localhost:3000/" + user[0].user_image.slice(11),
                    "friendList.$.friendName": user[0].display_name,
                    "friendList.$.friendGender": user[0].user_gender,
                    "friendList.$.friendOnline": user[0].user_isOnline,

                  }
                }, function (error, success) {
                  console.log("?????????");

                })



              } else {
                let temp = user[0]._id;
                User.findByIdAndUpdate(req.body.userId, {
                    $push: {
                      friendList: {
                        friendName: user[0].display_name,
                        friendId: user[0]._id,
                        friendGender: user[0].user_gender,
                        friendPic: "http://localhost:3000/" + user[0].user_image.slice(11),
                        friendOnline: user[0].user_isOnline

                      }
                    }
                  },
                  function (err, user) {
                    console.log("12");
                    if (err) return handleError(err);



                    console.log();
                    console.log("===================");
                    console.log(fname);
                    console.log(fid);
                    console.log(fgender);
                    console.log(fpic);
                    console.log("===================");
                    console.log();


                    User.findByIdAndUpdate(temp, {
                        $push: {
                          friendList: {
                            friendName: fname,
                            friendId: fid,
                            friendGender: fgender,
                            friendPic: fpic,
                            friendOnline: fOnline
                          }
                        }
                      },
                      function (err, user) {

                        if (err) return handleError(err);
                        console.log(user);

                      });
                  });

              }
            } else {
              console.log("11");
              let temp = user[0]._id;
              User.findByIdAndUpdate(req.body.userId, {
                  $push: {
                    friendList: {
                      friendName: user[0].display_name,
                      friendId: user[0]._id,
                      friendGender: user[0].user_gender,
                      friendPic: "http://localhost:3000/" + user[0].user_image.slice(11),
                      friendOnline: user[0].user_isOnline
                    }
                  }
                },
                function (err, user) {
                  console.log("12");
                  if (err) return handleError(err);



                  console.log();
                  console.log("===================");
                  console.log(fname);
                  console.log(fid);
                  console.log(fgender);
                  console.log(fpic);
                  console.log("===================");
                  console.log();
                  console.log("13");

                  User.findByIdAndUpdate(temp, {
                      $push: {
                        friendList: {
                          friendName: fname,
                          friendId: fid,
                          friendGender: fgender,
                          friendPic: fpic,
                          friendOnline: fOnline
                        }
                      }
                    },
                    function (err, user) {
                      console.log("14");
                      if (err) return handleError(err);
                      console.log(user);

                    });
                  console.log("15");



                });
              console.log("16");

            }

            console.log("17");
            console.log("34434");

          })
          .catch((err) => {
            console.log("2.error : something went wrong..");
            console.log(err);
          });
      }
      console.log("18");
      res.status(200).json({
        message: "done operation",
        userId: req.body.userId
      });

    })
    .catch((err) => {
      console.log("1.something went wrong..");
      console.log(err);
    });
  console.log("19");
}

exports.delete_friend = (req, res) => {

  User.findByIdAndUpdate(req.body.userId, {
      $pull: {
        friendIds: req.body.friendId
      }
    }, {
      safe: true,
      upsert: true
    },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {}
    }
  );
  User.findByIdAndUpdate(req.body.friendId, {
      $pull: {
        friendIds: req.body.userId
      }
    }, {
      safe: true,
      upsert: true
    },
    function (err, doc) {
      if (err) {
        console.log(err);
      } else {}
    }
  );

  User.updateOne({
      _id: req.body.userId
    }, {
      "$pull": {
        "friendList": {
          "friendId": req.body.friendId
        }
      }
    }, {
      safe: true,
      multi: true
    },
    function (err, obj) {
      //do something smart
    });

  User.updateOne({
      _id: req.body.friendId
    }, {
      "$pull": {
        "friendList": {
          "friendId": req.body.userId
        }
      }
    }, {
      safe: true,
      multi: true
    },
    function (err, obj) {
      //do something smart
    });

  res.status(200).json({
    message: "done deleting friend",
    userId: req.body.userId
  });

}


exports.user_logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("#########################");
    console.log("the userid is " + decoded.userId);
    console.log("#########################");
    User.findByIdAndUpdate(decoded.userId, {
      $set: {
        connected_socket: "",
        user_isOnline: false
      }
    }, {
      new: true
    }, function (err, user) {
      if (err) return handleError(err);
      //console.log(user);

      res.status(200).json({
        message: "success"
      });
    });

  } catch (e) {
    res.status(200).json({
      message: "success"
    });
    console.log(e);
    console.log("fail");
  }
};

//for user delete
exports.user_delete = (req, res, next) => {
  User.remove({
      _id: req.params.userId
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({

        error: err
      });
    });
};