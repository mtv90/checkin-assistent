import React from 'react'
import PropTypes from 'prop-types';

export default class TerminListeItem extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="item">
                <h2>{this.props.titel}</h2>
                <p className="item__message">Hier sollen mal Termin etc. stehen</p>
                <button className="button button--pill" onClick={() => alert('Test')}>anzeigen</button>
                <button className="button button--pill" onClick={() => alert('Test 2')}>bearbeiten</button>
            </div>
        )
    }
}
TerminListeItem.propTypes = {
    _id: PropTypes.string.isRequired,
    titel: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
