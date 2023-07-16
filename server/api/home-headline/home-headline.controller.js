import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import env from '../../../config/environment';
import _ from 'lodash';
import moment from 'moment'

const staticHost = `${env.host}${env.staticPath.home}`;

let db; 
const Model = model(
  'label', 'description', 'actionLabel', 'actionUrl', 'caption', 'referenceId', 'lang',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const message = {
  notFound: 'Headline dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = (req, lang='id') => {
  let find = () => (db(`${tableNames.HOME_HEADLINE}`)
    .select('*')
    .whereIn(
      "isPublished",
      req.route.path === "/public/index" ? [true] : [true, false]
    )
    .first()
  )

  return new Promise(async (resolve, reject) => {
    try{
      let result;
      let selector = {lang}
      result = await find().where(selector)

      if([null, undefined].indexOf(result) >= 0) {
        result = await find()

        result.lang = lang;
        result.referenceId = result.id;
        delete result.id;
      }

      result.imageSrc = `${staticHost}/${result.image}`;
      resolve(result);
    }catch(error){
      reject(error);
    }
  })
}

export const index = wrapAsync(async (req, res) => {
  let result = await getById(req, req.lang); 

  return result;
})

export const create = wrapAsync( async req => {
  let data = await new Model(req.body, req.method, db(tableNames.HOME_HEADLINE));
  if(req.file) data.image = req.file.filename;

  if(data.referenceId){
    let reference = await db(tableNames.HOME_HEADLINE).where({id: data.referenceId}).first();
    data.isPublished = reference.isPublished;
    data.publishedBy = reference.publishedBy;
    data.datePublished = reference.datePublished;
    data.image = reference.image;
  }

  let resultId = await db(tableNames.HOME_HEADLINE)
    .returning('id')
    .insert(data);

  resultId = resultId[0];

  let result = getById(req, 'id')

  return result;
})

export const show = wrapAsync(async req => {
  let result = await getById(req, req.lang);
  if(!result) throw new apiError(message.notFound, 404)
  return result;
})

export const update = wrapAsync( async req => {
  const { id } = req.params;
  let data = await new Model(req.body);
  if(req.file){
    data.image = req.file.filename;
  }
  
  let item = await db(tableNames.HOME_HEADLINE)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);
  _update.datePublished = moment(_update.datePublished).toDate();

  await db(tableNames.HOME_HEADLINE)
    .where({id})
    .update(_update);

  await db(tableNames.HOME_HEADLINE)
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
  await db(tableNames.HOME_HEADLINE)
    .where({id: req.params.id})
    .del()

  await db(tableNames.HOME_HEADLINE)
    .where({id: req.params.id})
    .del()
  
  return 'success';
})