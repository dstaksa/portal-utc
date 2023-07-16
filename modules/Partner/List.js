import React from 'react';
import { inject, observer } from 'mobx-react';
import service from './service';
import { TableWrapper } from '../../libs/gn/components';
import moment from 'moment';
import { Button, Dropdown, Menu, Icon, Tag } from 'antd';

class PartnerList extends React.Component{
  componentDidMount(){
    this.props.fetchData(service.path);
  }

  render(){
    let { _state } = this.props;
    const table = (
      <TableWrapper
        rowKey="id"
        dataSource={_state.data}
        widthMultiplier={2.8}
        total={this.props.queryStore.query.total}
        columns={[
          {
            title: 'Publikasi',
            dataIndex: 'isPublished',
            key: 'isPublished',
            width: 120,
            fixed: 'left',
            render: (isPublished, record) => (
              <Tag 
                color={isPublished ? 'green' : 'grey'}
                onClick={() => this.props.onPublishItem(record, (publishData) => {
                  return service.put(publishData);
                })}
              >
                {isPublished ? 'published' : 'draft'}
              </Tag>
            )
          },
          {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            fixed: 'left'
          },
          {
            title: 'Gambar',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: image => (
              image ? (
                <img 
                  src={`${_state.staticHost}/${image}`} 
                  style={{height: 64, width: 64, objectFit: 'cover'}}
                />
              ) : <div className="gn-text-align-CENTER">-</div>
            )
          },
          {
            title: 'Dibuat Pada',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            width: 200,
            render: dateCreated => (
              moment(dateCreated).format('DD MMMM YYYY hh:mm')
            )
          },
          {
            title: 'Dibuat Oleh',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 180,
          },
          {
            title: 'Operasi',
            key: 'operation',
            width: 160,
            fixed: 'right',
            render: (text, record) => (
              <div className="gn-layout align-center">
                <Dropdown 
                  overlay={
                    <Menu
                      onClick={ e => {
                        switch(e.key){
                          case 'edit':
                            this.props.onShowForm(record);
                            break;
                          case 'delete':
                            this.props.onDeleteItem(record.name, 'partner', {id: record.id}, () => {
                              return new Promise(async (resolve, reject) => {
                                try{
                                  await service.delete(record.id);
                                  resolve()
                                }catch(error){
                                  reject(error)
                                }
                              })
                            })
                            break;
                        }
                      }}
                    >
                      <Menu.Item key="edit">
                        <Icon type="edit"/>
                        Edit
                      </Menu.Item>
                      <Menu.Item key="delete">
                        <Icon type="delete"/>
                        Hapus
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button>
                    <Icon type="menu" />
                  </Button>
                </Dropdown>
              </div>
            )
          }
        ]}
      />
    )
    return(
      <div className="gn-full full-width full-height">
        {table}
      </div>
    )
  }
}

export default inject('authStore')(observer(PartnerList));