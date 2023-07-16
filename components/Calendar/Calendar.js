import React from 'react';
import moment from 'moment';
import { Button } from 'antd';
import _ from 'lodash';
// import Section from '../../Section';
import './Calendar.less';
import httpService from '../../libs/gn/services/httpService';
// import EventThumbnails from '../EventThumbnails';
// import ProgressLoader from '../../ProgressLoader';
import qs from 'query-string';

const arrDays = ['Sun', 'Mon', 'Thu', 'Wed', 'Tue', 'Fri', 'Sat'];

class Calendar extends React.Component{
  constructor(){
    super();
    this.state = {
      selectedDate:null,
      isLoading:false,
      dateTable:[],
      dateGroups:[],
      month:null,
      year:null,
      events:[],
      eventKeys:[],
      filteredEvents:[]
    }
  }
  componentDidMount(){
    const today = moment(this.props.today);
    setTimeout(() => {
      this.fetchEvent(today.month() + 1, today.year());
    })
  }

  fetchEvent = async (month, year) => {
    this.setState({isLoading:true});
    this.props.onFetchEvent(month, year, (events, isError) => {
      this.generateView(events, month, year);
      this.setState({isLoading: false})
    })
  }

  nextMonth = (isPrevious) => {
    const { month, year } = this.state;
    let date = moment(`1/${month}/${year}`,'DD/MM/YYYY');
    date = date.add( isPrevious ? -1 : 1 , 'months');

    let nextMonth = date.month() + 1;
    let nextYear = date.year();
    this.fetchEvent(nextMonth, nextYear);
  }

  generateView = async (events, month, year) => {
    let _format = 'DD/MM/YYYY'
    let today = moment(this.props.today);
    const firstDate = moment(`1/${month}/${year}`, _format);
    const totalDayInMonth = firstDate.daysInMonth();
    const lastDate = moment(`${totalDayInMonth}/${month}/${year}`, _format);
    // const { events } = this.props;
    let totalWeek = Math.ceil((firstDate.day() + lastDate.date())/7);
    let dateGroups = [];
    for( let i = 0 ; i < totalWeek ; i++){
      dateGroups.push(arrDays.map(() => (null)))
    }

    let datesOfMonth = [];
    for( let i = 1 ; i <= totalDayInMonth ; i++){
      const date = moment(`${i}/${month}/${year}`, _format);
      const event = _.find(events, {
        dateString: date.format(_format)
      })
      const dateObject = {
        date, event,
        isToday: date.isSame(moment(`${today.date()}/${today.month()+1}/${today.year()}`, _format)),
        day: date.day(),
        inWeek: Math.ceil((firstDate.day() + date.date())/7)
      }
      datesOfMonth.push(dateObject)
      dateGroups[dateObject.inWeek - 1][dateObject.day] = dateObject;
    }

    this.setState({
      dateTable: datesOfMonth, dateGroups,
      month, year, eventKeys:[]
    });
  }

  selectDate = (date) => {
    let { selectedDate, filteredEvents, events } = this.state;
    selectedDate = selectedDate && selectedDate.isSame(date) ? null : date;
    if(selectedDate){
      filteredEvents = events.filter((d) => {
        return d.dateString === selectedDate.format('DD/MM/YYYY');
      })
    } else {
      filteredEvents = _.cloneDeep(events)
    }
    this.setState({selectedDate, filteredEvents});
  }

  render(){
    const { dateGroups, month, year, selectedDate, isLoading } = this.state; 
    const { t, events, small=false, inverse=false, className='' } = this.props;
    const hasEvent = (dg) => {
      return dg ? (dg.event ? true : false) : false;
    }
    const isSelectedDate = (dg) => {
      return dg ? (dg.date ? selectedDate && selectedDate.isSame(dg.date) : false) : false;
    }

    const Control = (
      <div className="control gn-padding-N padding-bottom gn-layout column-sm align-center justify-between gn-border dotted bottom dark">
        <div className="gn-font-size-M gn-font-weight-N">
          { month && year ? moment(`${month}/${year}`, 'M/YYYY').format('MMMM YYYY') : 'Loading'}
        </div>
        <div className="gn-layout align-center justify-start">
          <Button 
            shape="circle" icon="arrow-left"
            onClick={() => this.nextMonth(true)}
            disabled={this.state.isLoading}
          />
          <div className="current-date font-secondary gn-padding-N padding-left padding-right">
            {`${month ? month : ' - '}/${year ? year : ' - '}`}
          </div>
          <Button 
            shape="circle" icon="arrow-right"
            onClick={() => this.nextMonth()}
            disabled={this.state.isLoading}
          />
        </div>
      </div>
    )

    const DateTable = (
      <div className="calendar-table gn-padding-M padding-top padding-bottom">
        <table>
          <thead>
            <tr>
              {arrDays.map( day => (
                <th key={day}>
                  <div className="gn-font-color-D3">{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dateGroups.map((dg,i) => (
              <tr key={`dg-${i}`}>
                {arrDays.map((day, atIndex) => (
                  <td key={`${i}-${atIndex}`}>
                    <div 
                      className={`
                        date gn-layout align-center justify-center 
                        ${dg[atIndex] ? (dg[atIndex].isToday ? 'today' : '') : ''} 
                        ${hasEvent(dg[atIndex]) ? 'has-event' : ''}
                        ${isSelectedDate(dg[atIndex]) ? 'selected' : ''}
                      `}
                      onClick={() => {
                        if(hasEvent(dg[atIndex])){
                          this.selectDate(dg[atIndex].date);
                        }
                      }}
                    >
                      {dg[atIndex] ? dg[atIndex].date.date() : null}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )

    // const Events = (
    //   <div className="utc-calendar-events gn-padding-M padding-top gn-border solid dark top">
    //     <Section 
    //       title={t('calendar:thisMonthsEvent')}
    //     />
    //     <div className="gn-margin-N margin-top">
    //       {events && events.length > 0 ? events.map((d, i) => (
    //         <EventThumbnails d={d} inverse/>
    //       )) : (
    //         <ProgressLoader isLoading={isLoading} message={t('calendar:notFoundAgenda')}/>
    //       )}
    //     </div>
    //   </div>
    // )

    return(
      <div className={`utc-calendar ${small ? 'small' : ''} ${inverse ? 'inverse' : ''} ${className}`}>
        {Control}
        {DateTable}
        {/* {Events} */}
      </div>
    )
  }
}

export default Calendar;