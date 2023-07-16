import React from 'react';
import renderHTML from 'react-render-html';
import { inject, observer } from 'mobx-react';
import { SectionLabel } from '../../Section';

class Visimisi extends React.Component{
  constructor(){
    super();
  }

  render(){
    let { t } = this.props;
    return(
      <div className="content">
        <div className="text-judul">
          <SectionLabel 
            label={t('common:menu.visimisi')} 
            label2={"UPSTEAM INNOVATION"}
            style={{
              fontSize: '36px'
            }}
            showLine={false}
          />
        </div>
        <center><hr/></center>
        <div className="text-content">
          Visi dan misi UI menjadi panduan bagi seluruh unit kerja, dalam menyusun perencanaan strategis maupun eksekusi kegiatan operasional guna
          menghasilkan kontribusi nyata bagi Pertamina secara keseluruhan. Sejalan dengan tahapan akselerasi transformasi digital Pertamina, UI memiliki
          fokus pada pengembangan solusi digital secara dengan mengintegrasikan
          berbagai keahlian yang dimilikinya.
        </div>
        <div className="mini-title-normal">
          VISI
        </div>
        <div className="text-content">
          Menjadi Center of Excellence in upstream Innovation yang mewujudkan proses, teknologi dan SDM energi berkelas dunia.
        </div>
        <div className="mini-title-normal">
          MISI
        </div>
        <div className="text-content">
          <ul>
            <li> Membangun inovasi dalam bentuk teknologi maupun studi secara bekelanjutan untuk mendukung pencapaian objektif strategis Pertamina.
            </li>
            <li> Mengembangkan dan mengimplementasi solusi teknologi dan inovasi energi secara end-to-end dan tepat guna Membangun Pertamina Upstream Data Center dan kapabilitas digital secara terintegrasi dan mutakhir
            </li>
            <li> Mendukung pengembangan kapabilitas dan kompetensi SDM dalam lingkup usaha Pertamina
            </li>
            <li> Mengembangkan Strategic Initiatives yang tepat guna
            </li>              
            <li> Melaksanakan pengelolaan kegiatan KSI secara berkelanjutan
            </li>
            <li> Memberikan layanan terbaik untuk setiap user terhadap solusi dan inovasi teknologi yang diberikan
            </li>
            <li> Mengembangkan setiap individu di UI agar senantiasa berkembang
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Visimisi;