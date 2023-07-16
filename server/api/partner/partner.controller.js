import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import env from '../../../config/environment';
import _ from 'lodash';

const staticHost = `${env.host}${env.staticPath.partner}`;
let db; 
const Model = model(
  'name', 'description', 'caption', 'lang', 'referenceId',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const ModelDetails = model(
  'partnerId', 'criteria', 'channel', 'interviewees', 'position', 'testimonial',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const message = {
  notFound: 'Maaf, Partner dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = id => {
  return new Promise(async (resolve, reject) => {
    try{
      let result = await db(`${tableNames.PARTNER} as partner`)
        // .leftJoin(`${tableNames.PARTNER_DETAILS} as details`, 'details.partnerId', 'partner.id')
        .select('*')
        .where('id', id)
        .first();
      
      result.image = result.image ? `${staticHost}/${result.image}` : null;
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

  await pagination.total(req, res, db(`${tableNames.PARTNER}`));
  let result = await pagination.query(req, res, db(`${tableNames.PARTNER}`)
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
  let data = await new Model(req.body, req.method, db(tableNames.PARTNER));
  if(req.file){
    data.image = req.file.filename;
  }
  let resultId = await db(tableNames.PARTNER)
    .returning('id')
    .insert(data);

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

export const update = wrapAsync( async req => {
  const { id } = req.params;
  const { content } = req.body;
  let data = await new Model(req.body);
   if(req.file){
    data.image = req.file.filename;
  }

  let item = await db(tableNames.PARTNER)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);

  if(data.isPublished) {
    _update.datePublished = new Date();
    _update.publishedBy = req.user.username;
  }

  await db(tableNames.PARTNER)
    .where({id})
    .update(_update); 

  if(content){
    await db(tableNames.PARTNER_DETAILS)
      .where('partnerId', id)
      .update({content})
  }

  return _update;
})

export const del = wrapAsync( async req => {
  await db(tableNames.PARTNER)
    .where({id: req.params.id})
    .del()
  return 'success';
})