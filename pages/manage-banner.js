import React from 'react';
import manage from '../ptemplates/manage';
import Banner from '../modules/Banner';
import { Sidebar } from '../libs/gn';
import { Divider } from 'antd';

class ManageBanner extends React.Component{
  render(){
    return(
      <div className="gn-layout gn-full full-height">
        <Sidebar className="flex-none">
          <Sidebar.Actions.Add
            onClick={this.props.onShowForm}
          />
          <Sidebar.Filter
            defaultSearchColumn='title'
            columns={[
              {
                label: 'Judul',
                value: 'title',
                searchable: true,
                sortable: true
              },
              {
                label: 'Tanggal Dibuat',
                value: 'dateCreated',
                searchable: false,
                sortable: true 
              }
            ]}
            onSubmit={() => this.props.fetchData(Banner.service.path)}
          />
        </Sidebar>
        <Divider type="vertical" className="gn-full full-height flex-none gn-margin-NONE margin-all"/>
        <Banner.List {...this.props}/>
        <Banner.Form 
          visible={this.props._state.showForm}
          onCancel={this.props.onHideForm}
          onSuccess={this.props.onAddItem}
          value={this.props._state.selectedItem}
          lang={this.props._state.selectedLang}
        />
      </div>
    )
  }
}

export default manage(ManageBanner);