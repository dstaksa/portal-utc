import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import env from '../../../config/environment';
import _ from 'lodash';
import moment from 'moment';

const staticHost = `${env.host}${env.staticPath.banner}`;
let db; 
let dataKeys = [
  'title', 'description', 'image', 'caption', 'actionLabel', 'actionUrl', 'referenceId', 'lang',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
]
const Model = model(...dataKeys)

const message = {
  notFound: 'Banner dengan id dimaksud tidak ditemukan',
  requiredFile: 'Gambar banner tidak boleh kosong'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = (lang='id', id) => {
  let find = () => (db(`${tableNames.BANNER}`)
    .select('*')
    .first()
  )

  return new Promise(async (resolve, reject) => {
    try{
      let result;
      let selector = {lang}
      selector[lang === 'id' ? 'id' : 'referenceId'] = id;
      result = await find().where(selector);

      if([null, undefined].indexOf(result) >= 0) {
        result = await find().where({'id': id});
        result.lang = lang;
        result.referenceId = id;
        delete result.id;
      }

      result.imageSrc = result.image ? `${staticHost}/${result.image}` : null;
      resolve(result);
    }catch(error){
      reject(error);
    }
  })
}

export const index = wrapAsync(async (req, res) => {
  let selector = { lang: req.isPublic ? req.lang : 'id'};
  await pagination.total(req, res, db(`${tableNames.BANNER}`));
  let result = await pagination.query(req, res, db(`${tableNames.BANNER}`)
    .select('*')
    .whereIn(
      "isPublished",
      req.route.path === "/public/index" ? [true] : [true, false]
    )
    .where(selector)
  )

  res.set('x-static-host', staticHost);
  return result || [];
})

export const create = wrapAsync( async req => {
  if(!req.body.referenceId && !req.file) throw new apiError(message.requiredFile, '400')
  let data = await new Model(req.body, req.method, db(tableNames.BANNER));
  if(req.file) data.image = req.file.filename;
  
  data.datePublished = moment(data.datePublished).toDate();

  if(data.referenceId){
    let reference = await db(tableNames.BANNER).where({id: data.referenceId}).first();
    data.isPublished = reference.isPublished;
    data.publishedBy = reference.publishedBy;
    data.datePublished = reference.datePublished;
    data.image = reference.image;
  }
  
  console.log(data)

  let resultId = await db(tableNames.BANNER)
    .returning('id')
    .insert(data);

  resultId = resultId[0];

  let result = getById('id', resultId)

  return result;
})

export const show = wrapAsync(async req => {
  let result = await getById(req.lang, req.params.id);
  if(!result) throw new apiError(message.notFound, 404)
  return result;
})

export const update = wrapAsync( async req => {
  const { id } = req.params;
  let data = await new Model(req.body);
  if(req.file){
    data.image = req.file.filename;
  }
  let item = await db(tableNames.BANNER)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);
  _update.datePublished = moment(_update.datePublished).toDate();
 
  await db(tableNames.BANNER)
    .where({id})
    .update(_update);

  await db(tableNames.BANNER)
    .where({referenceId: id})
    .update({
      isPublished: _update.isPublished,
      publishedBy: _update.publishedBy,
      datePublished: _update.datePublished,
      image: _update.image
    })

  return _update;
})

export const del = wrapAsync( async req => {
  await db(tableNames.BANNER)
    .where({id: req.params.id})
    .del()

  await db(tableNames.BANNER)
    .where({referenceId: req.params.id})
    .del()

  return 'success';
})