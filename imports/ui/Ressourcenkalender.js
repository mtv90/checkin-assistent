import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Behandlungen} from '../api/behandlungen';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timeline/main.css';
import '@fullcalendar/resource-timeline/main.css';
import swal from 'sweetalert';

export class Ressourcenkalender extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            termine:[],
            resources:[],
            isOpen: false
        }

    }
    componentDidMount(){
        
        let containerEl = document.getElementById('external-events');
        let calendarEl = document.getElementById('calendar');

        new Draggable(containerEl, {
            itemSelector: '.drag-it',
            eventData: function(eventEl) {
                // console.log(eventEl.firstChild.innerText)
                return {
                    title: eventEl.firstChild.innerText
                };
            }
        });

    }
    startBehandlung(termin_id, dragged_resource, dragged_date){
        const id = termin_id;
        const resourceTitle = dragged_resource.title;
        const resourceId = dragged_resource.id;
        const date = dragged_date;

        // console.log(resource)
        // return 23
        if(termin_id){
            Meteor.call('behandlung.insert',
                id,
                resourceTitle,
                resourceId,
                date,
                (error, result) => {
                    if(error){
                        swal("Fehler", `${error.error}`, "error");
                    } 
                    if(result){

                        swal("Daten erfolgreich gespeichert", `Der Patient/die Patientin wurde ${resourceTitle} zugewiesen`, "success");
                    }
                }
            )
        }
    }
    onSubmit(){

    }
    render(){
        var Spinner = require('react-spinkit');
        if(!this.props.behandlungen){
            return (
                <div className="pacman-view">
                    <Spinner name='pacman' color="#92A8D1" />
                </div>
            )
        }
        return (
                    <div className="resource-cal resource-spacing">
                        <FullCalendar id="calendar"
                            schedulerLicenseKey= "GPL-My-Project-Is-Open-Source"
                            plugins={[ resourceTimelinePlugin, resourceTimeGridPlugin, interactionPlugin ]}
                            defaultView= "resourceTimeGridDay"
                            selectable={true}
                            locale= 'de'
                            height='parent'
                            // dateClick= {function(info) {
                            //     alert('clicked ' + info.dateStr);
                            //   }}
                            // select= {function(info) {
                            //     if(info.startStr >= moment()){
                            //         alert('selected ' + info.startStr + ' to ' + info.endStr)
                            //     } else {
                            //         ()=>{return this.setState({isOpen:true})}
                            //         console.log(info)
                            //     }
                                
                            //   }}
                            minTime= '08:00:00'
                            maxTime= '23:00:00'
                            buttonText={
                                {
                                today: 'heute',
                                }
                            }
                            editable={true}
                            events={ this.props.behandlungen }
                            // eventConstraint= {
                            //     {start: moment().format('YYYY-MM-DDTHH:mm')}
                            //     // end: '20:00:00' // hard coded goodness unfortunately
                            // }
                            eventOverlap={false}
                            droppable={true}
                            
                            drop={(info) => {
                                console.log(info, info.resource, info.draggedEl.id)
                                this.startBehandlung(info.draggedEl.id, info.resource, info.date)
                                info.draggedEl.parentNode.removeChild(info.draggedEl)
                            }} 
                            resourceLabelText= "Behandlungsräume"
                            // resourceGroupField= 'groupId'
                            // resourceGroupText='Praxis'
                            resources= {this.props.praxis.resources}
                        />
                <Modal 
                    isOpen={this.state.isOpen} 
                    contentLabel="" 
                    appElement={document.getElementById('app')}
                    // onAfterOpen={() => this.refs.titel.focus()}
                    // onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h1>Termin hinzufügen</h1>
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        {/* <select name="patienten" onChange={this.onChangePatient.bind(this)}>
                            <option>Patienten auswählen...</option>
                            {this.renderOptions()}
                        </select>
                        <input name="subject" type="text" placeholder="Betreff" value={this.state.subject} onChange={this.onChangeSubject.bind(this)} autoComplete="off"/> */}
                        {/* <label htmlFor="date">Datum:</label>
                        <input name="date" type="date" placeholder="Datum auswählen" value={this.state.date} onChange={this.onChangeDate.bind(this)}/> */}
                        {/* <label htmlFor="starttime">von:</label>
                        <input name="starttime" type="datetime-local" placeholder="Startzeit wählen" value={this.state.start} onChange={this.onChangeStarttime.bind(this)} />
                        <label htmlFor="endtime">bis:</label>
                        {this.state.timeError ? <small className="error--text">{this.state.timeError}</small> : undefined}
                        <input name="endtime" type="datetime-local" placeholder="Ende wählen" value={this.state.end} onChange={this.onChangeEndtime.bind(this)} />
                        <textarea ref="notes" placeholder="Bemerkungen eingeben"value={this.state.notes} onChange={this.onChangeNotes.bind(this)}/>
                        <button type="submit" className="button">Termin anlegen</button>
                        <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button> */}
                    </form>
                </Modal>
        </div>
        )
    }
}
export default withTracker( () => {
    // let handle = 
    Meteor.subscribe('behandlungen');
    // if(handle.ready()){
        
        return {
            behandlungen: Behandlungen.find().fetch(),
            Session
        };   
    // }

})(Ressourcenkalender);