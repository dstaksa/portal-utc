export default function(){
  return (data, method='post', sql) => {
    return new Promise(async (resolve, reject) => {
      try{
        let result = {};
        const getValue = (key) => {
          let val = data[key];
          if([undefined, null, 'null'].indexOf(val) < 0) result[key] = val;
        }

        method = String(method).toLowerCase();

        for(let key of arguments){
          getValue(key);
        }

        if(method === 'post' && sql){
          let id = await sql.select('id').orderBy('id', 'desc').first();
          console.log(id)
          result.id = id ? id.id + 1 : 1;
        }

        return resolve(result);
      }catch(error){
        reject(error);
      }
    })
  }
}