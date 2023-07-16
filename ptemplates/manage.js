import React from 'react';
import { Brand } from '../components';
import { inject, observer } from 'mobx-react';
import { Modal, notification, message } from 'antd'
import { Appbar, MenuOptions, httpService } from '../libs/gn'
import qs from 'query-string';
import { find } from 'lodash';

export default WrappedComponent => {
  class Wrapped extends React.Component{
    constructor(){
      super();
      this.state = {
        data: [],
        showForm: false,
        selectedItem: null,
        selectedLang: 'id',
        staticHost: ''
      }
    }

    fetchData = (url, queryParameter={}, config=null) => {
      setTimeout(() => {
        let { queryStore } = this.props;
          return new Promise(async (resolve, reject) => {
            queryStore.setLoading(true);
            let { query } = queryStore;
            let { staticHost } = this.state;
            query = _.merge(query, queryParameter);

            let finalQuery = {};
            for(let p of Object.keys(query)){
              if([null, undefined, ''].indexOf(query[p]) < 0)
                finalQuery[p] = query[p];
            }

            try{
              let options = httpService.generateRequestOptions(`${url}?${qs.stringify(finalQuery)}`, config);
              let res = await httpService.get(options);
              if(res.headers['x-static-host']) staticHost = res.headers['x-static-host'];
              queryStore.setQuery('total', Number(res.headers['x-pagination-count']));
              queryStore.setLoading(false);
              this.setState({
                data: res.data,
                staticHost
              })
              resolve(res)
            }catch(error){
              message.error(error.message);
              reject(error);
            }
          })
      })
    }

    onShowForm = (item = null, lang='id') => {
      this.setState({
        showForm: true,
        selectedItem: item,
        selectedLang: lang
      })
    }

    onHideForm = () => this.setState({
      showForm: false,
      selectedItem: null,
      selectedLang: 'id'
    })

    onAddItem = (item, isUpdate, name='ini', identifierName='Data') => {
      const { queryStore } = this.props;
      let data = isUpdate 
        ? queryStore.updateDataItem(this.state.data, {id: item.id}, item) 
        : queryStore.addDataItem(this.state.data, item);
      this.setState({data, showForm: false, selectedItem: null});
      notification.open({
        message: isUpdate ? 'Update Berhasil' : 'Berhasil',
        description: `${identifierName} ${name} berhasil ${isUpdate ? 'diperbaharui' : 'ditambahkan'}`
      })
    }

    onDeleteItem = (name='ini', identifierName='data', itemSelector, deletePromise) => {
      let {  queryStore } = this.props;
      Modal.confirm({
        title: 'Hapus',
        content: `Yakin akan menghapus ${identifierName} ${name}?`,
        okText: 'Ya',
        calcenText: 'Tidak',
        onOk: async () => {
          try{
            await deletePromise()
            let data = queryStore.removeDataItem(this.state.data, itemSelector);
            this.setState({data});
            notification.open({
              message: 'Hapus Berhasil',
              description: `Data ${identifierName} ${name} berhasil dihapus`
            })
          }catch(error){
            notification.open({
              message: 'Gagal',
              description: error.message
            })
          }
        }
      })
    }

    onPublishItem = async (item, updatePromise) => {
      const { queryStore } = this.props;
      try{
        let res = await updatePromise({
          id: item.id,
          isPublished: !item.isPublished
        });
        let data = queryStore.updateDataItem(this.state.data, {id: item.id}, res.data);
        this.setState({data});
      }catch(error){
        notification.open({
          message: 'Gagal',
          description: error.message
        })
      }
    }

    menuItems = () => {
      let { configStore, authStore } = this.props;
      let { user } = authStore;
      let hasPermission = (screenName) => {
        if(configStore.adAuthentication){
          let allowed = find(user.screen, {SCREEN_NAME: screenName});
          return allowed ? true : false;
        }else{
          return true;
        }
      }
      return [
        new MenuOptions.menuItem('user', 'User', this.props.isProduction ? '/manage/user' : '/manage-user', () => !configStore.adAuthentication),
        new MenuOptions.menuItem('font-size', 'Article', this.props.isProduction ? '/manage/article' : '/manage-article', () => (hasPermission('Article'))),
        new MenuOptions.menuItem('pic-center', 'Banner', this.props.isProduction ? '/manage/banner' : '/manage-banner', () => (hasPermission('Banner'))),
        new MenuOptions.menuItem('calendar', 'Event', this.props.isProduction ? '/manage/event' : '/manage-event', () => (hasPermission('Event'))),
        new MenuOptions.menuItem('file-pdf', 'File Katalog', this.props.isProduction ? '/manage/catalogue-file' : '/manage-file-catalogue', () => (hasPermission('Service Catalogue File'))),
        new MenuOptions.menuItem('home', 'Home', this.props.isProduction ? '/manage/home' : '/manage-home', () => (hasPermission('Home Headline'))),
        new MenuOptions.menuItem('retweet', 'Partner', this.props.isProduction ? '/manage/partner' : '/manage-partner', () => (hasPermission('Partner'))),
      ]
    }

    render(){
      return(
        <div className="gn-full full-viewport-width full-viewport-height gn-layout direction-column">
          <Appbar
            brand={
              <Brand
                applicationName="CMS Portal UTC"
                version="1.0.0"
                subname="Administrator"
                showUtcLettermark={false}
              />
            }
          />
          <div className="flex gn-layout">
            <MenuOptions
              theme="light"
              className="flex-none"
              {...{menuItems: this.menuItems()}}
            />
            <div className="flex">
              <WrappedComponent 
                {...this.props}
                {...{
                  onDeleteItem: this.onDeleteItem,
                  onAddItem: this.onAddItem,
                  onShowForm: this.onShowForm,
                  onHideForm: this.onHideForm,
                  onUpdateDataItem: this.onUpdateDataItem,
                  onPublishItem: this.onPublishItem,
                  fetchData: this.fetchData,
                  _state: this.state
                }}
              />
            </div>
          </div>
        </div>
      )
    }
  }

  return inject('authStore', 'queryStore', 'configStore')(observer(Wrapped));
}