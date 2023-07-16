import React from 'react';
import renderHTML from 'react-render-html';
import { inject, observer } from 'mobx-react';
import Logo from '../../Logo';
import { SectionLabel } from '../../Section';

class Nilai extends React.Component{
  constructor(){
    super();
  }

  render(){
    let { t } = this.props;
    return(
      <div className="content">
        <div className="text-judul">
          <SectionLabel 
            label={t('common:menu.nilai')} 
            style={{
              fontSize: '36px'
            }}
            showLine={false}
          />
        </div>
        <center><hr/></center>
        <div className="text-content">
          Strategi dan solusi teknis yang disediakan oleh UI berlandaskan komitmen akan standar etika. Komitmen ini dengan teguh dijalankan oleh fungsi-fungsi bisnis di UI dalam setiap aktivitas dan operasinya.
        </div>
        <div className="mini-title-normal">VISIONARY
        </div>
        <div className="text-content">Berorientasi ke depan, berwawasan luas serta mampu mengantisipasi perubahan yang diperlukan untuk menjadi World Class E&P Technology Center.
        </div>
        <div className="mini-title-normal">EXCELLENCE
        </div>
        <div className="text-content">Menjaga standar yang terbaik dalam mengelola semua aspek usaha.
        </div>
        <div className="mini-title-normal">INTEGRITY
        </div>
        <div className="text-content">Mewujudkan komitmen secara bertanggung jawab dan konsisten
        </div>
        <div className="mini-title-normal">FOCUS
        </div>
        <div className="text-content">Bekerja untuk meraih tujuan bersama, mempunyai target spesifik yang konsisten terhadap core business.
        </div>
        <div className="mini-title-normal">MUTUAL RESPECT
        </div>
        <div className="text-content">Saling menghargai dan meminimalisir intervensi dalam melaksanakan setiap pekerjaan, serta saling mendukung.
        </div>
      <br/><center><Logo.LogoBiru/></center><br/>
      </div>
    )
  }
}

export default Nilai;