import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';

import moment from 'moment';
import Modal from 'react-modal';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';

export default class AddTermin extends React.Component {
    constructor(props){
        super(props)

        this.state={
            patients:[],
            patient_id: '',
            notes:'',
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
        const {patient_id, start, end, notes} = this.state;
        
        Meteor.call('termine.insert', 
            patient_id,
            start,
            end,
            notes,
            (error, result) => {
                if(error) {
                    swal("Fehler", `${error.error}`, "error");
                } else {
                    swal("Daten erfolgreich gespeichert", '', "success");
                    this.handleModalClose();
                }
            }
        );

        e.preventDefault();
    }
    onChange = date => this.setState({ date })

    handleModalClose(){
        Session.set({
            isOpen: false,
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
        })
        this.setState({
            isOpen: false, 
            titel: '',
            timeError: '',
            patient_id:''
        })
    }
    componentDidMount() {

        this.patientTracker = Tracker.autorun(() => {
            Meteor.subscribe('userList');
            let patientsArray = [];
            const patients = Meteor.users.find({role: "patient"}).fetch();
            patients.map(patient => {
                    patient["label"] = `${patient.profile.nachname}, ${patient.profile.vorname}`;
                    patientsArray.push(patient);
            })

            this.setState({
                patients:patientsArray, 
                isOpen: Session.get('isOpen'), 
                start: moment(Session.get('start')).format('YYYY-MM-DDTHH:mm:ss'),
                end: moment(Session.get('start')).add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
            });
        });
    }
    componentDidCatch(){
        this.patientTracker = Tracker.stop();
    }
    getDate(date){

        this.setState({date})
    }
    renderOptions(){
        if(this.state.patients.length === 0) {
            return (
                <option className="item__status-message">Keine Patienten vorhanden!</option>
            )
        }
        return this.state.patients.map((patient) => {
            return (
                <option key={patient._id} ref="pat_id" value={patient._id}>{patient.label}</option>
            )
        });
    }
    onChangeNotes(e){
        const notes = e.target.value;
        if(notes) {
            this.setState({notes});
        }
    }

    onChangeStarttime(e){
        const start = e.target.value;
        if(start) {
            this.setState({start})

        }
    }
    onChangeEndtime(e){
        const end = e.target.value;
        if(end > this.state.start) {
            this.setState({end, timeError: ''});
        } else {
            this.setState({
                timeError: 'Endzeitpunkt muss größer sein!'
            })
        }
        
    }
    onChangePatient(e){
        const patient_id = e.target.value;
        if(patient_id) {
            this.setState({patient_id})
        }
    }
    openTerminModal(){
        this.setState({isOpen: true});
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
                    <h1>Termin hinzufügen</h1>
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        <select name="patienten" onChange={this.onChangePatient.bind(this)}>
                            <option>Patienten auswählen...</option>
                            {this.renderOptions()}
                        </select>
                        {/* <label htmlFor="date">Datum:</label>
                        <input name="date" type="date" placeholder="Datum auswählen" value={this.state.date} onChange={this.onChangeDate.bind(this)}/> */}
                        <label htmlFor="starttime">von:</label>
                        <input name="starttime" type="datetime-local" placeholder="Startzeit wählen" value={this.state.start} onChange={this.onChangeStarttime.bind(this)} />
                        <label htmlFor="endtime">bis:</label>
                        {this.state.timeError ? <small className="error--text">{this.state.timeError}</small> : undefined}
                        <input name="endtime" type="datetime-local" placeholder="Ende wählen" value={this.state.end} onChange={this.onChangeEndtime.bind(this)} />
                        <textarea ref="notes" placeholder="Bemerkungen eingeben"value={this.state.notes} onChange={this.onChangeNotes.bind(this)}/>
                        <button className="button">Termin anlegen</button>
                        <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
                    </form>
                </Modal>
            </div>
        );
    }
}