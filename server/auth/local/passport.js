import passport from 'passport';
import { Strategy } from 'passport-local';
import { tableNames } from '../../../config/constant';
import { authenticate } from '../auth.service';


export const setupPassport = db => {
  passport.use(new Strategy({
      usernameField: 'username',
      passwordField: 'password' // this is the virtual field on the model
    },
    async (username, password, done) => {
      try{
        let users = await db(tableNames.USER)
          .where({username: username})
          .select('*')

        if(users.length === 0) return done( null, false, {message: 'This username is not registered'});
        else {
          let user = users[0];
          if(!authenticate(password, user.salt, user.hashedPassword)){
            return done( null, false, {message: 'This password is not correct'});
          }
          return done(null, user);
        }
      }catch(error){
        return done(null, false, { message: error });
      }
    }
  ))
};