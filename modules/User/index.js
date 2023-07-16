import List from './List';
import service from './service';
import Form from './Form';

class User{
  constructor(){
    this.List = List;
    this.Form = Form;
    this.service = service;
  }
}

export default new User();