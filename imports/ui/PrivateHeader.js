import React from 'react';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import history from '../routes/history';
import {Session} from 'meteor/session';

const renderDashboard = (props) => {
    if(!(history.location.pathname === '/dashboard' || history.location.pathname === `/dashboard/${props.praxisId}`)){
        if(props) {
            return <Link className="button button--link button--dashboard" to={{pathname: `/dashboard/${props.praxisId}`}}><h3>Dashboard</h3></Link>
        } else if(!props.praxisId){
            return <Link className="button button--link button--dashboard" to={{pathname: `/dashboard`}}><h3>Dashboard</h3></Link>
        } else {
            return undefined;
        }
    }
}

const PrivateHeader = (props) => {
    return (
        <div className="header">
            <div className="header__content">
                <h1 className="header__title">{props.title}</h1>
                <span className="container-right">
                    {renderDashboard(props)}
                    <button className="button button--link-text button--logout" onClick={() => { Accounts.logout(); history.replace('/'); }}>logout</button>
                </span>
            </div>
        </div>
    );
    
}

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired,
    praxisId: PropTypes.string
}

export default withTracker( () => {
    const praxisId = Session.get('praxisId');
    
    return { praxisId };
    
    
})(PrivateHeader);