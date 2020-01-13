import React from 'react';

import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';

import history from '../routes/history';

export const Patientheader = (props) => {
    return (
        <div className="header patient-header">
            <div className="header__content">
                <h1 className="header__title">{props.title}</h1>
                <span className="container-right">
                    { !(history.location.pathname === '/dashboard') ? (<Link className="button button--link button--dashboard button--patient" to="/dashboard"><h3>Dashboard</h3></Link>) : undefined}
                    <button className="button button--link-text button--logout" onClick={() => Accounts.logout()}>logout</button>
                </span>
            </div>
        </div>
    );
};
Patientheader.propTypes = {
    title: PropTypes.string.isRequired
}
export default Patientheader;