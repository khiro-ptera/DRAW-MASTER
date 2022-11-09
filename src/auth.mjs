import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// assumes that User was registered in `./db.mjs`
const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  console.log('starting new authenticated session', user);
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user; 
    } 
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  req.session.destroy((err) => { cb(err); });
};


const register = (username, email, password, errorCallback, successCallback) => {
  if(username.length >= 4 && password.length >= 8) {
    User.findOne({username:username}, function(err, result) {
      if(result === null) {
        bcrypt.hash(password, 10, (err, hash) => {
          if(!err) {
            const user = new User({_id: new mongoose.Types.ObjectId(), username:username, email:email, password:hash});
            user.save((err, user) => {
              if(!err) {
                successCallback(user);
              } else {
                errorCallback({message:'DOCUMENT SAVE ERROR'});
              }
            });
          } else {
            errorCallback({message:'HASH ERROR ' + err});
          }
        });
      } else {
        errorCallback({message:'USERNAME ALREADY EXISTS'});
      }});
  } else {
    errorCallback({message:'USERNAME PASSWORD TOO SHORT'});
  }
};

const login = (username, password, errorCallback, successCallback) => {
  User.findOne({username:username}, (err, user) => {
    if(!err && user) {
      bcrypt.compare(password, user.password, (err, match) => {
        if(match === true) {
          successCallback(user);
        } else {
          errorCallback({message:'PASSWORDS DO NOT MATCH'});
        } 
      });
    } else {
      errorCallback({message:'USER NOT FOUND'});
    }
  });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    if(authRequiredPaths.includes(req.path)) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
