import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import env from '../../../config/environment';
import _ from 'lodash';
import path from 'path';

const staticHost = `${env.host}${env.staticPath.partner}`;
let db; 
const Model = model(
  'description',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
);

const message = {
  notFound: 'Maaf, File katalog dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = id => {
  return new Promise(async (resolve, reject) => {
    try{
      let result = await db(`${tableNames.SERVICE_CATALOGUE_FILE}`)
        .select('*')
        .where('id', id)
        .first();
      
      result.file = result.file ? `${staticHost}/${result.fileName}` : null;
      resolve(result);
    }catch(error){
      reject(error);  
    }
  })
}

export const index = wrapAsync(async (req, res) => {
  const { slug } = req.query;
  let selector = {};
  if(slug) selector.slug = slug;

  await pagination.total(req, res, db(`${tableNames.SERVICE_CATALOGUE_FILE}`));
  let result = await pagination.query(req, res, db(`${tableNames.SERVICE_CATALOGUE_FILE}`)
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
  let data = await new Model(req.body, req.method, db(tableNames.SERVICE_CATALOGUE_FILE));
  if(!req.file) throw new apiError('PDF File harus disertakan', 400);
  data.fileName = req.file.filename;
  data.mimeType = req.file.mimetype;
  data.originalFileName = req.file.originalname;

  let resultId = await db(tableNames.SERVICE_CATALOGUE_FILE)
    .insert(data)
    .returning('id');

  resultId = resultId[0];
  let result = getById(resultId)

  return result;
})

export const show = wrapAsync(async (req, res) => {
  let result = await getById(req.params.id);
  if(!result) throw new apiError(message.notFound, 404);
  if(req.route.path === '/public/show/:id' && !result.isPublished)
    throw new apiError(message.notFound, 404);
    
  return result;
})

export const current = wrapAsync(async (req) => {
  let result = await db(tableNames.SERVICE_CATALOGUE_FILE)
    .select('*')
    .where('isPublished', true)
    .orderBy('datePublished', 'asc')
    .first();

  if(!result) return null;
  return result;
})

export const update = wrapAsync( async req => {
  const { id } = req.params;
  let data = await new Model(req.body);
   if(req.file){
    data.fileName = req.file.filename;
    data.mimeType = req.file.mimetype;
    data.originalFileName = req.file.originalname;
  }

  let item = await db(tableNames.SERVICE_CATALOGUE_FILE)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);

  if(data.isPublished) {
    _update.datePublished = new Date();
    _update.publishedBy = req.user.username;
  }

  await db(tableNames.SERVICE_CATALOGUE_FILE)
    .where({id})
    .update(_update); 

  return _update;
})

export const del = wrapAsync( async req => {
  await db(tableNames.SERVICE_CATALOGUE_FILE)
    .where({id: req.params.id})
    .del()
  return 'success';
})

export const download = async (req, res) => {
  let { id } = req.params;
  let item = await db(tableNames.SERVICE_CATALOGUE_FILE)
    .select('fileName', 'mimeType', 'originalFileName')
    .where({id, isPublished: true})
    .first();

  if(!item) throw new apiError(message.notFound, 404);
  const file = path.resolve(`${env.path.upload.baseUri}${env.path.upload.sub.file}/${item.fileName}`)
  return res.download(file, item.originalFileName);
}