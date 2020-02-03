import React from 'react';
import PropTypes from 'prop-types';
import {Session} from 'meteor/session';

const AccountItem = (props) => {
    const className = props.item.selected ? 'pat-termin-item pat-termin-item--selected' : 'pat-termin-item'
    return ( 
        <div className={className} id={props.item._id} onClick={ () => {
            Session.set('selectedKontoDetails', props.item._id)
            // this.props.termin['patientRead'] = true;
           
        }}>
            <h4>{props.item.title}</h4>
            
        </div>
    )
}

AccountItem.propTypes = {
    item: PropTypes.object
}   

export default AccountItem;