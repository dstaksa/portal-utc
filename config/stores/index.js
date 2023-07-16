import { useStaticRendering } from 'mobx-react';
import AuthStore from './AuthStore';
import QueryStore from './QueryStore';
import ConfigStore from './ConfigStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);

let store = null;

export function initializeStore(initialData={ authStore: {}, configStore: null}){
  if (isServer) {
    return {
      authStore: new AuthStore(initialData.authStore),
      queryStore: new QueryStore(),
      configStore: new ConfigStore(initialData.configStore)
    }
  }

  if (store === null) {
    store = {
      authStore: new AuthStore(initialData.authStore),
      queryStore: new QueryStore(),
      configStore: new ConfigStore(initialData.configStore)
    };
  }

  return store;
}