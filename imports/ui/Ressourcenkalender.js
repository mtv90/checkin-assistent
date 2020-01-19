import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Praxen} from '../api/praxen';
import PropTypes from 'prop-types';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timeline/main.css';
import '@fullcalendar/resource-timeline/main.css';

export default class Ressourcenkalender extends React.Component {
    constructor(props){
        super(props)
        this.state= {
            termine:[],
            resources:[]
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

    }
    render(){
        return (
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
                            // resourceGroupField= 'groupId'
                            // resourceGroupText='Praxis'
                            resources= {this.props.praxis.resources}
                        />
                    </div>
        )
    }
}