import express from 'express';
import env from '../../../config/environment';
import { send } from '../../services/mailer';
import { validate } from '../../services/recaptcha';
import { find } from 'lodash';
import qs from 'query-string';

const isProd = process.env.NODE_ENV === 'production';
const router = db => {
  let _router = new express.Router
      _router
      .get('/conf', async(req, res) => {
        // try{
        //   let conf = await db(isProd ? 'SECURE.CONFIG' : 'SECURE_CONFIG')
        //     .select('*')
        //     .whereIn('CODE', ['EMAIL.FROM.AMS'])

        //   const user = find(conf, {CODE: 'EMAIL.FROM.AMS'});
          // return res.status(200).json({to:user.CONTENT});
        // }catch(error){
        //   console.log(err);
        //   return res.status(500).send(err.message);
        // }
        // console.log("test_get");
      })
      .post('/send', async (req, res) => {
        let { subject, name, email, message, recaptchaResponse } = req.body;

        try{
          if(env.google.recaptcha.active){
            await validate(recaptchaResponse);
          }

          let conf = await db(isProd ? 'SECURE.CONFIG' : 'SECURE_CONFIG')
            .select('*')
            .whereIn('CODE', ['EMAIL.FROM.AMS', 'EMAIL.FROMDESC.AMS', 'EMAIL.PASSWORD.AMS', 'EMAIL.SERVER'])

          const user = find(conf, {CODE: 'EMAIL.FROM.AMS'});
          const pass = find(conf, {CODE: 'EMAIL.PASSWORD.AMS'});
          const host = find(conf, {CODE: 'EMAIL.SERVER'});
          
          let from = `${name} <${email}>`;
          subject = `[PORTAL-UTC] ${subject}`;

          if(env.mail.useMailServer){
            let sender = env.mail.sender
            sender.host = host.CONTENT;
            sender.auth.user = user.CONTENT
            sender.auth.pass = pass.CONTENT;
            
            await send(from, user.CONTENT, subject, message, sender);
            return res.status(200).send('Mail has been sent');
          }else{
            return res.status(200).send(`mailto:${user.CONTENT}?${qs.stringify({
              subject,
              body: message
            })}`)
          }
        }catch(err){
          console.log(err);
          return res.status(500).send(err.message);
        }
      });
  return _router;
}

export default {
  router
};
