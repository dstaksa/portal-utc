import _ from 'lodash';

const dataService = {
  updateItemInArray:(dataArray, selector, update, upsert = false) => {
    let _item = _.find(dataArray, selector);
    if(_item) {
      dataArray.splice(dataArray.indexOf(_item), 1, update);
    } else{
      if(upsert) dataArray.unshift(update);
    }
  },
  deleteItemInArray:(dataArray, selector) => {
    let _item = _.find(dataArray, selector);
    if(_item) dataArray.splice(dataArray.indexOf(_item), 1);
  }
}

export default dataService;