import React from 'react';
import Account from '../modules/Account';

class AccountLoginPage extends React.Component{
  render(){
    const { isProduction } = this.props;
    return(
      <div className="gn-full full-viewport-width full-viewport-height gn-layout align-center jusitfy-center">
        <Account.Login
          onSuccess={(response) => {
            if(Array.isArray(response) && response.length > 0){
              let target = '';
              switch(response[0].SCREEN_NAME){
                case 'Article':
                  target = 'article';
                  break;
                case 'Banner':
                  target = 'banner';
                  break;
                case 'Banner About':
                case 'Home Headline':
                case 'Service Catalogue Intro':
                  target = 'home';
                  break;
                case 'Event':
                  target = 'event';
                  break;
                case 'Partner':
                  target = 'partner';
                  break;
                case 'Service Catalogue File':
                  target = 'catalogue-file';
                  break;
                default: 
                  target = ''
              }

              if(target !== '') window.location = isProduction ? `/manage/${target}` : `/manage-${target}`;
              else window.location = isProduction ? `/account/login` : '/account-login';
            }else window.location = isProduction ? '/manage/home' : '/manage-home'
          }}
        />
      </div>
    )
  }
}

export default AccountLoginPage;