import React from 'react'
import PropTypes from 'prop-types';

export default class TerminListeItem extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div>
                <p>{this.props.titel}</p>
            </div>
        )
    }
}
TerminListeItem.propTypes = {
    _id: PropTypes.string.isRequired,
    titel: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
