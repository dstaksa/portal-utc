import React from 'react';
import renderHTML from 'react-render-html';
import { inject, observer } from 'mobx-react';
import { Icon } from 'antd';
import { SectionLabel } from '../../Section';

class Profile extends React.Component{
  constructor(){
    super();
  }

  render(){
    let { t } = this.props;
    return(
      <div className="content">
        <div className="text-judul">
          <SectionLabel 
            label={t('common:menu.profile')} 
            style={{
              fontSize: '36px'
            }}
            showLine={false}
          />
        </div>
        <center><hr/></center>
        <div className="text-content">
          Dalam upaya memenuhi ketahanan energi bangsa, Pertamina sebagai perusahaan energi milik negara
          dituntut untuk terus berkembang dan berinovasi dalam semua tahapan bisnis yang dilakukan. Hal ini bertujuan agar Pertamina akan terus memperkuat kontribusinya pada sektor energi Indonesia.
<br/><br/>
          Upstream Innovation (UI), salah satu fungsi strategis Subholding Upstream hadir sebagai Center of Excellence
          in Upstream Innovation yang berperan mengembangkan berbagai inovasi bagi peningkatan performa
          kegiatan eksplorasi dan produksi energi.<br/>
          UI senantiasa berkontribusi dan menghadirkan inovasi bagi seluruh unit usaha dalam lingkup PHE sebagai
          subholding dan Pertamina (Persero) sebagai holding.<br/><br/>

          UI terus berkembang seiring tantangan digital yang kian bertransformasi dengan cepat, serta untuk
          menjawab tantangan industri yang menuntut efisiensi dan produktivitas. Sejalan dengan tahapan akselerasi
          transformasi digital Pertamina, UI fokus mengembangkan transformasi digital secara holistik, fleksibilitas
          advanced solution, user-push untuk aplikasi general, dan kemitraan sehingga tercipta koneksi antara lapangan
          dan back-office yang harmonis.
        </div>
      </div>
    )
  }
}

export default Profile;