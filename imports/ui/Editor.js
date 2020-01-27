import React from 'react';
import {Meteor} from 'meteor/meteor'
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Termine} from '../api/termine';
import PropTypes from 'prop-types';
import moment from 'moment';
import swal from 'sweetalert';
import AddToCalendar from 'react-add-to-calendar';
import { Behandlungen } from '../api/behandlungen';

import 'react-add-to-calendar/dist/react-add-to-calendar.css'


export class Editor extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        if(this.props.termin){
            this.props.termin.patient === false ? swal("Neues zu Ihrem Termin", `Der neue Status ihres Termins ist: ${this.props.termin.status}`, 'warning'): undefined;
                // .then((val) => {
                //     if(val){
                //         Meteor.call('termin.check')
                //     }
                // })
        }
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
    render() {
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
                        <AddToCalendar displayItemIcons={true} buttonLabel="export" event={this.props.event}/>
                        <p>Status: <span className={statusClass}>{this.props.termin.status}</span> </p>
                       
                        <p>Uhrzeit:<span className="termin-zeit">{moment(this.props.termin.start).format("DD.MM.YYYY, HH:mm")} Uhr - {moment(this.props.termin.end).format("HH:mm")} Uhr</span></p>
                        {this.props.termin.status === 'in-behandlung' && this.props.behandlung ? <p>Raum:<span className="termin-zeit">{this.props.behandlung.resourceTitle}</span></p> : undefined}
                        
                    </div>
                    <div className="termin-aktion-container">
                        <h5 className="item__message item__status-message praxis--subheading">Aktionen</h5>
                        {!this.props.termin.checkedIn ? <button type="button" className="button button--checkin" onClick={this.checkIn.bind(this)}>einchecken</button> : <p className="editor--message">Sie sind bereits eingechecked</p>}
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
    event: PropTypes.object
}

export default withTracker( () => {
    const selectedTerminId = Session.get('selectedTerminId');
    Meteor.subscribe('patiententermine')
    Meteor.subscribe('getBehandlungsraum');
    const termin = Termine.findOne(selectedTerminId)
    
    
    if(termin){
        const behandlung = Behandlungen.findOne({termin_id: termin._id})
        console.log(termin)
        if(termin.patientRead === false){
            swal("Neues zu Ihrem Termin", `Der neue Status ihres Termins ist: ${termin.status}`, 'warning')
                .then(() => {
                    termin['adminRead'] = true;
                    termin['patientRead'] = true;
                    Meteor.call('termin.check', termin._id, termin, (err, res) => {
                        if(err) {
                            console.log(err)
                            swal("Fehler", `${err.error}`, "error");
                        } else {
                            
                            swal("Mitteilung als gelesen markiert", "", "success");
                        }
                    })
                })
        }
        return {
            selectedTerminId,
            termin,
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