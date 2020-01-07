import React from 'react';

import history from '../routes/history';
import PrivateHeader from './PrivateHeader';
import TerminListe from './TerminListe';
import Warteliste from './Warteliste';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import {Termine} from '../api/termine';
import {Session} from 'meteor/session';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timeline/main.css';
import '@fullcalendar/resource-timeline/main.css';

export default class Wartezimmer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isOpen: false,
            termine:[],
            resources: [
                {
                    id: '1',
                    groupId: 'Praxis 1',
                    title: 'Behandlungsraum 1'
                },
                {
                    id: '2',
                    groupId: 'Praxis 1',
                    title: 'Behandlungsraum 2'
                },
                {
                    id: '3',
                    groupId: 'Praxis 2',
                    title: 'Behandlungsraum 3'
                }
            ]
        }

    }
    componentDidMount(){

        let containerEl = document.getElementById('external-events');
        let calendarEl = document.getElementById('calendar');

        new Draggable(containerEl, {
            itemSelector: '.drag-it',
            eventData: function(eventEl) {
                console.log(eventEl.firstChild.innerText)
                return {
                    title: eventEl.firstChild.innerText
                };
            }
        });

        this.terminTracker = Tracker.autorun(() => {
            Meteor.subscribe('termine');
            const termine = Termine.find().fetch();
        
            if(termine) {
  
              this.setState({termine, isLoading: false})
            }
            
          });
    }
    openNav(){
        document.getElementById("mySidenav").style.width = "250px";
        
    }
    closeNav(){
        document.getElementById("mySidenav").style.width = "0";
        
    }
    render() {
        return (
            <div className="">
                <PrivateHeader title="Admin" button="Dashboard"/>
                <button type="button" className="button menu" onClick={this.openNav.bind(this)}>&#9776;</button>
                <div id="mySidenav" className="sidenav">
                    <a type="button" className="closebtn" onClick={this.closeNav.bind(this)}>&times;</a>
                    <TerminListe/>
                </div>
                <div className="wrapper">
                    <div id="external-events" className="termin-liste">
                        <Warteliste/>
                        <hr/>
                        <TerminListe/>
                    </div>
                    <div className="resource-cal resource-spacing">
                        <FullCalendar id="calendarEl"
                            schedulerLicenseKey= "GPL-My-Project-Is-Open-Source"
                            plugins={[ resourceTimelinePlugin, interactionPlugin ]}
                            defaultView= "resourceTimeline"
                            locale= 'de'
                            // height='parent'
                            minTime= '08:00:00'
                            maxTime= '18:00:00'
                            buttonText={
                                {
                                today: 'heute',
                                }
                            }
                            editable={true}
                            events={ this.state.termine }
                            droppable={true}
                            drop={(info) => {
                                console.log(info)
                                info.draggedEl.parentNode.removeChild(info.draggedEl)
                            }} 
                            resourceLabelText= "Behandlungsräume"
                            resourceGroupField= 'groupId'
                            resourceGroupText='Praxis'
                            resources= {this.state.resources}
                        />
                    </div>
                </div>
            </div>
        )
    }
}