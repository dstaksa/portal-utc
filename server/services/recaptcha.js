import axios from 'axios';
import env from '../../config/environment';
import qs from 'query-string';

export const validate = (response) => {
  return new Promise(async (resolve, reject) => {
    try{
      let data = {
        secret: env.google.recaptcha.secretKey,
        response: response
      }
      let res = await axios.post(`https://www.google.com/recaptcha/api/siteverify?${qs.stringify(data)}`)
      if(res.data.success) resolve(res.data);
      else reject({message:'Failed recaptcha validation'});
    }catch(error){
      reject(error)
    }
  })
}