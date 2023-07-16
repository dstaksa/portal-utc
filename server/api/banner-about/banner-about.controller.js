import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model } from "../../services";
import _ from 'lodash';
import moment from 'moment'

let db; 
const Model = model(
  'label', 'description', 'actionLabel', 'actionUrl', 'referenceId', 'lang',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const message = {
  notFound: 'Banner About dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = (req, lang='id') => {
  let find = () => (db(`${tableNames.BANNER_ABOUT}`)
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
  let data = await new Model(req.body, req.method, db(tableNames.BANNER_ABOUT));

  if(data.referenceId){
    let reference = await db(tableNames.BANNER_ABOUT).where({id: data.referenceId}).first();
    data.isPublished = reference.isPublished;
    data.publishedBy = reference.publishedBy;
    data.datePublished = reference.datePublished;
  }

  let resultId = await db(tableNames.BANNER_ABOUT)
    .returning('id')
    .insert(data);

  resultId = resultId[0];

  let result = getById(req, 'id')

  return result;
})

export const show = wrapAsync(async req => {
  let result = await getById(req, rea.lang);
  if(!result) throw new apiError(message.notFound, 404)
  return result;
})

export const update = wrapAsync( async req => {
  const { id } = req.params;
  let data = await new Model(req.body);
  let item = await db(tableNames.BANNER_ABOUT)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);
  _update.datePublished = moment(_update.datePublished).toDate();
 
  await db(tableNames.BANNER_ABOUT)
    .where({id})
    .update(_update);
  
  await db(tableNames.BANNER_ABOUT)
    .where({referenceId: id})
    .update({
      isPublished: _update.isPublished,
      publishedBy: _update.publishedBy,
      datePublished: _update.datePublished,
    })
	

  return _update;
})

export const del = wrapAsync( async req => {
  await db(tableNames.BANNER_ABOUT)
    .where({id: req.params.id})
    .del()

  await db(tableNames.BANNER_ABOUT)
    .where({referenceId: req.params.id})
    .del()

  return 'success';
})