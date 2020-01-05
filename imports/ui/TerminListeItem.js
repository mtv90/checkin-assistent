import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';

export default class TerminListeItem extends React.Component {
    constructor(props){
        super(props);
    }

    handleRemoveItem(e){
        
        e.preventDefault();
        const _id = this.props._id;
        if(!!_id){
            Meteor.call('termine.remove', _id,
                (err, res) => {
                    if(err) {
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        swal("Daten wurden erfolgreich entfernt", '', "success");
                    }
                }
            )
        }
    }
    render() {
        return (
            <div className="item" id={this.props._id}>
                <h2>{this.props.title}</h2>
                {/* <p className="item__message">Hier sollen mal Termin etc. stehen</p> */}
                <button className="button button--pill" onClick={() => alert('Test')}>anzeigen</button>
                <button className="button button--pill" onClick={() => alert('Test 2')}>bearbeiten</button>
                <button className="button button--pill" onClick={this.handleRemoveItem.bind(this)}>löschen</button>
            </div>
        )
    }
}
TerminListeItem.propTypes = {
    _id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
