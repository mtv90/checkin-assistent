import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { withTracker  } from 'meteor/react-meteor-data';
import moment from 'moment';
import Modal from 'react-modal';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';
import { Praxen } from '../api/praxen';

export default class AddTermin extends React.Component {
    constructor(props){
        super(props)

        this.state={
            patients:[],
            patient_id: '',
            notes:'',
            subject:'',
            isOpen: false,
            date: moment().format('YYYY-MM-DD'),
            start: null,
            end: null,
            error: '',
            timeError: ''
        }
    }
    onSubmit(e) {
        e.preventDefault();
        const {patient_id, start, end, notes, subject} = this.state;
        const praxis = this.props.praxis;
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
    onChange = date => this.setState({ date })

    handleModalClose(){
        Session.set({
            isOpen: false,
            start: moment().format('YYYY-MM-DDTHH:mm'),
            end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm')
        })
        this.setState({
            isOpen: false, 
            titel: '',
            subject: '',
            notes:'',
            timeError: '',
            patient_id:'',
            start: moment().format('YYYY-MM-DDTHH:mm'),
            end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm')
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
    onChangeNotes(e){
        const notes = e.target.value;
        this.setState({notes});
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
            this.setState({end, timeError: ''});
        }
        
    }
    onChangePatient(e){
        const patient_id = e.target.value;
        if(patient_id) {
            this.setState({patient_id})
        }
    }
    onChangeSubject(e){
        const subject = e.target.value;
        // if(subject) {
        this.setState({subject});
        // }
    }
    openTerminModal(){
        this.setState({isOpen: true});
    }
    componentDidMount(){
        this.modalTracker = Tracker.autorun( () => {
            const isOpen = Session.get('isOpen')
            const start =  moment(Session.get('start')).format('YYYY-MM-DDTHH:mm')
            const end = moment(Session.get('end')).format('YYYY-MM-DDTHH:mm')
            
            this.setState({
                isOpen, start, end
            })
        })
    }
    render() {
        return (
            <div className="add-termin--container">
                <button className="button button--add" onClick={this.openTerminModal.bind(this)}>+ Termin anlegen</button>
                <Modal 
                    isOpen={this.state.isOpen} 
                    contentLabel="Termin anlegen" 
                    appElement={document.getElementById('app')}
                    // onAfterOpen={() => this.refs.titel.focus()}
                    onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h1>Termin erstellen</h1>
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        <select className="admin-input" name="patienten" onChange={this.onChangePatient.bind(this)}>
                            <option>Patienten auswählen...</option>
                            {this.renderOptions()}
                        </select>
                        <input className="admin-input" name="subject" type="text" placeholder="Betreff" value={this.state.subject} onChange={this.onChangeSubject.bind(this)} autoComplete="off"/>
                        {/* <label htmlFor="date">Datum:</label>
                        <input name="date" type="date" placeholder="Datum auswählen" value={this.state.date} onChange={this.onChangeDate.bind(this)}/> */}
                        <label htmlFor="starttime">von:</label>
                        <input className="admin-input" name="starttime" type="datetime-local" placeholder="Startzeit wählen" value={this.state.start } onChange={this.onChangeStarttime.bind(this)} />
                        <label htmlFor="endtime">bis:</label>
                        {this.state.timeError ? <small className="error--text">{this.state.timeError}</small> : undefined}
                        <input className="admin-input" name="endtime" type="datetime-local" placeholder="Ende wählen" value={this.state.end} onChange={this.onChangeEndtime.bind(this)} />
                        <textarea name="notes" placeholder="Bemerkungen eingeben" value={this.state.notes} onChange={this.onChangeNotes.bind(this)}/>
                        <button type="submit" className="button">Termin anlegen</button>
                        <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
                    </form>
                </Modal>
            </div>
        );
    }
}
// export default withTracker( (props) => {
//     const isOpen = Session.get('isOpen')
//     const start =  moment(Session.get('start')).format('YYYY-MM-DDTHH:mm')
//     const end = moment(Session.get('end')).format('YYYY-MM-DDTHH:mm')
//     console.log(props)
//     const modal = props.modal
//     return {
//         modal,
//         isOpen,
//         start,
//         end,
        
//     };
//   })(AddTermin);