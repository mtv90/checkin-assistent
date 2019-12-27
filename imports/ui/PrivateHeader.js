import React from 'react';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';

const PrivateHeader = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <button className="" onClick={() => Accounts.logout()}>logout</button>
        </div>
    )
}

PrivateHeader.propTypes = {
    title: PropTypes.string.isRequired
}

export default PrivateHeader;