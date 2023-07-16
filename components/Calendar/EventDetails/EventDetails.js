import React from 'react';
import renderHTML from 'react-render-html';
import { httpService } from '../../../libs/gn';
import { Modal, message, Spin, Icon, Button } from 'antd';
import './EventDetails.less';
import moment from 'moment';

const InfoItem = ({icon, label, value}) => (
  <div className="info-item flex gn-layout align-center gn-padding-N padding-all">
    <Icon 
      type={icon} className="gn-margin-N margin-right"
      style={{fontSize: 32}}
    />
    <div>
      <div className="gn-font-size-S">{label}</div>
      <div className="gn-font-weigth-BOLD">{value}</div>
    </div>
  </div>
)

class EventDetails extends React.Component{
  constructor(){
    super();
    this.state = {
      isLoading: false,
      data: {}
    }
  }

  componentWillReceiveProps(nextProps){
    let { visible, value } = nextProps;
    if(visible && !this.props.visible){
      this.fetchData(value.id);
    } else {
      this.setState({data: null, isLoading: false})
    }
  }

  fetchData = async (eventId) => {
    this.setState({isLoading: true});
    try{
      let res = await httpService.get(
        httpService.generateRequestOptions(`/api/event/public/show/${eventId}`)
      )
      this.setState({
        data: res.data,
        isLoading: false
      })
    }catch(error){
      message.error(error.message);
      this.props.onCancel();
    }
  }

  render(){
    let { data, isLoading } = this.state;
    let { visible, onCancel, t } = this.props
    return(
      <Modal
        title="Detail Event"
        visible={visible}
        onCancel={onCancel}
        dialogStyle={{
          width: '100%',
          maxWidth: 640
        }}
        footer={[
          <Button
            onClick={onCancel}
          >
            {t('common:other:close')}
          </Button>
        ]}
      >
        { isLoading ? <Spin/> : (
          data ? (
            <div className="utc-event-details">
              <h1>{data.title}</h1>
              
              { data.image ? 
                <img 
                  src={data.image} alt={data.title}
                  className="gn-margin-N margin-bottom"
                /> 
              : null}
              
              { data.location ? (
                <div className="info gn-layout gn-margin-N margin-bottom">
                  <InfoItem
                    icon="environment"
                    value={data.location}
                  />
                </div>
              ) : null }
              
              <div className="info gn-layout align-center gn-margin-N margin-bottom">
                {[
                  {
                    label: 'Mulai',
                    icon: 'calendar',
                    value: (
                      <div>
                        <div>{moment(data.dateStart).format('ll')}</div>
                        <div>{moment(data.dateStart).format('HH:mm')}</div>
                      </div>
                    )
                  },
                  {
                    label: 'Berakhir',
                    icon: 'calendar',
                    value: (
                      <div>
                        <div>{moment(data.dateEnd).format('ll')}</div>
                        <div>{moment(data.dateEnd).format('HH:mm')}</div>
                      </div>
                    )
                  }
                ].map( d => (
                  <InfoItem {...d} key={`event-${d.id}`}/>
                ))}
              </div>
              
              {renderHTML(data.content || '')}

              {data.organizer ? (
                <div className="gn-font-size-S">Organized by {data.organizer}</div>
              ) : null}
            </div>
          ) : null
        )}
      </Modal>
    )
  }
}

export default EventDetails;