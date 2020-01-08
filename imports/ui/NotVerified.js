import React from 'react';
import {Link} from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';

export default class NotVerified extends React.Component {
    resentMail() {
        Meteor.call('resentEmail','', 
            (err, res) => {
                if(err){
                    swal("Fehler", `${err.error}`, "error");
                  } else{
                    swal("Bestätigungslink versendet", "Bitte verifizieren Sie ihr Konto, indem Sie dem versendeten Link folgen.", "success");
                  }
            });
    }
    render () {
        return (
            <div className="boxed-view">
                <div className="boxed-view__box">
                    <h1>Konto noch nicht verifiziert</h1>
                    <p>Wir haben Ihnen eine Bestätigungs-Mail gesendet. Bitte bestätigen Sie ihr Konto über den darin enthaltenen Link!</p>
                    <Link className="button button--link" to="/">ZURÜCK</Link>
                    <p className="info-text">
                        <small>
                            Sie haben keinen Link erhalten? <br/> Neuen Link <button onClick={this.resentMail.bind(this)} type="button" className="resent-button">anfordern</button>
                        </small>
                    </p>
                </div>
            </div>
        )
    }
}