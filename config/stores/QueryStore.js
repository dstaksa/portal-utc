import { action, observable, decorate } from 'mobx';
import _ from 'lodash';

const defaultQuery = () => ({
  page: 1,
  size: 20,
  keyword: '',
  column: '',
  order: 'desc',
  orderBy: 'dateCreated',
  total: 0
})

class QueryStore{
  constructor(query=defaultQuery(), isLoading=false){
    this.query = query;
    this.isLoading = isLoading;
  }
  
  setQuery(key, value){
    this.query[key] = value;
  }

  setLoading(isLoading){
    this.isLoading = isLoading;
  }

  addDataItem(data, item){
    if(this.query.order === 'desc') data.unshift(item);
    else data.push(item);
    return data;
  };
  updateDataItem(data, selector, update){
    let _item = _.find(data, selector);
    if(_item) data.splice(data.indexOf(_item), 1, update);
    return data;
  }
  removeDataItem(data, selector){
    let _item = _.find(data, selector);
    if(_item) data.splice(data.indexOf(_item), 1);
    return data;
  }
}

decorate(QueryStore, {
  query: observable,
  isLoading: observable,
  setQuery: action,
  setLoading: action,
  fetch: action ,
  addDataItem: action
})

export default QueryStore;