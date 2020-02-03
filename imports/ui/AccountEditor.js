import React from 'react';
import {Meteor} from 'meteor/meteor'
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Konten} from '../api/konten';
import PropTypes from 'prop-types';
import moment from 'moment';
import swal from 'sweetalert';
import { Tracker } from 'meteor/tracker';

export class AccountEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            konto: null,
            edit: false,
            user: {
                profile:{
                    vorname:'',
                    nachname:'',
                },
                emails:[
                    {address:''}
                ]
            },
            isOpen: false,
            isLoading: false,
            errors: [],
            anrede:'',
            vorname: '',
            nachname: '',
            geburtsdatum: '',
            strasse: '',
            nummer: '',
            plz: '',
            stadt: '',
            telefon: '',
            email:'',
            versicherung:'',
            versicherungsnummer:'',
            versichertennummer:'',
        }
    }
    componentDidMount(){

        this.props.user ? this.setState({user: {...this.props.user}}) : null;
        
        this.setState({
                konto: {...this.props.konto},
                anrede: this.props.konto.kategorien[0].profile.anrede,
                vorname: this.props.konto.kategorien[0].profile.vorname,
                nachname: this.props.konto.kategorien[0].profile.nachname,
                geburtsdatum: this.props.konto.kategorien[0].profile.geburtsdatum,
                strasse: this.props.konto.kategorien[0].kontakt.anschrift.strasse,
                nummer: this.props.konto.kategorien[0].kontakt.anschrift.nummer,
                plz: this.props.konto.kategorien[0].kontakt.anschrift.plz,
                stadt: this.props.konto.kategorien[0].kontakt.anschrift.stadt,
                telefon: this.props.konto.kategorien[0].kontakt.telefon,
                email: this.props.konto.kategorien[0].kontakt.email,
                versicherung: this.props.konto.kategorien[0].versicherungsdaten.versicherung,
                versicherungsnummer: this.props.konto.kategorien[0].versicherungsdaten.versicherungsnummer,
                versichertennummer: this.props.konto.kategorien[0].versicherungsdaten.versichertennummer,
            })
        
    }
    onSubmit(e){}
    handleCancelEdit(){
        this.setState({
            edit: false,
            anrede: this.props.konto.kategorien[0].profile.anrede,
                vorname: this.props.konto.kategorien[0].profile.vorname,
                nachname: this.props.konto.kategorien[0].profile.nachname,
                geburtsdatum: this.props.konto.kategorien[0].profile.geburtsdatum,
                strasse: this.props.konto.kategorien[0].kontakt.anschrift.strasse,
                nummer: this.props.konto.kategorien[0].kontakt.anschrift.nummer,
                plz: this.props.konto.kategorien[0].kontakt.anschrift.plz,
                stadt: this.props.konto.kategorien[0].kontakt.anschrift.stadt,
                telefon: this.props.konto.kategorien[0].kontakt.telefon,
                email: this.props.konto.kategorien[0].kontakt.email,
                versicherung: this.props.konto.kategorien[0].versicherungsdaten.versicherung,
                versicherungsnummer: this.props.konto.kategorien[0].versicherungsdaten.versicherungsnummer,
                versichertennummer: this.props.konto.kategorien[0].versicherungsdaten.versichertennummer,
        })
    }
    onChangeVorname(e){
        const vorname = e.target.value
        this.setState({
            vorname
        })
    }
    onChangeNachname(e){
        const nachname = e.target.value
        this.setState({
            nachname
        })
    }
    onChangeGebDate(e){
        const geburtsdatum = e.target.value
        this.setState({
           geburtsdatum
        })
    }
    onChangeStrasse(e){
        const strasse = e.target.value
        this.setState({strasse})
    }
    onChangeNummer(e){
        const nummer = e.target.value
        this.setState({nummer})
    }
    onChangePLZ(e){
        const plz = e.target.value
        this.setState({plz})
    }
    onChangeStadt(e){
        const stadt = e.target.value
        this.setState({stadt})
    }
    onChangeTelefon(e){
        const telefon = e.target.value
        this.setState({telefon})
    }
    onChangeEmail(e){
        const email = e.target.value
        this.setState({
            email
        })
    }
    onChangeAnrede(e){
        const anrede = e.target.value
        this.setState({anrede})
    }
    onChangeVersicherung(e){
        const versicherung = e.target.value
        this.setState({versicherung})
    }
    onChangeVersicherungNr(e){
        const versicherungsnummer = e.target.value
        this.setState({versicherungsnummer})
    }
    onChangeVersichertenNr(e){
        const versichertennummer = e.target.value
        this.setState({versichertennummer})
    }
    startEdit(){
        this.setState({
            edit: true
        })
    }
   
    render(){
        var Spinner = require('react-spinkit');

        if(!this.props.konto){
            
            return (
                <div className="pacman-view">
                    <Spinner name='pacman' color="#1BBC9B" />
                </div>
            )
        }
        else if(this.state.konto && this.props.selectedKontoDetails){
            
            return (
                <div className="editor">
                    <div className="button--edit_container">
                        {
                            !this.state.edit ? <button type="button" className="button button--edit button--edit-account" onClick={this.startEdit.bind(this)}>bearbeiten</button> : undefined
                        }
                    </div>
                    <div className="termin-header">
                        <h1>{this.state.vorname} {this.state.nachname}</h1>   
                    </div>
                    <div className="account-stammdaten">
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        {this.state.edit ? (
                            <select name="anrede" 
                                value={this.state.anrede}
                                className="patient--input"
                                onChange={this.onChangeAnrede.bind(this)}>
                                    
                                <option value="">Anrede</option>
                                <option value="Herr">Herr</option>
                                <option value="Frau">Frau</option>
                            </select>
                            ) : undefined}
                        {this.state.edit ? (
                            <input name="vorname" 
                                className="patient--input"
                                value={this.state.vorname} type="text" placeholder="Vorname" onChange={this.onChangeVorname.bind(this)} autoComplete="new-password"/>
                        
                        ) : undefined }
                        {this.state.edit ? (
                          <input name="nachname" 
                            className="patient--input"
                          value={this.state.nachname} type="text" placeholder="Nachname" onChange={this.onChangeNachname.bind(this)} autoComplete="new-password"/>
                        
                        ) : undefined}
                        <input name="geburtsdatum" 
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.geburtsdatum} type="date" placeholder="Geburtsdatum" onChange={this.onChangeGebDate.bind(this)} autoComplete="new-password"/>
                        <h5 className="item__message item__status-message praxis--subheading">Kontaktdaten</h5>
                        <input name="straße"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.strasse} type="text" placeholder="Straße" onChange={this.onChangeStrasse.bind(this)} autoComplete="new-password"/>
                        <input name="nummer"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.nummer} type="text" placeholder="Hausnr." onChange={this.onChangeNummer.bind(this)} autoComplete="new-password"/>
                        <input name="plz"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.plz}  
                            type="number" 
                            placeholder="Postleitzahl" onChange={this.onChangePLZ.bind(this)} autoComplete="new-password"/>
                        <input name="stadt"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.stadt} type="text" placeholder="Stadt" onChange={this.onChangeStadt.bind(this)} autoComplete="new-password"/>
                        <input name="telefon"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.telefon} type="tel" placeholder="Telefon" onChange={this.onChangeTelefon.bind(this)} autoComplete="new-password"/>
                        <input name="email"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.email} type="email" placeholder="E-mail" onChange={this.onChangeEmail.bind(this)} autoComplete="new-password"/>
                        <h5 className="item__message item__status-message praxis--subheading">Versichertenstammdaten</h5>
                        <input name="versicherung"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.versicherung} ref="versicherungTitle" type="text" placeholder="Name der Versicherung" onChange={this.onChangeVersicherung.bind(this)} autoComplete="new-password"/>
                        <input name="versicherungNr"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.versicherungsnummer} ref="versicherungNr" type="number" placeholder="Nummer der Versicherung" onChange={this.onChangeVersicherungNr.bind(this)} autoComplete="new-password"/>
                        <input name="versichertenNr"
                            className="patient--input"
                            disabled={this.state.edit ? false : true}
                            value={this.state.versichertennummer} ref="versichertenNr" type="text" placeholder="Versicherten-Nummer" onChange={this.onChangeVersichertenNr.bind(this)} autoComplete="new-password"/>
                        
                        {this.state.edit ? (
                            <button type="submit" className="button button--add-account">speichern</button>
                        ) : undefined}
                        {this.state.edit ? (
                            <button type="button" className="button button--cancel-account" onClick={this.handleCancelEdit.bind(this)}>abbrechen</button>
                            ) : undefined}
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="editor">
                     <p className="editor--message">
                         {this.props.selectedKontoDetails ? 'Keine Stammdaten gefunden' : 'Bitte Informationen auswählen.'}
                     </p>
                </div>
             )
        }
        // else {
        //     return (
        //         <div className="pacman-view">
        //             <Spinner name='pacman' color="#92A8D1" />
        //         </div>
        //     )
        // }

    }
}

export default withTracker( (props) => {
    
    const selectedKontoDetails = Session.get('selectedKontoDetails');
    const isLoading = Session.get('isLoading');
    
    const user = Meteor.user()
    // if(konto){
        
        return {
            user,
            selectedKontoDetails,
            isLoading
        };
    // } else {
    //     return {
    //         isLoading: true
    //     }
    // }

})(AccountEditor);