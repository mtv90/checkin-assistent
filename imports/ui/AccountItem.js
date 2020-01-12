import React from 'react';
import PropTypes from 'prop-types';

const AccountItem = (props) => {
    return (
        <div>
            <h5>{props.accountItem.title}</h5>
        </div>
    )
}

AccountItem.propTypes = {
    accountItem: PropTypes.object.isRequired
}   

export default AccountItem;