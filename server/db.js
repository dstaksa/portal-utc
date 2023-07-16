import knex from 'knex';
import { tableNames } from '../config/constant.js';
import * as seed from '../config/seed';
import env from '../config/environment';

export default async (app, callback) => {
  //SQL Connection
  const db  = knex(env.dbOptions);
  const createTable = () => {
    return new Promise ( async (resolve, reject) => {
      if(env.initDb.createTable){
        try{
          //Role
          db.schema.hasTable(tableNames.ROLE).then( exists => {
            if(!exists) {
              return db.schema.createTable(tableNames.ROLE, table => {
                table.increments();
                table.string('name', '16').notNullable().unique().index('ld_role_name');
                table.boolean('isActive').defaultTo(true);
              })
            }
          })

          //User
          db.schema.hasTable(tableNames.USER).then( exists => {
            if(!exists) {
              return db.schema.createTable(tableNames.USER, (table) => {
                table.increments();
                table.string('name', 120).notNullable();
                table.string('username', 16).notNullable().unique().index('ld_usr_username');
                table.string('address', 1000);
                table.string('email', 60);
                table.string('contact', 16);
                table.string('salt', 120).notNullable();
                table.string('hashedPassword', 120).notNullable();
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.integer('roleId')
                  .notNullable()
                  .unsigned()
                  .references('id')
                  .inTable(tableNames.ROLE);
                table.boolean('isActive').defaultTo(true);

                // table.foreign('roleId').references('id').inTable(tableNames.ROLE);
              })
            }
          })

          //Article
          db.schema.hasTable(tableNames.ARTICLE).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.ARTICLE, (table) => {
                table.increments();
                table.string('title', 120).notNullable().index('ld_art_title');
                table.string('description', 640).notNullable();
                table.string('image', 64);
                table.string('caption', 120);
                table.string('slug', 24).notNullable().index('ld_art_slug');
                table.string('location', 24);
                table.string('publisher');
                table.string('author', 36);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          db.schema.hasTable(tableNames.ARTICLE_DETAILS).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.ARTICLE_DETAILS, (table) => {
                table.increments();
                table
                  .integer('articleId')
                  .notNullable()
                  .unsigned()
                  .index('ld_art_id')
                  .references(tableNames.ARTICLE);
                table.string('content', 4000);
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');

                // table.foreign('articleId').references('id').inTable(tableNames.ARTICLE);
              })
            }
          })
          

          //Banner
          db.schema.hasTable(tableNames.BANNER).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.BANNER, (table) => {
                table.increments();
                table.string('title', 60).index('ld_bnr_title');
                table.string('description', 1000);
                table.string('image', 72).notNullable();
                table.string('caption', 120);
                table.string('actionLabel', 120);
                table.string('actionUrl', 120);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          //Home Headline
          db.schema.hasTable(tableNames.BANNER_ABOUT).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.BANNER_ABOUT, (table) => {
                table.increments();
                table.string('label', 32).notNullable().index('ld_bnr_abt_lbl');
                table.string('description', 640).notNullable();
                table.string('actionLabel', 16);
                table.string('actionUrl', 120);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          //Home Headline
          db.schema.hasTable(tableNames.HOME_HEADLINE).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.HOME_HEADLINE, (table) => {
                table.increments();
                table.string('label', 32).notNullable().index('ld_hdln_lab');
                table.string('description', 640).notNullable();
                table.string('image', 120);
                table.string('caption', 120);
                table.string('actionLabel', 16);
                table.string('actionUrl', 120);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          //Partner
          db.schema.hasTable(tableNames.PARTNER).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.PARTNER, (table) => {
                table.increments();
                table.string('name', 120).notNullable().index('ld_ptnr_name');
                table.string('description', 640).notNullable();
                table.string('image', 120);
                table.string('caption', 120);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          //Partner Details
          db.schema.hasTable(tableNames.PARTNER_DETAILS).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.PARTNER_DETAILS, (table) => {
                table.increments();
                table
                  .integer('partnerId')
                  .notNullable()
                  .unsigned()
                  .index('ld_ptnr_det_id')
                  .references('id')
                  .inTable(tableNames.PARTNER);
                table.string('criteria', 64);
                table.string('channel', 64);
                table.string('imageDetails', 120);
                table.string('interviewees', 36);
                table.string('position', 24);
                table.string('testimonial', 64);
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');

                // table.foreign('partnerId').references('id').inTable(tableNames.PARTNER);
              })
            }
          })

          //Service Catalogue File
          db.schema.hasTable(tableNames.SERVICE_CATALOGUE_FILE).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.SERVICE_CATALOGUE_FILE, (table) => {
                table.increments();
                table.string('description', 640).notNullable();
                table.string('fileName', 120);
                table.string('originalFileName', 120);
                table.string('mimeType', 24);
                table.boolean('isPublished').defaultTo(false);
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          //Service Catalogue Intro
          db.schema.hasTable(tableNames.SERVICE_CATALOGUE_INTRO).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.SERVICE_CATALOGUE_INTRO, (table) => {
                table.increments();
                table.string('title', 120).notNullable().index('ld_svc_cat_in_ttl');
                table.string('description', 640).notNullable();
                table.string('image', 120);
                table.string('caption', 120);
                table.string('speaker', 32);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');
                table.dateTime('datePublished');
              })
            }
          })

          //Soclial Media Channel;
          db.schema.hasTable(tableNames.SOCIAL_MEDIA_CHANNEL).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.SOCIAL_MEDIA_CHANNEL, (table) => {
                table.increments();
                table.string('name', 120).notNullable().unique().index('ld_sm_name');
                table.string('iconClassName').notNullable();
                table.string('url', 120);
                table.boolean('isPublished').defaultTo(false);
                table.string('createdBy', 16);
                table.string('publishedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('datePublished');
              })
            }
          })

          //Soclial Media Channel;
          db.schema.hasTable(tableNames.EVENT).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.EVENT, (table) => {
                table.increments();
                table.string('title', 120).notNullable().index('ld_evt_ttl');
                table.string('description', 640).notNullable();
                table.string('image', 120);
                table.string('caption', 120);
                table.string('location', 48);
                table.boolean('isPublished').defaultTo(false);
                table.string('lang', 2).defaultTo('id');
                table.string('organizer', 120);
                table.integer('referenceId');
                table.string('createdBy', 16);
                table.string('publishedBy', 16);
                table.string('modifiedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('datePublished');
                table.dateTime('dateModified');
                table.dateTime('dateStart');
                table.dateTime('dateEnd');
              })
            }
          })

          db.schema.hasTable(tableNames.EVENT_DETAILS).then( exists => {
            if(!exists){
              return db.schema.createTable(tableNames.EVENT_DETAILS, (table) => {
                table.increments();
                table.integer('eventId')
                  .unsigned()
                  .notNullable()
                  .index('ld_evt_det_id')
                  .references('id')
                  .inTable(tableNames.EVENT);
                table.string('content', 4000);
                table.string('createdBy', 16);
                table.string('modifiedBy', 16);
                table.dateTime('dateCreated');
                table.dateTime('dateModified');

                // table.foreign('eventId').references('id').inTable(tableNames.EVENT);
              })
            }
          })
          
          console.log('Setup DB has been completed')
          setTimeout(resolve, 5000);
        }catch(error){
          reject(error);
        }
      } else {
        resolve();
      }
    })
  }

  //SEED DB
  const populate = () => {
    return new Promise(async (resolve, reject) => {
      if(!env.initDb.populate) resolve();
      try{
        console.log('Start populate database ...')
        for(let t of [
          {name: tableNames.ROLE, seed: seed.roles},
          {name: tableNames.USER, seed: seed.users},
          {name: tableNames.BANNER, seed: seed.banners},
          {name: tableNames.BANNER_ABOUT, seed: seed.bannerAbouts},
          {name: tableNames.HOME_HEADLINE, seed: seed.homeHeadlines},
          {name: tableNames.SERVICE_CATALOGUE_INTRO, seed: seed.serviceCatagloueIntros}
        ]){
          let total = await db(t.name).count('* as count').first();
          if(Number(total.count) === 0){
            await db(t.name).insert(t.seed).catch( e => {
              console.log(e);
              return e
            });
          }
        }
        resolve();
      }catch(error){
        reject(error);
      }
    })
  }

  const initTable = async () => {
    try{
      await createTable();
      await populate();
    }catch(error){
      console.log(error)
    }
  }

  app.db = db;
  initTable();
  callback();
}