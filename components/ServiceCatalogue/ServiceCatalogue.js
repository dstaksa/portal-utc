import React from 'react';
import './ServiceCatalogue.less';
import { SectionLabel, SectionBody } from '../Section';
import { Button, Icon } from 'antd';
import * as scroll from 'react-scroll';

const scroller = scroll.animateScroll;

const ServiceCatalogue = ({value, catalogueFile, t}) => (
  <div 
    id="utc-service-catalogue"
    className="utc-service-catalogue gn-padding-L padding-top padding-bottom"
  >
    <SectionLabel 
      label={t('common:menu.serviceCatalogue')} 
      inverse={true}
      style={{
        textAlign: 'center'
      }}
    />
    <div className="gn-layout align-center justify-between gn-full full-height" style={{marginLeft:"10%", marginRight:"10%"}}>
      { catalogueFile ? (
        <div className={`catalogue-item gn-padding-M padding-all`}> 
          <Button type="primary"
            onClick={() => window.open(`/api/service-catalogue-file/public/download/${catalogueFile.id}`)}
          >
            <Icon type="file-pdf"/>
            {t('common:other.serviceDownload')}
          </Button>
        </div>
      ) : null }
      <div className={`catalogue-item gn-padding-M padding-all`}>
      <Button 
        className="gn-margin-S margin-left"
        type="primary"
        onClick={() => {

        }}
      >
        {t('common:other.serviceList')}
      </Button>
      </div>
    </div>
    <div className="gn-layout align-center justify-between gn-full" style={{marginLeft:"10%", marginRight:"10%"}}>
      { catalogueFile ? (
        <div className={`catalogue-item gn-padding-M padding-all`} style={{height:"400px"}} > 
          <div style={{textAlign:'justify',color:'white',verticalAlign:'top'}}>
          {t('common:service.descTeknis')}<br/>
          {t('common:service.descTeknisa')}<br/>
          {t('common:service.descTeknisb')}<br/>
          {t('common:service.descTeknisBottom')}
          </div>
        </div>
      ) : null }
      <div className={`catalogue-item gn-padding-M padding-all`} style={{height:"400px"}}>
        <div style={{textAlign:'justify',color:'white',verticalAlign:'top'}}>
          {t('common:service.descSolusi')}<br/>
        </div>
      </div>
    </div>
  </div>
) 

ServiceCatalogue.defaultProps = {
  value: []
}

export default ServiceCatalogue;