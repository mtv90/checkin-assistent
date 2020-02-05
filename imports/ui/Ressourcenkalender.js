import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Behandlungen} from '../api/behandlungen';
import Modal from 'react-modal';
import swal2 from 'sweetalert2';
import PropTypes from 'prop-types';
import {Termine} from '../api/termine';
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
                
                return {
                    title: eventEl.firstChild.innerText,
                    create: false
                };
            }
        });

    }
    startBehandlung(termin_id, dragged_resource, dragged_date){
        const id = termin_id;
        const resourceTitle = dragged_resource.title;
        const resourceId = dragged_resource.id;
        const date = dragged_date;
        
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
    updateBehandlung(behandlung_id, resource, dragged_event, termin_id){
        
        const behandlung= {
            id: behandlung_id,
            resourceTitle: resource.title,
            resourceId: resource.id,
            start: dragged_event.start,
            end: dragged_event.end,
            termin_id: termin_id 
        }

        Meteor.call('behandlung.update',
            behandlung.id,
            behandlung,
            (error, result) => {
                if(error){
                    swal("Fehler", `${error.error}`, "error");
                }
                if(result){
                    swal("Termin akualisiert","", "success")
                }
            }
        );
    }
    handleEventOpen(e){
        console.log(e)
        if(e.event._def.extendedProps.status !== 'abgeschlossen'){
            const termin_id = e.event._def.extendedProps.termin_id
            Meteor.subscribe('termine');
            Meteor.subscribe('getBehandlungsraum')
            const mytermin = Termine.findOne({_id: termin_id})
            let behandlung = Behandlungen.findOne({termin_id: termin_id});
         
            swal({
                title: `Termin abschließen: ${mytermin.title}`,
                text: `Möchten Sie den Termin abschließen?`,
                buttons: ["abbrechen", true],
                content: {
                  element: "input",
                  attributes: {
                    placeholder: "Abschlussbemerkung eingeben",
                    type: "text",
                  },
                }
              }).then((value) => {
                  if(value){
                    let termin = {
                        ...mytermin,
                        abschlussbemerkung: value,
                        status: 'abgeschlossen',
                        patientRead: false
                    }
                    Meteor.call('termin.update', 
                    termin._id, 
                    termin,
                    (error, result) => {
                      if(error){
                        swal(`${error.error}`,"","error")
                      }
                      if(result){
                        
                        Meteor.call('termin.update_mail_finished',
                          termin.patient.emails[0].address, 
                          termin.praxis.title, 
                          termin.subject, 
                          termin,
                          (error, result) => {
                            if(error){
                              swal('Fehler', `${error.error}`, 'error');
                            }
                          });
                        behandlung = {
                            ...behandlung,
                            status: 'abgeschlossen',
                            backgroundColor: '#16A086',
                            editable: false
                        }
                        Meteor.call('behandlung.abschluss_update',
                            behandlung._id, behandlung,
                            (err, res) => {
                                if(err){
                                    swal('Fehler', `${err.error}`, 'error');
                                }
                            }
                        )
                        this.handleModalClose();
                        swal('Termin abgeschlossen',"","success");
                      }
                    }
                  );
                  
                  }
              });
        } else{
            swal2.fire({
                position: 'top-end',
                icon: 'warning',
                title: 'Termin beendet',
                text: 'Der Termin wurde bereits erfolgreich abgeschlossen ',
                showConfirmButton: false,
                timer: 5000,
                toast:true
              })
        }
    }
    handleEventClose(){
        this.setState({isOpen:false})
    }
    onSubmit(){}
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
            <div className="kalender-container resource-cal resource-spacing">
                        <FullCalendar id="calendar"
                            schedulerLicenseKey= "GPL-My-Project-Is-Open-Source"
                            plugins={[ resourceTimelinePlugin, resourceTimeGridPlugin, interactionPlugin ]}
                            defaultView= "resourceTimeGridDay"
                            selectable={true}
                            locale= 'de'
                            height='parent'
                            
                            eventClick= {this.handleEventOpen.bind(this)}
                            minTime= '08:00:00'
                            maxTime= '23:00:00'
                            buttonText={
                                {
                                today: 'heute',
                                }
                            }
                            editable={true}
                            events={ this.props.behandlungen }
                            
                            eventOverlap={false}
                            droppable={true}
                            // Drag n Drop Funktionalität innerhalb des Ressourcenkalenders
                            eventDrop={info => {
                                if(info.event._def.extendedProps.status !== 'abgeschlossen'){
                                    const behandlung_id = info.event._def.extendedProps._id;
                                    let resource;
                                    if(info.newResource){
                                        resource= info.newResource;
                                    } else{
                                        resource = {
                                            id: info.event._def.resourceIds[0],
                                            title: info.event._def.extendedProps.resourceTitle
                                        }
                                    }
                                    
                                    const event = info.event;
                                    const termin_id = info.event._def.extendedProps.termin_id
    
                                    this.updateBehandlung(behandlung_id, resource, event, termin_id )
                                } else {
                                    swal2.fire({
                                        position: 'top-end',
                                        icon: 'warning',
                                        title: 'Termin beendet',
                                        text: 'Der Termin wurde bereits erfolgreich abgeschlossen ',
                                        showConfirmButton: false,
                                        timer: 5000,
                                        toast:true
                                      })
                                      return false
                                }
                                
                            }}
                            // Drag n Drop Funktionalität vom Wartezimmer in den Ressourcenkalender 
                            drop={(info) => {
                                
                                this.startBehandlung(info.draggedEl.id, info.resource, info.date)
                                info.draggedEl.parentNode.removeChild(info.draggedEl)
                            }} 
                            // Funktion, um die Behandlungsdauer zu verlängern 
                            eventResize={(info) => {
                                const behandlung_id = info.event.id;
                                const resource = {
                                    id: info.event._def.resourceIds[0],
                                    title: info.event._def.extendedProps.resourceTitle
                                }
                                const event = {
                                    start: info.event.start,
                                    end: info.event.end
                                }
                                const termin_id = info.event._def.extendedProps.termin_id;
                                this.updateBehandlung(behandlung_id, resource, event, termin_id )
                            }}
                            resourceLabelText= "Behandlungsräume"
                            resources= {this.props.praxis.resources}
                            
                        />
        </div>
        )
    }
}
export default withTracker( () => {
    Meteor.subscribe('behandlungen');
        return {
            behandlungen: Behandlungen.find().fetch(),
            Session
        };   
})(Ressourcenkalender);