import React from 'react';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';

const PrivateHeader = (props) => {
    return (
        <div className="header">
            <div className="header__content">
                <h1 className="header__title">{props.title}</h1>
                <span className="container-right">
                    {props.button === 'Dashboard' ? (<Link className="button button--link button--dashboard" to="/dashboard"><h3>Dashboard</h3></Link>) : undefined}
                    <button className="button button--link-text button--logout" onClick={() => Accounts.logout()}>logout</button>
                </span>
              </div>
        </div>
    )
}

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired
}

export default PrivateHeader;