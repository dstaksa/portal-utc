import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import env from '../../../config/environment';
import _ from 'lodash';
import moment from 'moment';

const staticHost = `${env.host}${env.staticPath.event}`;
let db; 
let dataKeys = [
  'title', 'description', 'location', 'caption', 'dateStart', 'dateEnd', 'referenceId', 'lang',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
]
const Model = model(...dataKeys)

const ModelDetails = model(
  'eventId', 'content',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const message = {
  notFound: 'Event dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = (lang='id', id) => {
  return new Promise(async (resolve, reject) => {
    let keys = _.concat(dataKeys.map( k => (`event.${k}`)), [
      'event.id', 
      'details.content'
    ])
    let find = () => (db(`${tableNames.EVENT} as event`)
      .leftJoin(`${tableNames.EVENT_DETAILS} as details`, 'details.eventId', 'event.id')
      .select(...keys)
      .first()
    )
    try{
      let result;
      let selector = {lang}
      selector[lang === 'id' ? 'event.id' : 'event.referenceId'] = id;
      result = await find().where(selector)

      if([null, undefined].indexOf(result) >= 0) {
        result = await find().where({'event.id': id});

        result.lang = lang;
        result.referenceId = id;
        delete result.id;
      }
      
      result.imageSrc = result.image ? `${env.host}${env.staticPath.event}/${result.image}` : null;
      resolve(result);
    }catch(error){
      reject(error);  
    }
  })
}

export const index = wrapAsync(async (req, res) => {
  let selector = { lang: req.isPublic ? req.lang : 'id'};
  await pagination.total(req, res, db(`${tableNames.EVENT}`));
  let result = await pagination.query(req, res, db(`${tableNames.EVENT}`)
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

export const indexPublic = wrapAsync(async(req,res) => {
  let { month, year } = req.params;
  let selector = { lang: req.isPublic ? req.lang : 'id'};
  selector.isPublished = true;

  month = Number(month); year = Number(year);
  let from = moment(`${year}/${month}/1`, 'YYYY/MM/DD').toDate();
  let to = moment(from).add(1, 'M').toDate();

  let sql =  db(`${tableNames.EVENT}`)
    .where(selector)
    // .where('dateEnd', '>=', new Date())
    .whereBetween('dateStart', [from, to])
  
  let result = await pagination.query(req, res, sql
    .select('*')
    .orderBy('dateStart', 'asc')
    // .limit(size)
    // .offset((page-1)*size)
  )

  // let total = await sql
  //   .count('* as count')

  // res.set('x-pagination-count', total.count);
  res.set('x-static-host', staticHost);
  return result || [];
})

export const create = wrapAsync( async req => {
  let data = await new Model(req.body, req.method, db(tableNames.EVENT));
  if(req.file){
    data.image = req.file.filename;
  }

  data.dateStart = moment(data.dateStart, 'YYYY-MM-DD HH:mm:ss').toDate();
  data.dateEnd = moment(data.dateEnd, 'YYYY-MM-DD HH:mm:ss').toDate();

  if(data.referenceId){
    let reference = await db(tableNames.EVENT).where({id: data.referenceId}).first();
    data.isPublished = reference.isPublished;
    data.publishedBy = reference.publishedBy;
    data.datePublished = reference.datePublished;
    data.image = reference.image;
  }

  let resultId = await db(tableNames.EVENT)
    .returning('id')
    .insert(data);

  resultId = resultId[0];

  if(req.body.content){
    let detailsData = await new ModelDetails(req.body, req.method, db(tableNames.EVENT_DETAILS));
    detailsData.eventId = resultId;
    await db(tableNames.EVENT_DETAILS).insert(detailsData);
  }

  let result = getById('id', resultId)

  return result;
})

export const show = wrapAsync(async (req, res) => {
  let result = await getById(req.lang, req.params.id);
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

  if(data.dateStart) data.dateStart = moment(data.dateStart, 'YYYY-MM-DD HH:mm:ss').toDate();
  if(data.dateEnd) data.dateEnd = moment(data.dateEnd, 'YYYY-MM-DD HH:mm:ss').toDate();

  let item = await db(tableNames.EVENT)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  let _update = _.merge(item, data);

  await db(tableNames.EVENT)
    .where({id})
    .update(_update); 

  if(content){
    await db(tableNames.EVENT_DETAILS)
      .where('eventId', id)
      .update({content})
  }

  await db(tableNames.EVENT)
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
  await db(tableNames.EVENT)
    .where({id: req.params.id})
    .del()

  await db(tableNames.EVENT)
    .where({referenceId: req.params.id})
    .del()

  await db(tableNames.EVENT_DETAILS)
    .where({eventId: req.params.id})
    .del()
  return 'success';
})