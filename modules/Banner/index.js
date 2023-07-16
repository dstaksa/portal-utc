import List from './List';
import Form from './Form';
import service from '../User/service';

class Banner{
  constructor(){
    this.List = List;
    this.Form = Form;
    this.service = service;
  }
}

export default new Banner();