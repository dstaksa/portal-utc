import React from 'react';
import manage from '../ptemplates/manage';
import Event from '../modules/Event';
import { Sidebar } from '../libs/gn';
import { Divider } from 'antd';

class ManageEvent extends React.Component{
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
                label: 'Deskripsi',
                value: 'description',
                searchable: true,
                sortable: true 
              },
               {
                label: 'Slug',
                value: 'slug',
                searchable: true,
                sortable: true 
              },
              {
                label: 'Lokasi',
                value: 'location',
                searchable: true,
                sortable: true 
              },
              {
                label: 'Organizert',
                value: 'organizer',
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
            onSubmit={() => this.props.fetchData(Event.service.path)}
          />
        </Sidebar>
        <Divider type="vertical" className="gn-full full-height flex-none gn-margin-NONE margin-all"/>
        <Event.List {...this.props}/>
        <Event.Form 
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

export default manage(ManageEvent);