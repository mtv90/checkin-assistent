import React from 'react';
import {Link} from 'react-router-dom';
import {Meteor} from 'meteor/meteor'
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Termine} from '../api/termine';
import {Konten} from '../api/konten';
import PropTypes from 'prop-types';
import { IconContext } from "react-icons";
import { MdDone, MdAccessAlarm } from "react-icons/md";
import moment from 'moment';
import Modal from 'react-modal';
import swal from 'sweetalert';
import AddToCalendar from 'react-add-to-calendar';
import { Behandlungen } from '../api/behandlungen';

import 'react-add-to-calendar/dist/react-add-to-calendar.css'


export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            termin: null,
            isOpen: false,
            kvDaten: false,
            fragebogen: false,
            dsgvo: false,
            agb: false,
            uptodate: false,
            tooLate: false,
            moment: moment(),
        }
        this.interval = null;
    }
    componentDidMount(){
     
    }
    renderTerminStatus(){
        const status = this.props.termin.status
        switch (this.props.termin) {
            case status === 'open':
                return 'offen';
            case status === 'waiting':
                return 'wartend';    
            case status === 'in-behandlung':
                return 'in-behandlung';
            case status === 'storniert':
                return 'abgesagt';
            case status === 'abgeschlossen':
                return 'abgeschlossen';
            case status === 'verspaetet':
                return 'verspaetet';
            default:
                break;
        }
    }

    checkIn(e){
        if(this.props.konto){
            this.setState({
                termin: this.props.termin,
                isOpen: true
            })
        }       
    }
    handleStorno(e){
        this.setState({
            termin: this.props.termin
        })
        swal({
            title:"Termin absagen",
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
                  this.state.termin['adminRead'] = false,
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
                        Meteor.call('termin.update_mail',
                        this.state.termin.praxis.email, 
                        this.state.termin.patient.emails[0].address, 
                        this.state.termin.subject, 
                        this.state.termin,
                        (error, result) => {
                          if(error){
                            swal('Fehler', `${error.error}`, 'error');
                          }
                        });
                        swal('Termin storniert',"","success")
                      }
                    });
                  
                } 
              }).catch((err) => {
                swal(`Falsche Eingabe`, "Die eingegebene Zeichenfolge stimmt nicht überein", "error");
              }); 
            } 
          }).catch( (err) => {
            console.log(err);
            swal(`${err.error}`, "", "error");
          })
    }
    handleDelay(e){
        this.setState({
            termin: this.props.termin
        })
        swal({
            title:"Verspätung melden",
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
                  this.state.termin['status'] = 'verspaetet',
                  this.state.termin['adminRead'] = false,
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
                        Meteor.call('termin.update_mail_too_late',
                        this.state.termin.praxis.email, 
                        this.state.termin.patient.emails[0].address, 
                        this.state.termin.subject, 
                        this.state.termin,
                        (error, result) => {
                          if(error){
                            swal('Fehler', `${error.error}`, 'error');
                          }
                        });
                        swal('Verspätung gemeldet',"","success")
                      }
                    });
                  
                } 
              }).catch((err) => {
                swal(`Falsche Eingabe`, "Die eingegebene Zeichenfolge stimmt nicht überein", "error");
              }); 
            } 
          }).catch( (err) => {
            console.log(err);
            swal(`${err.error}`, "", "error");
          })
    }

    handleCheckinClose(){
        this.setState({
            isOpen:false,
            kvDaten: false,
            fragebogen: false,
            dsgvo: false,
            agb: false,
            uptodate: false
        })
    }
    onSubmitCheckin(e){
        e.preventDefault();
        let termin = this.props.termin;
        let random;
        if((this.state.kvDaten && this.state.fragebogen && this.state.dsgvo && this.state.agb && this.state.uptodate)){
            
            random = Random.hexString(4);
            termin = {
                ...termin,
                kv_daten: this.props.konto.kategorien[0],
                fragebogen: this.props.konto.kategorien[1]
            }
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
                if(result === random){
                    termin['status'] = 'waiting',
                    termin['adminRead'] = false,
                    termin['checkedIn'] = true
          
                    Meteor.call('termin.update', 
                      termin._id, 
                      termin,
                      (error, result) => {
                        if(error){
                          swal(`${error.error}`,"","error")
                        }
                        if(result){
                          Meteor.call('termin.update_mail_checked_in',
                          termin.praxis.email, 
                          termin.patient.emails[0].address, 
                          termin.subject, 
                          termin,
                          (error, result) => {
                            if(error){
                              swal('Fehler', `${error.error}`, 'error');
                            }
                          });
                          swal('Check-in erfolgreich',"Sie sind nun eingecheckt und können im Warteraum Platz nehmen!","success");
                          this.handleCheckinClose();
                        }
                      });
                    
                  } 
              })
              .catch( (error) => {
                swal(`Falsche Eingabe`, "Die eingegebene Zeichenfolge stimmt nicht überein", "error");
              });
        }
    }
    onChangeKVDaten(){
        this.setState({
            kvDaten: !this.state.kvDaten
        })
    }
    onChangeFragebogen(){
        this.setState({
            fragebogen: !this.state.fragebogen
        })
    }
    onChangeDSGVO(){
        this.setState({
            dsgvo: !this.state.dsgvo
        })
    }
    onChangeAGB(){
        this.setState({
            agb: !this.state.agb
        })
    }
    onChangeUpToDate(){
        this.setState({
            uptodate: !this.state.uptodate
        })
    }
    checkDelay(){
        if(this.state.moment.diff(this.props.termin.start, 'minutes') >= -120 && this.state.moment.diff(this.props.termin.start, 'minutes') < -15){

            return 'editor-alarm-green';
        }
        if(this.state.moment.diff(this.props.termin.start, 'minutes') >= -15 && this.state.moment.diff(this.props.termin.start, 'minutes') < 0){
            return 'editor-alarm-yellow'
        }
        if(this.state.moment.diff(this.props.termin.start, 'minutes') >= 0 && this.state.moment.diff(this.props.termin.start, 'minutes') < 15){
            return 'editor-alarm-red'
        } 
        if(this.state.moment.diff(this.props.termin.start, 'minutes') >= 15 ){
            return 'editor-alarm-too-late'
        }
    }
    componentDidMount(){
        
        const self = this;
        self.interval = setInterval(function() {
          self.setState({
            moment: moment(),
          });
        }, 60000);    
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    renderButtons(){
        if(this.props.konto){
            if(this.props.termin.status === 'abgeschlossen'){
                return <p className="editor--message success-text">Der Termin wurde wie geplant durchgeführt.</p>
            }
            if(this.props.termin.status === 'waiting' || this.props.termin.status === 'in-behandlung'  && this.props.termin.checkedIn ){
                return <p className="editor--message">Sie sind bereits eingechecked</p>
            }
            if(this.props.termin.status === 'storniert'){
                return <p className="editor--message error--text">Der Termin wurde <strong>strorniert</strong>! Bitte wenden Sie sich an die Praxis oder vereinbaren einen neuen Termin.</p>
            }
            if(this.props.termin.status === 'open'){
                if(this.state.moment.diff(this.props.termin.start, 'minutes') >= 15){
                    return (
                        <p className="editor--message error--text">Sie waren zu spät und haben sich nicht gemeldet. Der Termin wurde daher storniert.</p>
                    )
                }
                return (
                    <div className="editor--button-group">
                        {this.state.moment.diff(moment(this.props.termin.start), 'm') >= -30 ? 
                            <button type="button" className="editor-button button--checkin" onClick={this.checkIn.bind(this)}>einchecken</button> : 
                            <p className="editor--message error--text">Der Check-in ist erst in <b>{(this.state.moment.diff(moment(this.props.termin.start), 'm') + 60)*-1} min</b> geöffnet!</p>
                        }
                        <button type="button" className="editor-button button--checkin waiting" onClick={this.handleDelay.bind(this)}>Verspätung melden</button>
                        <button type="button" className="editor-button button--checkin storno" onClick={this.handleStorno.bind(this)}>absagen</button>
                    </div>
                )
            }
            if(this.props.termin.status === 'verspaetet'){
                return  (<div className="editor--button-group">
                            <button type="button" className="editor-button button--checkin" onClick={this.checkIn.bind(this)}>einchecken</button>
                            <button type="button" className="editor-button button--checkin waiting" onClick={this.handleDelay.bind(this)}>Verspätung melden</button>
                            <button type="button" className="editor-button button--checkin storno" onClick={this.handleStorno.bind(this)}>absagen</button>
                        </div>)
            }
        } else {
            return <p className="editor--message error--text">Um einchecken zu können, müssen Sie ihre Daten hinterlegen. Dies ist unter <Link className="error--link" to={`/patient/${Meteor.userId}`}><strong>Mein Konto</strong></Link> möglich.</p>
        }



    }
    render() {
        
        var Spinner = require('react-spinkit');
        if(this.props.termin) {
            const classTimer = this.checkDelay() ? this.checkDelay() : ''; 
            const statusClass = this.props.termin.status === 'waiting' ? 'termin-status waiting': this.props.termin.status === 'in-behandlung' ? 'termin-status in-behandlung' : this.props.termin.status === 'storniert' ? 'termin-status storno' : this.props.termin.status === 'abgeschlossen' ? 'termin-status success' : 'termin-status';
            return (
                <div className="editor">
                    <div className="termin-header">
                        <h1>{this.props.termin.praxis.title}</h1>
                        <div className="praxis-anschrift">
                            <p className="item__message">{this.props.termin.praxis.strasse} {this.props.termin.praxis.nummer}, {this.props.termin.praxis.plz} {this.props.termin.praxis.stadt}</p>
                            <p className="item__message"> Telefon: {this.props.termin.praxis.telefon}, E-Mail: {this.props.termin.praxis.email}</p>
                            <h5 className="item__message item__status-message praxis--subheading">Öffnungszeiten</h5>
                            <div className="item__message">
                                {this.props.termin.praxis.openings.map((open, index) => {
                                    return (
                                        <p className="item__message item-title" key={index}>
                                            <strong>{open.day}</strong>, von {open.start}Uhr bis {open.end}Uhr 
                                        </p>)
                                })}  
                            </div>
                        </div>
                    </div>
                    <div className="mein-termin">
                        <div className="add-cal-box">
                            <AddToCalendar displayItemIcons={true} buttonLabel="export" event={this.props.event}/>
                        </div>
                        
                        <p>Status: <span className={statusClass}>{this.props.termin.status=== 'in-behandlung' ? 'In Behandlung' : this.props.termin.status}</span>
                            {this.props.termin.adminRead ? 
                                (
                                    <IconContext.Provider value={{size: "1.4em", className: "termin-icon--check" }}>
                                        <MdDone />
                                    </IconContext.Provider>
                                ) : undefined
                            }
                        </p>
                       
                        <p>Uhrzeit:<span className="termin-zeit">{moment(this.props.termin.start).format("DD.MM.YYYY, HH:mm")} Uhr - {moment(this.props.termin.end).format("HH:mm")} Uhr</span>
                        <IconContext.Provider value={{size: "1.8em", className: `${classTimer}` }}>
                            <MdAccessAlarm />
                        </IconContext.Provider>
                        </p>
                        {this.props.termin.status === 'in-behandlung' && this.props.behandlung ? <p>Raum:<span className="termin-zeit">{this.props.behandlung.resourceTitle}</span></p> : undefined}
                        
                    </div>
                    <div className="termin-aktion-container">
                        <h5 className="item__message item__status-message praxis--subheading">Aktionen</h5>
                        {/* Überprüfen, ob der Patient Stammdaten zum Übertragen hinterlegt hat
                        Prüfe anschließend, ob der Termin schon storniert wurde 
                        Prüfe, ob der Patient schon eingecheckt ist
                        */}         
                        {this.renderButtons()}               

                    </div>
                    <div className="termin-aktion-container">
                        <h5 className="item__message item__status-message praxis--subheading">Nachbehandlung</h5>
                        {this.props.termin.status === 'abgeschlossen' ? <p className="editor--message">Abschlussbemerkungen: {this.props.termin.abschlussbemerkung} </p> : undefined}
                        

                    </div>
                    <Modal 
                        isOpen={this.state.isOpen} 
                        contentLabel="Check In" 
                        appElement={document.getElementById('app')}
                        // onAfterOpen={() => this.refs.titel.focus()}
                        onRequestClose={this.handleCheckinClose.bind(this)}
                        className="boxed-view__box"
                        overlayClassName="boxed-view boxed-view--modal"
                    >
                        <h1 className="checkin--headding">Check-In <strong>{this.props.termin.praxis.title}</strong></h1>
                        <form onSubmit={this.onSubmitCheckin.bind(this)} className="boxed-view__form">
                            <p>von: <u>{moment(this.props.termin.start).format('DD.MM.YYYY HH:mm')} Uhr bis {moment(this.props.termin.end).format('HH:mm')} Uhr</u></p>
                            <p>Betreff: {this.props.termin.subject}</p>

                            <div className="daten-info-container">
                                <h5>Datenübermittlung</h5>
                                <p className="editor--message">Um einchecken zu können, müssen Sie ihre Versicherungsdaten angeben! Außerdem müssen Sie zustimmen, dass das System ihre Daten sicher und vertraulich an den Arzt übermittelt!</p>
                            </div>
                            <div className="daten-inhalt-container">
                                <p className="editor-daten--message">
                                    {this.state.kvDaten ? 
                                        <IconContext.Provider value={{size: "1.4em", className: "daten-inhalt-checked" }}>
                                            <MdDone />
                                        </IconContext.Provider> : undefined}
                                    Versicherungs-/Stammdaten übermitteln:</p>
                                <label className="switch">
                                    <input type="checkbox" onChange={this.onChangeKVDaten.bind(this)} checked={this.state.kvDaten} required/>
                                    <span className="slider round"></span>
                                </label>
                                <hr/>
                                <p className="editor-daten--message">
                                    {this.state.fragebogen ? 
                                        <IconContext.Provider value={{size: "1.4em", className: "daten-inhalt-checked" }}>
                                            <MdDone />
                                    </IconContext.Provider> : undefined}
                                    Patientenfragebogen übermitteln:</p>
                                <label className="switch">
                                    <input type="checkbox" onChange={this.onChangeFragebogen.bind(this)} checked={this.state.fragebogen} required/>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <p className="editor-daten--message">
                                {this.state.dsgvo ? 
                                    <IconContext.Provider value={{size: "1.4em", className: "daten-inhalt-checked" }}>
                                        <MdDone />
                                    </IconContext.Provider> : undefined}
                                Ich habe die Datenschutzerklärung gelesen und bin mit deren Geltung einverstanden</p>
                            <label className="switch">
                                <input type="checkbox" onChange={this.onChangeDSGVO.bind(this)} checked={this.state.dsgvo} required/>
                                <span className="slider round"></span>
                            </label>
                            <p className="editor-daten--message">
                                {this.state.agb ? 
                                    <IconContext.Provider value={{size: "1.4em", className: "daten-inhalt-checked" }}>
                                        <MdDone />
                                    </IconContext.Provider> : undefined}
                                Ich habe die AGB gelesen und bin damit, sowie mit der Weiterleitung meiner Daten an die entsprechende Arztpraxis, einverstanden</p>
                            <label className="switch">
                                <input type="checkbox" onChange={this.onChangeAGB.bind(this)} checked={this.state.agb} required/>
                                <span className="slider round"></span>
                            </label>
                            <p className="editor-daten--message error--text">
                                {this.state.uptodate ? 
                                    <IconContext.Provider value={{size: "1.4em", className: "daten-inhalt-checked" }}>
                                        <MdDone />
                                    </IconContext.Provider> : undefined}
                                Hiermit bestätige ich, das ich meine Versicherungsdaten und meinen Fragebogen überprüft und korrekt ausgefüllt habe!</p>
                            <label className="switch">
                                <input type="checkbox" onChange={this.onChangeUpToDate.bind(this)} checked={this.state.uptodate} required/>
                                <span className="slider round"></span>
                            </label>
                             
                            <button type="submit" className="button button--add-account" 
                                // Prüfe, ob alles bestätigt wurde und aktiviere dann den Submit-Button
                                disabled={(this.state.kvDaten && this.state.fragebogen && this.state.dsgvo && this.state.agb && this.state.uptodate) ? false : true}>Termin anlegen</button>
                            <button type="button" className="button button--cancel-account" onClick={this.handleCheckinClose.bind(this)}>abbrechen</button>

                        </form>
                    </Modal>
                </div>
            )
        } else {
            return (
                <div className="editor">
                    <p className="editor--message">
                        {this.props.selectedTerminId ? 'Kein Termin gefunden' : 'Bitte einen Termin auswählen.'}
                    </p>
               </div>
           )
       }
       
    }
}

Editor.propTypes = {
    selectedTerminId: PropTypes.string,
    termin: PropTypes.object,
    event: PropTypes.object,
    konto: PropTypes.object
}

export default withTracker( () => {
    const selectedTerminId = Session.get('selectedTerminId');
    Meteor.subscribe('patiententermine')
    Meteor.subscribe('getBehandlungsraum');
    Meteor.subscribe('meinKonto')
    const termin = Termine.findOne(selectedTerminId)
    const konto = Konten.findOne({user_id: Meteor.userId()})
    
    if(termin){

        const behandlung = Behandlungen.findOne({termin_id: termin._id})

        return {
            selectedTerminId,
            termin,
            konto,
            event: {
                title: `${termin.title} / ${termin.subject}`,
                description: termin.notes,
                location: `${termin.praxis.title}, ${termin.praxis.strasse} ${termin.praxis.nummer}, ${termin.praxis.plz}, ${termin.praxis.stadt}`,
                startTime: termin.start,
                endTime: termin.end
            },
            behandlung,
            Session
        };
    } else {
        return {}
    }

})(Editor);