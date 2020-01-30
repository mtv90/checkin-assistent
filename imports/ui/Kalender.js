import React from 'react';
import {Link} from 'react-router-dom';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';
import { withTracker  } from 'meteor/react-meteor-data';
// import history from '../routes/history';
import {Termine} from '../api/termine';
import {Praxen} from '../api/praxen';
import Modal from 'react-modal';
import moment from 'moment';
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

export class Kalender extends React.Component {
  // _isMounted = false;
  calendarComponentRef = React.createRef();
  constructor(props){
    super(props);
    this.state = {
        isLoading: false,
        isOpen: false,
        praxisId:'',
        termin: null,
        error: '',
        appointments: [],
        timeError:'',
        calendarWeekends: false,
        termine: [],
        modal: null,
        random: '',
        patient_id: '',
        notes:'',
        subject:'',
        start: null,
        end: null,
    }   
}
componentDidMount(){
  this.setState({
    start: moment().format('YYYY-MM-DDTHH:mm'),
    end: moment().format('YYYY-MM-DDTHH:mm'),
  })
}
componentWillUnmount() {
  this.setState({isOpen: false})
  Session.set('isOpen', false)
}
openEvent(e){
  
  const event = e.event;
  if(event){
    const termin = {
      _id: event.extendedProps._id,
      title: event.title,
      patient: {...event.extendedProps.patient},
      subject: event.extendedProps.subject,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      notes: event.extendedProps.notes,
      praxis: {...event.extendedProps.praxis},
      checkedIn: event.extendedProps.checkedIn,
      status: event.extendedProps.status,
      patientRead: event.extendedProps.patientRead,
      adminRead: event.extendedProps.adminRead,
      user_id: event.extendedProps.user_id, 
      createdAt: event.extendedProps.createdAt,
      updatedAt: event.extendedProps.updatedAt,
    }
    this.setState({
      isOpen:true, 
      termin,
      subject: event.extendedProps.subject,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm'),
      notes: event.extendedProps.notes,
    });
  }
}
openModal(e){
  this.setState({
    isOpen: true,
    start: moment(e.startStr).format('YYYY-MM-DDTHH:mm'),
    end: moment(e.endStr).format('YYYY-MM-DDTHH:mm')
  })
  // Session.set({
  //   isOpen: true,
  //   start: e.startStr,
  //   end: e.endStr
  // });

}

handleModalClose(){
  this.setState({
    isOpen: false,
    termin:null,
    subject:'',
    notes:'',
  })
}
onSubmit(e){
  e.preventDefault();
  const {patient_id, start, end, notes, subject} = this.state;
  const praxis = this.props.praxis;

  console.log(this.state.termin)
  if(this.state.termin){
    this.state.termin['patientRead'] = false;
    this.state.termin['subject'] = this.state.subject;
    this.state.termin['start'] = this.state.start;
    this.state.termin['end'] = this.state.end;
    this.state.termin['notes'] = this.state.notes;

    this.setState({termin: this.state.termin});
    Meteor.call('termin.update', 
      this.state.termin._id, 
      this.state.termin,
      (error, result) => {
        if(error){
          swal(`${error.error}`,"","error")
        }
        if(result){
          
          Meteor.call('termin.update_mail',
            this.state.termin.patient.emails[0].address, 
            this.state.termin.praxis.title, 
            this.state.termin.subject, 
            this.state.termin,
            (error, result) => {
              if(error){
                swal('Fehler', `${error.error}`, 'error');
              }
            });
          this.handleModalClose();
          swal('Termin aktualisiert',"","success");
        }
      }
    );
  } else {
  Meteor.call('termine.insert', 
            patient_id,
            start,
            end,
            subject,
            notes,
            praxis,
            (error, result) => {
                if(error) {
                    swal("Fehler", `${error.error}`, "error");
                } else {
                    swal("Daten erfolgreich gespeichert", '', "success");
                    Meteor.call('sendMailToUser',
                    patient_id,
                    subject,
                    start,
                    end,
                    notes,
                    praxis.title,
                    praxis.strasse,
                    praxis.nummer,
                    praxis.plz,
                    praxis.stadt,
                    praxis.telefon,
                    praxis.email,
                    (error, result) =>{
                        if(result){
                            swal("Benachrichtigung versendet","", "success");
                        }
                    }
                    );
                    this.handleModalClose();
                }
            }
        );
  }

}
onChangeSubject(e){
  const subject = e.target.value;

  this.setState({subject});
}
onChangeStarttime(e){
  const start = e.target.value;
  if(start) {
      this.setState({start})
  }
}
onChangeEndtime(e){
  const end = e.target.value;
  if(end ) {
      this.setState({end});
  }
}
onChangeNotes(e){
  const notes = e.target.value;
  if(notes) {
      this.setState({notes});
  }
}
handleStorno(e){
  
  swal({
    title:"Termin stornieren",
    icon: "warning",
    buttons: ["abbrechen", true],
    dangerMode: true,
    content: {
      element: "input",
      attributes: {
        placeholder: "Bitte geben Sie einen Grund an",
        type: "text",
      },
    },
  }).then((value) => {
    if(value){
      const random = Random.hexString(4);
      this.setState({
        termin: {
          ...this.state.termin,
          stornoGrund: value},
        random
      });
      swal({
        title: "Eingabebestätigung",
        text: `Bitte geben Sie die Zeichenfolge ein: ${random}`,
        buttons: ["abbrechen", true],
        dangerMode: true,
        content: {
          element: "input",
          attributes: {
            placeholder: "",
            type: "text",
          },
        }
      }).then((result) => {
        if(result === this.state.random){
          this.state.termin['status'] = 'storniert',
          this.state.termin['patientRead'] = false,
          this.state.termin['checkedIn'] = false

          this.setState({termin: this.state.termin})
          Meteor.call('termin.update', 
            this.state.termin._id, 
            this.state.termin,
            (error, result) => {
              if(error){
                swal(`${error.error}`,"","error")
              }
              if(result){
                swal('Termin storniert',"","success")
              }
            });
          
        } else {
          throw new Meteor.Error("Falsche Eingabe")
        }
      }).catch((err) => {
        swal(`${err.error}`, "Die eingegebene Zeichenfolge stimmt nicht überein", "error");
      }); 
    } else {
      throw new Meteor.Error("Sie müssen einen Grund angeben")
    } 
  }).catch( (err) => {
    console.log(err);
    swal(`${err.error}`, "", "error");
  })
}
renderOptions(){
  if(!this.props.praxis.patienten){
    return (
        <option className="item__status-message">Keine Patienten vorhanden!</option>
    )
  }
  if(this.props.praxis.patienten.length === 0) {
      return (
          <option className="item__status-message">Keine Patienten vorhanden!</option>
      )
  }
  return this.props.praxis.patienten.map((patient) => {
      return (
          <option key={patient._id} ref="pat_id" value={patient._id}>{patient.label}</option>
      )
  });
}
onChangePatient(e){
  const patient_id = e.target.value;
  if(patient_id) {
      this.setState({patient_id})
  }
}
render(){
  var Spinner = require('react-spinkit');
  if(!this.props.praxis){
    return (
        <div className="pacman-view">
            <Spinner name='pacman' color="#92A8D1" />
        </div>
    )
}
  return (
    <div className="">
      {/* `${this.props.user.profile.nachname}, ${this.props.user.profile.vorname}` */}
      <PrivateHeader title={this.props.praxis.title} praxis={this.props.praxis}/>
      <AddTermin praxis={this.props.praxis} />
      <div className="kalender-container" id="wide-calendar">
        <FullCalendar
          selectable={true}
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
          events={ this.props.termine }
          // dateClick={ this.openModal.bind(this) }
          select={this.openModal.bind(this)}
          locale= 'de'
          weekNumbers={true}
          navLinks={true}
          eventClick={this.openEvent.bind(this)}
        />
      </div>
      <div className="kalender-container" id="mobile-calendar">
        <FullCalendar
          selectable={true}
            defaultView="timeGridDay"
            height='parent'
            minTime= '08:00:00'
            maxTime= '18:00:00'
            header={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay, listWeek', 
            }}
            select={this.openModal.bind(this)}
            buttonText={
              {
                day: 'Tag',
                list: 'Liste'
              }
            }
            buttonIcons={true}
            plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin ]}
            ref={ this.calendarComponentRef }
            weekends={ this.state.calendarWeekends }
            events={ this.props.termine }
            
            locale= 'de'
            weekNumbers={true}
            eventClick={this.openEvent.bind(this)}
            navLinks={true}
          />
      </div>
      <Modal 
        isOpen={this.state.isOpen} 
        contentLabel="Termin anlegen" 
        appElement={document.getElementById('app')}
        // onAfterOpen={() => this.refs.titel.focus()}
        onRequestClose={this.handleModalClose.bind(this)}
        className="boxed-view__box"
        overlayClassName="boxed-view boxed-view--modal"
      >
        {this.state.termin ? (
          <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
          <h1>Termin bearbeiten</h1>
          {this.state.termin.patient ? 
          <h2>{this.state.termin.patient.profile.nachname}, {this.state.termin.patient.profile.vorname}</h2> 
          : 
            (<select name="patienten" onChange={this.onChangePatient.bind(this)}>
              <option>Patienten auswählen...</option>
                {this.renderOptions()}
            </select>)}
          <input  name="subject" type="text" 
                  disabled = {this.state.termin.status === 'storniert' ? 'disabled' : ''}
                  placeholder="Betreff" 
                  value={this.state.subject} 
                  onChange={this.onChangeSubject.bind(this)} autoComplete="off"/>
          <label htmlFor="starttime">von:</label>
          <input  name="starttime" type="datetime-local" 
                  disabled = {this.state.termin.status === 'storniert' ? 'disabled' : ''}
                  placeholder="Startzeit wählen" value={this.state.start } 
                  onChange={this.onChangeStarttime.bind(this)} />
          <label htmlFor="endtime">bis:</label>
          {this.state.timeError ? <small className="error--text">{this.state.timeError}</small> : undefined}
          <input  name="endtime" type="datetime-local" 
                  disabled = {this.state.termin.status === 'storniert' ? 'disabled' : ''}
                  placeholder="Ende wählen" 
                  value={this.state.end} onChange={this.onChangeEndtime.bind(this)} />
          <textarea ref="notes" 
                  disabled = {this.state.termin.status === 'storniert' ? 'disabled' : ''}
                  placeholder="Bemerkungen eingeben"value={this.state.notes} onChange={this.onChangeNotes.bind(this)}/>
          {this.state.termin.status === 'storniert' ? (
            <div>
              <p className="editor--message"><small className="error--text">Der Termin wurde am {moment(this.state.termin.updatedAt).format('DD.MM.YYYY')} um {moment(this.state.termin.updatedAt).format('HH:mm')} Uhr storniert</small></p>
              <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>schliessen</button>
            </div>
           ) : (
            <div className="boxed-view__form">
              <button type="submit" className="button">speichern</button>
              <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
              <button type="button" className="button button--remove-opening" onClick={this.handleStorno.bind(this)}>stornieren</button>
            </div>
          )}
          </form>
        ) : (
          
          <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
          <h1>Termin erstellen</h1> 
          <select name="patienten" onChange={this.onChangePatient.bind(this)}>
              <option>Patienten auswählen...</option>
                {this.renderOptions()}
            </select>
          <input  name="subject" type="text" 
                  placeholder="Betreff" 
                  value={this.state.subject} 
                  onChange={this.onChangeSubject.bind(this)} autoComplete="off"/>
          <label htmlFor="starttime">von:</label>
          <input  name="starttime" type="datetime-local" 
                  placeholder="Startzeit wählen" value={this.state.start } 
                  onChange={this.onChangeStarttime.bind(this)} />
          <label htmlFor="endtime">bis:</label>
          {this.state.timeError ? <small className="error--text">{this.state.timeError}</small> : undefined}
          <input  name="endtime" type="datetime-local" 
                  placeholder="Ende wählen" 
                  value={this.state.end} onChange={this.onChangeEndtime.bind(this)} />
          <textarea ref="notes" 
                  placeholder="Bemerkungen eingeben" value={this.state.notes} onChange={this.onChangeNotes.bind(this)}/>
         
              <button type="submit" className="button">speichern</button>
              <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
          
          </form>

        )}
      </Modal>
    </div>
  )
}
}

Kalender.propTypes = {
  user: PropTypes.object.isRequired,
  praxis: PropTypes.object,
  termine: PropTypes.array,
}

export default withTracker( () => {
  const praxisId_termin = Session.get('praxisId_termin');
  
  Meteor.subscribe('meine_praxen');
  const praxis = Praxen.findOne(praxisId_termin);

  Meteor.subscribe('termine');
  let termine = Termine.find({"praxis._id": praxisId_termin}).fetch();
  
  // Prüfe, welche Termine storniert wurden und färbe sie grau 
  termine.map(termin => {
    if(termin.status === 'storniert'){
      return (termin['color'] = '#cccccc',
              termin['textColor'] = '#666666'
              );
    } else {
      return termin['color'] = '#92A8D1'
    }
  })
  
  return {
    praxisId_termin,
    praxis,
    termine
  };
})(Kalender);