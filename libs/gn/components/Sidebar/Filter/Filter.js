import React from 'react';
import { Divider, Input, Select, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import Hint from '../../Hint/Hint';

class Filter extends React.Component{
  constructor(props){
    super(props);
    this.state={isLoading: false}
    let { defaultOrder, defaultOrderBy, defaultSearchColumn, queryStore } = props;
    if(defaultOrder) queryStore.setQuery('order', defaultOrder);
    if(defaultOrderBy) queryStore.setQuery('orderBy', defaultOrderBy);
    if(defaultSearchColumn) queryStore.setQuery('column', defaultSearchColumn);
  }

  onSubmit = e => {
    this.setState({isLoading: true});
    e.preventDefault();
    e.stopPropagation();
    this.props.onSubmit()
  }

  render(){
    let { columns, queryStore } = this.props;
    const filter = (
      <div className="gn-margin-N margin-bottom">
        <Divider className="gn-font-size-S" orientation="left">Filter</Divider>
        <Hint 
          className="gn-margin-S margin-bottom"
          text="Pilih kolom dan ketikan kata kunci yang akan dicari"
        />
        <Select
          className="gn-full full-width gn-margin-S margin-bottom"
          placeholder="Fiield yang dicari"
          value={queryStore.query.column}
          onChange={ value => queryStore.setQuery('column', value)}
        >
          { columns.filter( col => (col.searchable)).map((col, i) => (
            <Select.Option 
              key={`filter-column-${i}`}
              value={col.value}
            >
              {col.label}
            </Select.Option>
          ))}
        </Select>
        <Input.Search
          className="gn-margin-S margin-bottom"
          placeholder="Ketik kata kunci"
          defaultValue={queryStore.query.keyword}
          onChange={ e => {queryStore.setQuery('keyword', e.target.value)}}
        />
      </div>
    )

    const order = (
      <div className="gn-margin-N margin-bottom">
        <Divider className="gn-font-size-S" orientation="left">Order</Divider>
        <Select
          className="gn-full full-width gn-margin-S margin-bottom"
          placeholder="Order By"
          value={queryStore.query.orderBy}
          onChange={ value => queryStore.setQuery('orderBy', value)}
        >
          { columns.filter( col => (col.sortable)).map((col, i) => (
            <Select.Option 
              key={`filter-column-${i}`}
              value={col.value}
            >
              {col.label}
            </Select.Option>
          ))}
        </Select>
        <Select 
          className="gn-full full-width gn-margin-S margin-bottom"
          placeholder="order"
          value={queryStore.query.order}
          onChange={ value => queryStore.setQuery('order', value)}
        >
          {[
            {label: 'Ascending', value: 'asc'},
            {label: 'Descending', value: 'desc'}
          ].map( order => (
            <Select.Option
              key={`order-${order.value}`}
              value={order.value}
            >
              {order.label}
            </Select.Option>
          ))}
        </Select>
      </div>
    )

    return(
      <div className="flex">
        <form 
          className="gn-layout direction-column layout-fit"
          onSubmit={this.onSubmit}
        >
          <div className="flex scrollable">
            {filter}
            {order}
          </div>
          <div className="flex-none">
            <Button 
              block type="primary" ghost
              htmlType="submit" loading={queryStore.isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

Filter.defaultProps = {
  columns:[],
  onSubmit: () => {}
}

export default inject('queryStore')(observer(Filter));