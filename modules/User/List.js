import React from 'react';
import { inject, observer } from 'mobx-react';
import service from './service';
import { TableWrapper } from '../../libs/gn/components';
import moment from 'moment';
import { Button, Divider, Dropdown, Menu, Icon, Tag } from 'antd';
import { httpService } from '../../libs/gn';

class UserList extends React.Component{
  componentDidMount(){
    this.props.fetchData(service.path);
  }

  render(){
    const table = (
      <TableWrapper
        rowKey="id"
        dataSource={this.props._state.data}
        total={this.props.queryStore.query.total}
        columns={[
          {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            fixed: 'left'
          },
          {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 180,
          },
          {
            title: 'Role',
            dataIndex: 'role.name',
            key: 'roleName',
            width: 180,
            render: (roleName) => (
              <Tag>{roleName}</Tag>
            )
          },
          {
            title: 'Dibuat Pada',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            width: 200,
            render: (dateCreated) => (
              <span className="gn-font-size-S">
                {moment(dateCreated).format('DD MMMM YYYY hh:mm')}
              </span>
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
                          case 'delete':
                            this.props.onDeleteItem(record.name, 'user', {id: record.id}, () => {
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

export default inject('authStore')(observer(UserList));