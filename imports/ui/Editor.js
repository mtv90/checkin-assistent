import React from 'react';
import {Link} from 'react-router-dom';
import {Meteor} from 'meteor/meteor'
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Termine} from '../api/termine';
import {Konten} from '../api/konten';
import PropTypes from 'prop-types';
import { IconContext } from "react-icons";
import { MdDone } from "react-icons/md";
import moment from 'moment';
import swal from 'sweetalert';
import AddToCalendar from 'react-add-to-calendar';
import { Behandlungen } from '../api/behandlungen';

import 'react-add-to-calendar/dist/react-add-to-calendar.css'


export class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            termin: null
        }
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
        // e.preventDefault();
        let termin = {
            ...this.props.termin
        };
        
        if(!!termin._id){
            termin['checkedIn'] = true;
            termin['adminRead'] = false;
            termin['status'] = 'waiting';
            Meteor.call('termin.check', termin._id, termin,
                (err, res) => {
                    if(err) {
                        console.log(err)
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        
                        swal("Erfolgreich eingechecked", "Bitte nehmen Sie im Wartezimmer Platz.", "success");
                    }
                }
            );
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
    render() {
        var Spinner = require('react-spinkit');
        if(this.props.termin) {
            const statusClass = this.props.termin.status === 'waiting' ? 'termin-status waiting': this.props.termin.status === 'in-behandlung' ? 'termin-status in-behandlung' : this.props.termin.status === 'storniert' ? 'termin-status storno' : 'termin-status';
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
                       
                        <p>Uhrzeit:<span className="termin-zeit">{moment(this.props.termin.start).format("DD.MM.YYYY, HH:mm")} Uhr - {moment(this.props.termin.end).format("HH:mm")} Uhr</span></p>
                        {this.props.termin.status === 'in-behandlung' && this.props.behandlung ? <p>Raum:<span className="termin-zeit">{this.props.behandlung.resourceTitle}</span></p> : undefined}
                        
                    </div>
                    <div className="termin-aktion-container">
                        <h5 className="item__message item__status-message praxis--subheading">Aktionen</h5>
                        {/* Überprüfen, ob der Patient Stammdaten zum Übertragen hinterlegt hat
                        Prüfe anschließend, ob der Termin schon storniert wurde 
                        Prüfe, ob der Patient schon eingecheckt ist
                        */}                        
                        {!this.props.termin.checkedIn ? 
                            this.props.konto? this.props.termin.status === 'storniert' ? 
                                <div>
                                    <p className="editor--message error--text">Der Termin wurde <strong>strorniert</strong>! Bitte wenden Sie sich an die Praxis oder vereinbaren einen neuen Termin.</p>
                                </div> :
                                <div className="editor--button-group">
                                    <button type="button" className="editor-button button--checkin" onClick={this.checkIn.bind(this)}>einchecken</button>
                                    <button type="button" className="editor-button button--checkin waiting" onClick={this.handleDelay.bind(this)}>Verspätung melden</button>
                                    <button type="button" className="editor-button button--checkin storno" onClick={this.handleStorno.bind(this)}>absagen</button>
                                </div> :
                            <div>
                                <p className="editor--message error--text">Um einchecken zu können, müssen Sie ihre Daten hinterlegen. Dies ist unter <Link className="error--link" to={`/patient/${Meteor.userId}`}><strong>Mein Konto</strong></Link> möglich.</p>
                            </div>
                              
                        : 
                            <p className="editor--message">Sie sind bereits eingechecked</p>}
                    </div>
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
        // console.log(termin)
        // if(termin.patientRead === false){
        //     swal("Neues zu Ihrem Termin", `Der neue Status ihres Termins ist: ${termin.status}`, 'warning')
        //         .then(() => {
        //             termin['adminRead'] = true;
        //             termin['patientRead'] = true;
        //             Meteor.call('termin.check', termin._id, termin, (err, res) => {
        //                 if(err) {
        //                     console.log(err)
        //                     swal("Fehler", `${err.error}`, "error");
        //                 } else {
                            
        //                     swal("Mitteilung als gelesen markiert", "", "success");
        //                 }
        //             })
        //         })
        // }
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