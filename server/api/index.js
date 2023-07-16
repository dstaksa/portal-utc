import user from './user';
import role from './role';
import article from './article';
import banner from './banner';
import event from './event';
import bannerAbout from './banner-about';
import homeHeadline from './home-headline';
import partner from './partner';
import serviceCatalogueIntro from './service-catalogue-intro';
import serviceCatalogueFile from './service-catalogue-file';
import mail from './mail';

export default (app) => {
  app.use('/api/user', user.router(app.db));
  app.use('/api/role', role.router(app.db));
  app.use('/api/article', article.router(app.db));
  app.use('/api/banner', banner.router(app.db));
  app.use('/api/banner-about', bannerAbout.router(app.db));
  app.use('/api/event', event.router(app.db));
  app.use('/api/home-headline', homeHeadline.router(app.db));
  app.use('/api/partner', partner.router(app.db));
  app.use('/api/service-catalogue-intro', serviceCatalogueIntro.router(app.db));
  app.use('/api/service-catalogue-file', serviceCatalogueFile.router(app.db));
  app.use('/api/mail', mail.router(app.db));
}