import React from 'react';
import {Termine} from '../api/termine';
import swal from 'sweetalert';

export default class Termin extends React.Component {
    onSubmit(e) {
        
        const titel = this.refs.titel.value.trim();
        Meteor.call('termine.insert', titel,
            (error, result) => {
                if(error) {
                    swal("Fehler", `${error.message}`, "error");
                } else {
                    swal("Daten erfolgreich gespeichert", '', "success");
                    this.refs.titel.value = '';
                }
            }
        );

        e.preventDefault();
    }
    render() {
        return (
            <div>
                <p>Termin hinzufügen</p>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <input type="text" ref="titel" placeholder="Titel eingeben" />
                    <button>Termin anlegen</button>
                </form>
            </div>
        );
    }
}