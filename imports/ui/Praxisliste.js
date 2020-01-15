import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Praxen} from '../api/praxen';

import {Session} from 'meteor/session';

import FlipMove from 'react-flip-move';
import AddPraxis from './AddPraxis';
import Praxis from './Praxis';


export const Praxisliste = (props) => {
    
    return (
        <div>
            <AddPraxis/>
            <FlipMove maintainContainerHeight={true}>
                {props.praxen.map( (praxis) => {
                    return <Praxis key={praxis._id} praxis={praxis}/> 
                })}
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