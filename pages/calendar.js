import React from 'react';
import { Header, Section, Calendar, Footbar } from '../components';
import { loremIpsum, LoremIpsum } from 'lorem-ipsum';
import moment from 'moment';
import { message } from 'antd';
import httpService from '../libs/gn/services/httpService';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

class CalendarPage extends React.Component{
  render(){
    let { eventData } = this.props;
    return(
      <div>
        <Header/>
        <div className="gn-center-container gn-padding-M padding-bottom padding-top">
          <Section.SectionLabel
            label="Kalender Event"
            showLine={false}
            parent={[
              {
                label: "Home",
                url: '/'
              }
            ]}
          />
          <Calendar.Calendar
            events={eventData}
            
          />
        </div>
        <Calendar.Event
          value={eventData}
        />
        <Footbar/>
      </div>
    )
  }
}

CalendarPage.defaultProps = {
  eventData: [
    {
      id: 1,
      title: loremIpsum(),
      dateStart: moment('11/10/2019', 'DD/MM/YYYY').toDate(),
      dateEnd: moment('11/10/2019', 'DD/MM/YYYY').toDate(),
      dateString: '11/10/2019'
    },
    {
      id: 2,
      title: loremIpsum(),
      dateStart: moment('24/10/2019', 'DD/MM/YYYY').toDate(),
      dateEnd: moment('24/10/2019', 'DD/MM/YYYY').toDate(),
      dateString: '24/10/2019'
    }
  ]
}

export default CalendarPage;