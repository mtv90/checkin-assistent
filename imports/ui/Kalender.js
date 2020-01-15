import React from 'react';
import {Link} from 'react-router-dom';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';

// import history from '../routes/history';
import {Termine} from '../api/termine';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '@fullcalendar/bootstrap/main.css';

import PrivateHeader from './PrivateHeader';
import AddTermin from './AddTermin';
import TerminListe from './TerminListe';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

export default class Kalender extends React.Component {
  // _isMounted = false;
  calendarComponentRef = React.createRef();
  constructor(props){
    super(props);
    this.state = {
        isLoading: false,
        praxisId:'',
        error: '',
        appointments: [],
        calendarWeekends: false,
        termine: [],
    }   
}
componentDidMount() {
  // this._isMounted = true;
  this.setState({isLoading:true})
  
  // Abfrage nach Termindaten vom FHIR-Server 
  
    // Meteor.call('getAppointments', 
    // (err, res) => {
    //   if(err) {
    //     swal("Fehler", `${err.error}`, "error"); 
    //   } else {
    //     this.setState({
    //       appointments: res.entry
    //     })
    //   }
    // });

  this.terminTracker = Tracker.autorun(() => {
    const praxisId = Session.get('praxisId');
    Meteor.subscribe('termine');
    const termine = Termine.find().fetch();

    if(termine) {
      this.setState({termine, isLoading: false, praxisId})
    }
  });
}

componentWillUnmount() {
  // this._isMounted = false;
  this.terminTracker.stop();
}

openModal(e){
 
  Session.set({
    isOpen: true,
    start: e.dateStr
  });
}

render(){
  var Spinner = require('react-spinkit');
  const {isLoading} = this.state;

  if (isLoading) {
    return   (
      <div className="pacman-view">
          <Spinner name='pacman' color="#92A8D1" />
      </div>
    )
  }
  return (
    <div className="">
      <PrivateHeader title={`${this.props.user.profile.nachname}, ${this.props.user.profile.vorname}`} {...this.state.praxisId}/>
      <AddTermin/>
      <div className="kalender-container" id="wide-calendar">
        <FullCalendar
          defaultView="timeGridWeek"
          height='parent'
          minTime= '08:00:00'
          maxTime= '18:00:00'
          header={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek', 
          }}
          buttonText={
            {
              today: 'heute',
              month: 'Monat',
              week: 'Woche',
              day: 'Tag',
              list: 'Liste'
            }
          }
          buttonIcons={true}
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ]}
          ref={ this.calendarComponentRef }
          weekends={ this.state.calendarWeekends }
          events={ this.state.termine }
          dateClick={ this.openModal.bind(this) }
          locale= 'de'
          weekNumbers={true}
          navLinks={true}
        />
      </div>
      <div className="kalender-container" id="mobile-calendar">
        <FullCalendar
            defaultView="listWeek"
            height='parent'
            minTime= '08:00:00'
            maxTime= '18:00:00'
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'listWeek', 
            }}
            buttonText={
              {
                // today: 'heute',
                // month: 'Monat',
                // week: 'Woche',
                // day: 'Tag',
                list: 'Liste'
              }
            }
            buttonIcons={true}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ]}
            ref={ this.calendarComponentRef }
            weekends={ this.state.calendarWeekends }
            events={ this.state.termine }
            dateClick={ this.openModal.bind(this) }
            locale= 'de'
            weekNumbers={true}
            navLinks={true}
          />
      </div>
    </div>
  )
}
}

Kalender.propTypes = {
  user: PropTypes.object.isRequired
}
