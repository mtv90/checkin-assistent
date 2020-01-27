import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

import history from '../routes/history';

export class Patientheader extends React.Component {
    navToggle = () => {
        Session.set('isNavOpen', !Session.get('isNavOpen'))
    }
    // history.location.pathname === '/dashboard'
    render(){
        const imgSrc = this.props.isNavOpen ? '/img/x.svg' : '/img/bars.svg';
    
        return (
           
            <div className="header patient-header">
                <div className="header__content">
                   {history.location.pathname.startsWith("/dashboard") ? undefined : <img className="header__nav-toggle" src={imgSrc} onClick={this.navToggle.bind(this)}/>}
                    <h1 className="header__title">{this.props.title}</h1>
                    <span className="header-container-right">
                        { !(history.location.pathname === '/dashboard') ? (<Link className="button button--link button--dashboard button--patient" to="/dashboard"><h3>Dashboard</h3></Link>) : undefined}
                        <button className="button button--link-text button--logout" onClick={() => Accounts.logout()}>logout</button>
                    </span>
                </div>
            </div>
        );
    }

};
Patientheader.propTypes = {
    title: PropTypes.string.isRequired
}
// export default Patientheader;
export default withTracker( () => {
    const praxisId = Session.get('praxisId');
    
    return { 
        handleLogout: () => Accounts.logout(),
        praxisId,
        isNavOpen: Session.get('isNavOpen') 
    };
    
    
})(Patientheader);