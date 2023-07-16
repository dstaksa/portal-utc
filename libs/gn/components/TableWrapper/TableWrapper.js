
import React from 'react';
import { Table, Icon, Button, Dropdown, Menu } from 'antd';
import './TableWrapper.sass';

class TableWrapper extends React.Component{
  constructor(){
    super();
    this.state = {
      scrollHeight: 0 ,
      scrollWidth: 0,
      isFixedColumn: false
    }
  }

  componentWillMount(){
    let { pagination } = this.props;
    this.pagination = pagination;
    
    if(this.pagination){
      this.pagination.showTotal = total => (`Total ${total} items`)
    }
  }

  componentDidMount(){
    setTimeout(() => {
      const element = document.getElementById(this.props.baseId);
      const { columns } = this.props;
      const isFixedColumn = columns.filter( d => (d.fixed)).length > 0 ? true : false;
      let scrollWidth = columns.reduce((a, b) => ((a.width || 200) + (b.width || 200)))*this.props.widthMultiplier;
      
      this.setState({
        scrollHeight:element.clientHeight - (116),
        scrollWidth: scrollWidth > element.clientWidth ? scrollWidth : element.clientWidth,
        isFixedColumn
      });
    })
  }

  render(){
    let { scrollHeight, scrollWidth, isFixedColumn } = this.state;
    let { baseId, fixedRightWidth, columns, pagination, showIndex, actions, isFixedHeader=true, ...tableProps} = this.props;
    let pushActions = ( actions.length > 0 ? {
      title: 'Aksi',
      key: `table-wrapper-actions-${baseId}`,
      width: 64,
      fixed: 'right',
      render: (___, item) => (
        <Dropdown
          trigger={['click']}
          overlay={
            <Menu>
              {actions.filter( a => [undefined, null, true].indexOf(a.show) >= 0).map(a => (
                <Menu.Item 
                  key={`action-${baseId}-${a.label}`}
                  onClick={() => a.onClick(item)}
                >
                  {a.icon ? <Icon type={a.icon}/> : null}
                  <span>{a.label}</span>
                </Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button style={{width: 36, padding: 0}}>
            <Icon type="menu"/>
          </Button>
        </Dropdown>
      )
    } : [])

    return(
      <div 
        id={baseId} 
        style={{position: 'relative'}}
        className={`gn-table-wrapper gn-full full-width ${isFixedHeader ? 'full-height' : ''}`}
      >
        <div 
          style={{position: isFixedHeader ? 'absolute' : 'relative'}}
          className={`gn-full full-width ${isFixedHeader ? 'full-height' : ''}`}
        >
          <Table 
            {...tableProps}
            pagination={this.props.pagination}
            columns={ showIndex ? [{
              title: 'Idx',
              key: 'index',
              width: 56,
              fixed: isFixedHeader ? 'left' : false,
              render: (___, ____, index) => (
                <div className="gn-align text-right">
                  {index+((pagination ? (
                    (((pagination.page || 1) - 1) * (pagination.pageSize || 0)) + 1
                  ) : 1))}
                </div>
              )
            }, ...this.props.columns, pushActions] : [...this.props.columns, pushActions]}
            scroll={ isFixedHeader ? (isFixedColumn ? { y: scrollHeight, x: scrollWidth} : {y: scrollHeight}) : (
              isFixedColumn ? {x: scrollWidth} : {}
            )} 
          />
        </div>
      </div>
    )
  }
}

TableWrapper.defaultProps = {
  baseId: 'gn-table-wrapper',
  fixedRightWidth: 0,
  widthMultiplier: 3.4,
  showIndex: true,
  actions: []
}

export default TableWrapper;