import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import _ from 'lodash';
import moment from 'moment'

let db; 
const Model = model(
  'title', 'description', 'speaker', 'caption', 'referenceId', 'lang',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const message = {
  notFound: 'Service Catalogue Intro dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = (lang='id', id) => {
  let find = () => (db(`${tableNames.SERVICE_CATALOGUE_INTRO}`)
    .select('*')
    .first()
  )

  return new Promise(async (resolve, reject) => {
    try{
      let result;
      let selector = {lang}
      selector[lang === 'id' ? 'id' : 'referenceId'] = id;
      result = await find().where(selector)

      if([null, undefined].indexOf(result) >= 0) {
        result = await find().where({'id': id});

        result.lang = lang;
        result.referenceId = id;
        delete result.id;
      }

      resolve(result);
    }catch(error){
      reject(error);
    }
  })
}

export const index = wrapAsync(async (req, res) => {
  let selector = {lang: req.isPublic ? req.lang : 'id'};
  await pagination.total(req, res, db(`${tableNames.SERVICE_CATALOGUE_INTRO}`));
  let result = await pagination.query(req, res, db(`${tableNames.SERVICE_CATALOGUE_INTRO}`)
    .select('*')
    .whereIn(
      "isPublished",
      req.route.path === "/public/index" ? [true] : [true, false]
    )
    .where(selector)
  )

  return result || [];
})

export const create = wrapAsync( async req => {
  let data = await new Model(req.body, req.method, db(tableNames.SERVICE_CATALOGUE_INTRO));
  if(req.file) data.image = req.file.filename;

  if(data.referenceId){
    let reference = await db(tableNames.SERVICE_CATALOGUE_INTRO).where({id: data.referenceId}).first();
    data.isPublished = reference.isPublished;
    data.publishedBy = reference.publishedBy;
    data.datePublished = reference.datePublished;
  }

  let resultId = await db(tableNames.SERVICE_CATALOGUE_INTRO)
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
  let item = await db(tableNames.SERVICE_CATALOGUE_INTRO)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);
  _update.datePublished = moment(_update.datePublished).toDate();

  await db(tableNames.SERVICE_CATALOGUE_INTRO)
    .where({id})
    .update(_update);

  await db(tableNames.SERVICE_CATALOGUE_INTRO)
    .where({referenceId: id})
    .update({
      isPublished: _update.isPublished,
      publishedBy: _update.publishedBy,
      datePublished: _update.datePublished,
    })

  return _update;
})

export const del = wrapAsync( async req => {
  await db(tableNames.SERVICE_CATALOGUE_INTRO)
    .where({id: req.params.id})
    .del()

  await db(tableNames.SERVICE_CATALOGUE_INTRO)
    .where({id: req.params.id})
    .del()
  return 'success';
})