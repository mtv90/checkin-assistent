import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import history from '../routes/history';
import {Praxen} from '../api/praxen';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import {Session} from 'meteor/session';

import FlipMove from 'react-flip-move';
import AddPraxis from './AddPraxis';
import Praxis from './Praxis';

const renderPraxen = (props) => {
    if(props.praxen.length != 0){
        console.log(props.praxen.length)
        
    } else {
        return 
    }
}
export const Praxisliste = (props) => {
    
    return (
        <div className="praxisliste">
            <div className="sidebar-button--wrapper">
            
                <Link className="button button--link button--dashboard" to={{pathname: `/dashboard`}}>Dashboard</Link>
            
                <button className="button button--link button--dashboard" onClick={() => { Accounts.logout(); history.replace('/'); }}>logout</button>
            </div>
            <AddPraxis/>
            <FlipMove maintainContainerHeight={true}>
                { props.praxen.length != 0 ? (props.praxen.map( (praxis) => { 
                        return <Praxis key={praxis._id} praxis={praxis}/>
                    } )) : <p className="empty-item">Praxis anlegen, um anzufangen.</p>
                    
                } 
            </FlipMove>
        </div>
    );
};

export default withTracker( () => {
    const selectedPraxisId = Session.get('selectedPraxisId');
    // let handle = 
    Meteor.subscribe('praxen');
    // if(handle.ready()){
        
        return {
            praxen: Praxen.find().fetch().map( (praxis) => {
                return {
                    ...praxis,
                    selected: praxis._id === selectedPraxisId
                }
            }),
            Session
        };   
    // }

})(Praxisliste);