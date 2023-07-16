import { observable, decorate, action } from 'mobx'; 

class AuthStore {
  constructor(initialData={}){
    this.user = initialData.user;
    this.isLoggedIn = initialData.user ? true : false
  }

  setUser(user=null){
    this.user = user;
    this.isLoggedIn = user ? true : false;
  }
}

decorate(AuthStore, {
  user: observable,
  isLoggedIn: observable,
  setUser: action
})

export default AuthStore;