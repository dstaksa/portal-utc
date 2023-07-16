import React from 'react';
import './Event.less';
import { SectionLabel } from '../../Section';
import { Icon, Button } from 'antd';
import moment from 'moment';
import EventDetails from '../EventDetails';

class CalendarEvent extends React.Component{
  constructor(){
    super();
    this.state = {
      showDetails: false,
      selectedEvent: null
    }
  }

  onShowDetails = (selectedEvent) => {
    this.setState({
      showDetails: true,
      selectedEvent
    })
  }

  render(){
    let { value=[]} = this.props;
    
    return(
      <div className="utc-calendar-event gn-padding-M padding-top padding-bottom">
        <div className="gn-center-container">
          <SectionLabel label="Event" inverse={true}/>
          {value.length > 0 ? value.map( d => (
            <div 
              key={`event-item-${d.id}`}
              className="event-item gn-layout align-center gn-padding-N padding-top padding-bottom"
              onClick={() => this.onShowDetails(d)}
            >
              <Icon type="calendar" className="icon gn-margin-N margin-right"/>
              <div className="flex">
                <div className="date gn-font-size-S">{moment(d.dateStart).format('lll')}</div>
                <div className="title gn-font-size-MN">{d.title}</div>
              </div>
              <div className="flex-none gn-margin-N margin-left" style={{minWidth: 48}}>
                <Button 
                  icon="arrow-right" ghost={true}
                />
              </div>
            </div>
          )) : <span className="info-color">Tidak ada event</span>}
        </div>
        <EventDetails
          visible={this.state.showDetails}
          value={this.state.selectedEvent}
          onCancel={() => this.setState({
            showDetails: false,
            selectedEvent: null
          })}
        />
      </div>
    )
  }
}

export default CalendarEvent;