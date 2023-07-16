import React from 'react';
import manage from '../ptemplates/manage';
import Partner from '../modules/Partner';
import { Sidebar } from '../libs/gn';
import { Divider } from 'antd';

class ManagePartner extends React.Component{
  render(){
    return(
      <div className="gn-layout gn-full full-height">
        <Sidebar className="flex-none">
          <Sidebar.Actions.Add
            onClick={this.props.onShowForm}
          />
          <Sidebar.Filter
            defaultSearchColumn='name'
            columns={[
              {
                label: 'Nama',
                value: 'name',
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
            onSubmit={() => this.props.fetchData(Partner.service.path)}
          />
        </Sidebar>
        <Divider type="vertical" className="gn-full full-height flex-none gn-margin-NONE margin-all"/>
        <Partner.List {...this.props}/>
        <Partner.Form 
          visible={this.props._state.showForm}
          onCancel={this.props.onHideForm}
          onSuccess={this.props.onAddItem}
          value={this.props._state.selectedItem}
        />
      </div>
    )
  }
}

export default manage(ManagePartner);