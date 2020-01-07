import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import Modal from 'react-modal';
import Spinner from 'react-spinkit';

export default class TerminListeItem extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            isLoading: false,
            isOpen: false
        }
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
    checkIn(e){
        e.preventDefault();
        let termin = {
            ...this.props
        };
        
        if(!!termin._id){
            termin['checkedIn'] = true;
            Meteor.call('termin.check', termin._id, termin,
                (err, res) => {
                    if(err) {
                        console.log(err)
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        
                        swal("Patient erfolgreich eingechecked", "Er kann nun einem Behandlungszimmer zugewiesen werden.", "success");
                    }
                }
            );
        }
    }
    render() {
        return (
            <div className="item" id={this.props._id}>
                <Modal
                    isOpen={this.state.isLoading}  
                    appElement={document.getElementById('app')}
                    contentLabel="Warte auf Datenübermittlung"
                    // onAfterOpen={() => this.refs.titel.focus()}
                    // onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h2>Warte, bis Daten übermittelt wurden...</h2>
                    <Spinner name='ball-grid-pulse' className="spinner-box" color="#92A8D1" />
                    
                </Modal>
                <h4>{this.props.title}</h4>
                {/* <p className="item__message">Hier sollen mal Termin etc. stehen</p> */}
                <button type="button" className="button button--pill" onClick={this.checkIn.bind(this)}>einchecken</button>
                <button type="button" className="button button--pill" onClick={() => alert('Test 2')}>bearbeiten</button>
                <button type="button" className="button button--pill" onClick={this.handleRemoveItem.bind(this)}>löschen</button>
            </div>
        )
    }
}
TerminListeItem.propTypes = {
    _id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
