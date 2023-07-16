/**
 * Created by dwiargo on 4/6/16.
 */

import nodemailer from 'nodemailer';
import env from '../../config/environment';

export const send =  (from,to,subject,message, sender=env.mail.sender) => {
    return new Promise(function (resolve, reject) {
        var transporter = nodemailer.createTransport(sender);

        transporter.sendMail({
            from: from||sender.auth.user,
            to: to,
            subject: subject,
            html: message
        }, function (err, info) {
            if(err) reject(err);
            else resolve(info)
        })
    })
}