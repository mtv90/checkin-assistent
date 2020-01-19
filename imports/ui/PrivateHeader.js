import React from 'react';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import history from '../routes/history';
import {Session} from 'meteor/session';

export class PrivateHeader extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props)
    }
    renderDashboard = (props) => {
        const praxisId = this.props.praxisId || this.props.praxis._id;
        if(!(history.location.pathname === '/dashboard' || history.location.pathname === `/dashboard/${praxisId}`)){
            if(praxisId) {
                return <button className="button button--link button--dashboard" onClick={() => history.replace(`/dashboard/${praxisId}`) }><h3>Dashboard</h3></button>
            } 

            else {
               return !praxisId ?  <button className="button button--link button--dashboard" onClick={() => history.replace(`/dashboard`) }><h3>Dashboard</h3></button> : undefined;
            }
        }
    }
    navToggle = () => {
        Session.set('isNavOpen', !Session.get('isNavOpen'))
    }
    render(){
    const imgSrc = this.props.isNavOpen ? '/img/x.svg' : '/img/bars.svg';
    return (
        <div className="header">
            <div className="header__content">
                <img className="header__nav-toggle" src={imgSrc} onClick={this.navToggle.bind(this)}/>
                <h1 className="header__title">{this.props.title}</h1>
                <span className="header-container-right">
                    {this.renderDashboard(this.props)}
                    <button className="button button--link-text button--logout" onClick={() => { this.props.handleLogout(); history.replace('/'); }}>logout</button>
                </span>
            </div>
        </div>
    );
    } 
}

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired,
    praxis: PropTypes.object,
    praxisId: PropTypes.string,
    isNavOpen: PropTypes.bool.isRequired,
}

export default withTracker( () => {
    const praxisId = Session.get('praxisId');
    
    return { 
        handleLogout: () => Accounts.logout(),
        praxisId,
        isNavOpen: Session.get('isNavOpen') 
    };
    
    
})(PrivateHeader);