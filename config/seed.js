import { makeSalt, encryptPassword } from '../server/auth/auth.service';
import * as constant from './constant';
import { loremIpsum } from 'lorem-ipsum';

const salt = makeSalt();

export const roles = [
  {name: constant.roles.SUPER_ADMIN, id: 1},
]

export const users = [
  {
    id: 1,
    username: 'super_admin',
    name: 'Super Admin',
    email: 'admin.utc@pertamina.com',
    contact: '000000000000',
    salt, hashedPassword: encryptPassword('cikan', salt),
    roleId: 1,
    dateCreated: new Date(),
    createdBy: 'system',
    dateModified: new Date(),
    modifiedBy: 'system'
  }
]

export const banners = [
  {
    id: 1,
    title: 'UTC is driven to expand',
    description: 'To expand its technical services and capabilities in the endeavor of supporting Pertamina’s exploration and production activities.',
    image: 'default-banner-bg.jpg',
    actionLabel: 'Tentang UTC',
    actionUrl: '/',
    lang: 'id',
    isPublished: true,
    publishedBy: 'system',
    createdBy: 'system',
    datePublished: new Date(),
    dateCreated: new Date()
  }
]

export const bannerAbouts = [
  {
    id: 1,
    label: 'Tentang UTC',
    description: 'UTC kini memiliki peran yang lebih strategis untuk meningkatkan kontribusi secara nyata dalam mendukung seluruh kegiatan operasional hulu',
    lang: 'id',
    isPublished: true,
    publishedBy: 'system',
    createdBy: 'system',
    datePublished: new Date(),
    dateCreated: new Date()
  }
]

export const homeHeadlines = [
  {
    id: 1,
    label: 'Peran Strategis',
    description: 'Inovasi dan e siensi terus dituntut dari setiap lini operasi kami. Aspirasi Indonesia untuk maraih Keamanan dan Ketahanan Energi, dikombinasikan dengan tanggung jawab Pertamina sebagai perusahaan energi nasional yang terintegrasi, menjadi fondasi peran UTC.',
    image: 'default-about.png',
    actionLabel: 'Selengkapnya',
    actionUrl: '/',
    isPublished: true,
    publishedBy: 'system',
    createdBy: 'system',
    datePublished: new Date(),
    dateCreated: new Date()
  }
]

export const serviceCatagloueIntros = [
  {
    id: 1,
    title: 'Kata Pengantar<br/>Direktur Hulu',
    speaker: 'Dharmawan H. Samsu',
    description: 'Upstream Technical Center (UTC) merupakan unit organisasi di Direktorat Hulu Pertamina yang memiliki peran menunjang keberhasilan operasi dan produksi migas bagi seluruh komponen Anak Perusahaan Hulu (APH), melalui dukungan expertise/keahlian di bidang Geologi, Geo sika, Reservoir & EOR, Production, Drilling, Geomatika dan Petrotechnical.',
    isPublished: true,
    publishedBy: 'system',
    createdBy: 'system',
    datePublished: new Date(),
    dateCreated: new Date()
  },
  {
    id: 2,
    title: 'Sambutan<br/>Vice President',
    speaker: 'Ricky Adi Wibowo',
    description: 'Sejalan dengan tuntutan profesionalisme dalam memberikan dukungan jasa technical service/advisory yang tepat guna, efektif dan berkualitas kepada Anak Perusahaan Hulu, maka kami menerbitkan Technical Service/Advisory Catalogue Upstream Technical Center.',
    isPublished: true,
    publishedBy: 'system',
    createdBy: 'system',
    datePublished: new Date(),
    dateCreated: new Date()
  }
]