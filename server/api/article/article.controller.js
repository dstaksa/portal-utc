import { wrapAsync, apiError } from "../../services";
import { tableNames } from '../../../config/constant';
import { model, pagination } from "../../services";
import env from '../../../config/environment';
import _ from 'lodash';
import moment from 'moment';

const staticHost = `${env.host}${env.staticPath.article}`;
let db; 
const dataKeys = [
  'title', 'description', 'slug', 'location', 'publisher', 'author', 'caption', 'referenceId', 'lang',
  'isPublished', 'publishedBy', 'datePublished',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified', 'image'
]
const Model = model(...dataKeys)

const ModelDetails = model(
  'articleId', 'content',
  'createdBy', 'dateCreated',
  'modifiedBy', 'dateModified'
)

const message = {
  notFound: 'Maaf, Artikel dengan id dimaksud tidak ditemukan'
}

export const initDbConnection = (dbConnection) => { db = dbConnection };
export const getById = (lang='id', id) => {
  let keys = _.concat(dataKeys.map( k => (`article.${k}`)), [
    'article.id', 
    'details.content'
  ])
  let find = () => (db(`${tableNames.ARTICLE} as article`)
    .leftJoin(`${tableNames.ARTICLE_DETAILS} as details`, 'details.articleId', 'article.id' )
    .select(...keys)
    .first()
  )

  return new Promise(async (resolve, reject) => {
    try{
      let result;
      let selector = {lang}
      selector[lang === 'id' ? 'article.id' : 'article.referenceId'] = id;
      result = await find().where(selector)

      if([null, undefined].indexOf(result) >= 0) {
        result = await find().where({'article.id': id});

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
  const { slug } = req.query;
  let selector = {lang: req.isPublic ? req.lang : 'id'};
  if(slug) selector.slug = slug;

  await pagination.total(req, res, db(`${tableNames.ARTICLE}`));
  let result = await pagination.query(req, res, db(`${tableNames.ARTICLE}`)
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
  let data = await new Model(req.body, req.method, db(tableNames.ARTICLE));
  if(req.file){
    data.image = req.file.filename;
  }

  if(data.datePublished) data.datePublished = moment(data.datePublished).toDate();

  if(data.referenceId){
    let reference = await db(tableNames.ARTICLE).where({id: data.referenceId}).first();
    data.isPublished = reference.isPublished;
    data.publishedBy = reference.publishedBy;
    data.datePublished = reference.datePublished;
    data.image = reference.image;
  }

  let resultId = await db(tableNames.ARTICLE)
    .returning('id')
    .insert(data);

  resultId = resultId[0];

  if(req.body.content){
    let detailsData = await new ModelDetails(req.body, req.method, db(tableNames.ARTICLE_DETAILS));
    detailsData.articleId = resultId;
    await db(tableNames.ARTICLE_DETAILS).insert(detailsData);
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

  let item = await db(tableNames.ARTICLE)
    .where({id})
    .select('*')
    .first();
  
  if(!item) throw new apiError(message.notFound, 404);
  if(data.datePublished) data.datePublished = moment(data.datePublished).toDate();
  let _update = _.merge(item, data);

  if(data.isPublished) {
    // _update.datePublished = new Date();
    _update.publishedBy = req.user.username;
  }

  await db(tableNames.ARTICLE)
    .where({id})
    .update(_update); 

  if(content){
    await db(tableNames.ARTICLE_DETAILS)
      .where('articleId', id)
      .update({content})
  }

  await db(tableNames.ARTICLE)
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
  await db(tableNames.ARTICLE)
    .where({id: req.params.id})
    .del()

  await db(tableNames.ARTICLE)
    .where({referenceId: req.params.id})
    .del()

  await db(tableNames.ARTICLE_DETAILS)
    .where({articleId: req.params.id})
    .del()

  return 'success';
})