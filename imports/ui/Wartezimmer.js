import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import history from '../routes/history';
import PropTypes from 'prop-types';
import PrivateHeader from './PrivateHeader';
import TerminListe from './TerminListe';
import Warteliste from './Warteliste';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import Ressourcenkalender from './Ressourcenkalender';
import {Link} from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import {Termine} from '../api/termine';
import {Praxen} from '../api/praxen';
import {Session} from 'meteor/session';

import '@fullcalendar/core/main.css';
import '@fullcalendar/timeline/main.css';
import '@fullcalendar/resource-timeline/main.css';

export class Wartezimmer extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            isOpen: false,
            praxis:{},
            termine:[],
            praxisId_warte: '',
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

    openNav(){
        document.getElementById("mySidenav").style.width = "250px";
        
    }
    closeNav(){
        document.getElementById("mySidenav").style.width = "0";
        
    }
    renderDashboard = (props) => {
        const praxisId = this.props.praxisId || (this.props.praxis ? this.props.praxis._id : undefined);
        if(!(history.location.pathname === '/dashboard' || history.location.pathname === `/dashboard/${praxisId}`)){
            if(praxisId) {
                return <button className="button button--link button--dashboard" onClick={() => {
                    Session.set('isNavOpen', !Session.get('isNavOpen')) 
                    history.replace(`/dashboard/${praxisId}`)} }><h3>Dashboard</h3></button>
            } 

            else {
               return !praxisId ?  <button className="button button--link button--dashboard" onClick={() => {
                Session.set('isNavOpen', !Session.get('isNavOpen'))    
                history.replace(`/dashboard`)} }><h3>Dashboard</h3></button> : undefined;
            }
        }
    }
    render() {
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
                <PrivateHeader title={this.props.praxis.title} praxis={this.props.praxis} button="Dashboard"/>
                <div className="wrapper">
                    <div id="external-events" className="page-content-wartezimmer__sidebar">
                    <div className="sidebar-button--wrapper">
                            
                            {this.renderDashboard(this.props)}
                        
                            <button className="button button--link button--dashboard" onClick={() => { Accounts.logout(); history.replace('/'); }}>logout</button>
                        </div>
                        <Warteliste praxisId={this.props.praxisId_warte}/>
                        <hr/>
                        <TerminListe praxisId={this.props.praxisId_warte}/>
                    </div>
                    <Ressourcenkalender praxis={this.props.praxis}/>
                </div>
            </div>
        )
    }
}
Wartezimmer.propTypes = {
    praxis: PropTypes.object,
    praxisId_warte: PropTypes.string,
}

export default withTracker( () => {
    const praxisId_warte = Session.get('praxisId_warte');
    
    Meteor.subscribe('meine_praxen');
    const praxis = Praxen.findOne(praxisId_warte);
    
    return {
        praxisId_warte,
        praxis
    };
})(Wartezimmer);