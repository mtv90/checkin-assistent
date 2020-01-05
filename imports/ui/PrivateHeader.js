import React from 'react';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';

const PrivateHeader = (props) => {
    return (
        <div className="header">
            <div className="header__content">
                <h1 className="header__title">{props.title}</h1>
                {props.button === 'Dashboard' ? (<Link className="button button--link" to="/dashboard"><i className="fas fa-home"></i></Link>) : undefined}
                <button className="button button--link-text" onClick={() => Accounts.logout()}>logout</button>
            </div>
        </div>
    )
}

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired
}

export default PrivateHeader;