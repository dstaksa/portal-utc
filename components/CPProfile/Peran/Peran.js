import React from 'react';
import renderHTML from 'react-render-html';
import { inject, observer } from 'mobx-react';
import { SectionLabel } from '../../Section';

class Peran extends React.Component{
  constructor(){
    super();
  }

  render(){
    let { t } = this.props;
    return(
      <div className="content">
        <div className="text-judul">
          <SectionLabel 
            label={t('common:menu.peran')} 
            style={{
              fontSize: '36px'
            }}
            showLine={false}
          />
        </div>
        <center><hr/></center>
        <div className="text-content">
          Inovasi dan efisiensi terus dituntut dari setiap lini operasi Pertamina. Aspirasi untuk meraih ketahanan energi
          bagi negeri, dikombinasikan dengan tanggung jawab Pertamina sebagai perusahaan energi nasional yang
          terintegrasi, menjadi fondasi untuk terus memperkuat tiap lini dengan peran-peran yang strategis. <br/>
          Dari masa ke masa, UI terus berinovasi dan adaptif terhadap kebutuhan perusahaan di tengah tantangan
          yang dinamis. Peran UI difokuskan untuk mendukung kegiatan eksplorasi dan produksi melalui 6 peran
          strategis berupa: <br/>
          <ol>
            <li>Strategi, rencana & porfolio kegiatan inovasi
 dan pengembangan teknologi upstream (baik
 untuk teknologi existing maupun baru) di bidang
 exploration, subsurface development, drilling, well,
 production & projects di lingkungan PHE dan AP PHE.
            </li>
            <li>Melaksanakan pilot program untuk penerapan
 teknologi baru untuk diterapkan di jenjang
 bisnis Hulu yang relevan.
            </li>
            <li>Membentuk kerjasama dengan technical
 provider dan research center untuk
 mengembangkan teknologi yang dapat diterapkan di bisnis Hulu.
            </li>
            <li>Melaksanakan penerapan digitalisasi, meliputi
 teknologi big data analytics, machine learning
dan artificial intelligence.
            </li>
            <li>Pengelolaan Upstream Cloud System &
 Upstream Data Center (Service Operasional
Khusus di PDA).
            </li>
            <li>Kegiatan Technical Advisory untuk pemecahan
masalah dan dukungan teknologi Upstream di
 Direktorat Hulu dan APH Pertamina.
            </li>
          </ol>
        </div>
      </div>
    )
  }
}

export default Peran;