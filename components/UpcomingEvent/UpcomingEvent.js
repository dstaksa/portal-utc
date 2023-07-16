import React from 'react';
import { SectionLabel } from '../Section';
import './UpcomingEvent.less';
import { loremIpsum } from 'lorem-ipsum';
import { Icon, Pagination, message, Spin } from 'antd';
import moment from 'moment';
import { ResponsiveLayout } from '../../libs/gn/components';
import { Calendar } from '..';
import httpService from '../../libs/gn/services/httpService';
import { EventDetails } from '../Calendar';
import { inject, observer } from 'mobx-react';

const maxView = 5;
class UpcomingEvent extends React.Component{
  constructor(){
    super();
    this.state = {
      eventData: [],
      showDetails: false,
      selectedEvent: null,
      page: 1,
      isLoading: true
    }
  }

  onFetchEvent = async (month, year, callback) => {
    try{
      this.setState({isLoading: true})
      let res = await httpService.get(
        httpService.generateRequestOptions(`/api/event/public/index/${month}/${year}`)
      )
      let eventData = res.data.map( d => {
        d.dateString = moment(d.dateStart).format('DD/MM/YYYY');
        return d;
      })
      this.setState({eventData, isLoading: false});
      callback(eventData);
    }catch(error){
      this.setState({isLoading: false})
      message.error(error.message)
      callback([])
    }
  }

  onShowDetails = (selectedEvent) => {
    this.setState({
      showDetails: true,
      selectedEvent
    })
  }

  render(){
    let { eventData, isLoading, page } = this.state;
    let { t, configStore  } = this.props;
    return(
      <div 
        id="utc-upcoming-event"
        className="utc-upcoming-event gn-padding-L padding-top padding-bottom"
      >
        <SectionLabel 
          style={{textAlign: 'center'}} 
          label={t('common:menu.event')}
          inverse={true}
        />
        <div className="gn-center-container">
          <ResponsiveLayout
            childs={[
              <Calendar.Calendar 
                className="calendar"
                events={eventData}
                onFetchEvent={this.onFetchEvent}
                small={true}
                inverse={true}
              />,
              <div className="events" style={{paddingTop: 6}}>
                <div className="gn-font-size-M gn-padding-N padding-bottom">
                  {t('common:other.eventList')}
                </div>
                {isLoading ? <Spin/> : (
                  <div>
                    { eventData.filter((d, i) => (i < page*maxView && i >= (page - 1)*maxView)).map(d => (
                      <div 
                        className="event-item gn-padding-N padding-all gn-margin-N margin-bottom"
                        key={`upcoming-event-${d.id}`}
                        onClick={() => this.onShowDetails(d)}
                      >
                        <div className="title gn-font-size-MN gn-font-weight-M gn-margin-S margin-bottom">
                          {d.title}
                        </div>
                        <div className="info gn-layout align-center">
                          {[
                            {
                              icon: 'environment',
                              value: d.location
                            },
                            {
                              icon: 'calendar',
                              value: moment(d.dateStart).format( configStore.lang === 'id' ? 'DD MMMM YYYY' : 'll')
                            }
                          ].map((info, i) => (
                            <div 
                              key={`event-info-${i}`}
                              className="info-item gn-layout align-center gn-margin-N margin-right"
                            >
                              <Icon type={info.icon} className="gn-margin-S margin-right"/>
                              <div>{info.value}</div>
                            </div>
                          ))}
                          { moment(d.dateEnd).diff(moment(d.dateStart)) >= 1 ? (
                            <div className="gn-layout align-center">
                              <div className="gn-margin-N margin-right"> - </div>
                              <div 
                                className="info-item gn-layout align-center gn-margin-N margin-right"
                              >
                                <Icon type="calendar" className="gn-margin-S margin-right"/>
                                <div>{moment(d.dateEnd).format( configStore.lang === 'id' ? 'DD MMMM YYYY' : 'll')}</div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                    { eventData.length > maxView ? (
                      <Pagination 
                        current={page} 
                        pageSize={maxView}
                        total={eventData.length} 
                        onChange={ page => this.setState({page})}
                      />
                    ) : null}
                  </div>
                )}
                
              </div>
            ]}
          />
        </div>
        {/* <div className={`gn-center-container gn-layout align-start ${value.length >= 3 ? 'justify-between' : 'justify-center'} gn-margin-M margin-bottom direction-column-xs`}>
          {value.map(d => (
            <div 
              className="event-item gn-padding-M padding-all"
              key={`upcoming-event-${d.id}`}
            >
              <div className="date gn-layout align-center gn-margin-N margin-bottom">
                <Icon type="calendar" className="gn-margin-N margin-right"/>
                <div>{moment(d.date).format('ll')}</div>
              </div>
              <div className="title gn-font-size-MN gn-font-weight-M">
                {d.title}
              </div>
            </div>
          ))}
        </div> */}
        {/* <div className="action gn-margin-N margin-top">
          <a href="/calendar">
            <Button type="primary">
              <Icon type="arrow-right"/>
              Agenda
            </Button>
          </a>
        </div> */}
        <EventDetails
          visible={this.state.showDetails}
          value={this.state.selectedEvent}
          t={t}
          onCancel={() => this.setState({
            showDetails: false,
            selectedEvent: null
          })}
        />
      </div>
    )
  }
}

UpcomingEvent.defaultProps = {
  value: [
    {
      id: 1,
      title: loremIpsum(),
      description: loremIpsum(),
      dateStart: new Date(),
      location: 'Jakarta'
    },
    {
      id: 2,
      title: loremIpsum(),
      description: loremIpsum(),
      dateStart: new Date(),
      location: 'Jakarta'
    }
  ]
}

export default inject('configStore')(observer (UpcomingEvent));