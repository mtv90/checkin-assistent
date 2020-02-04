import React from 'react';
import {Meteor} from 'meteor/meteor'
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Konten} from '../api/konten';
import PropTypes from 'prop-types';
import moment from 'moment';
import swal from 'sweetalert';
import Modal from 'react-modal';
import { Random } from 'meteor/random';


export class AccountEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            konto: null,
            isOpen: false,
            edit: false,
            user: null,
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
            kat_length: 0,
            beschwerde: '',
            allergien: '',
            allergienCheck:'',
            medikamente:'',
            einschränkungen:'',
            operation:'',
            operationCheck: '',
            groesse:'',
            gewicht:'',
            alkohol:'',
            rauchen:'',
            rauchenCheck:'',

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
                kat_length: this.props.konto.kategorien.length
            })
        
    }
    onSubmit(e){
        e.preventDefault();
        
        const konto = {
            _id: this.props.konto._id,
            kategorien: [
                {
                    _id: this.props.konto.kategorien[0]._id,
                    title: this.props.konto.kategorien[0].title,
                    profile: {
                        anrede: this.state.anrede,
                        vorname: this.state.vorname,
                        nachname: this.state.nachname,
                        geburtsdatum: this.state.geburtsdatum
                    },
                    kontakt: {
                        telefon: this.state.telefon,
                        email: this.state.email,
                        anschrift: {
                            strasse: this.state.strasse,
                            nummer: this.state.nummer,
                            plz: this.state.plz,
                            stadt: this.state.stadt,
                        }
                    },
                    versicherungsdaten: {
                        versicherung: this.state.versicherung,
                        versicherungsnummer: this.state.versicherungsnummer,
                        versichertennummer: this.state.versichertennummer 
                    }
                }
            ]
        };

        Meteor.call('konto.update', this.props.konto._id, konto, 
            (error, result) => {
                if(error){
                    console.log(err)
                    swal("Fehler", `${err.error}`, "error");
                }
                if(result){
                    swal('Daten erfolgreich gespeichert',"", "success")
                        .then((val) => {
                            if(val){
                                this.handleCancelEdit()
                            }
                        } )
                        .catch(err => console.log(err));
                }
            });
    }
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
    addPatientInfo(e){
        this.setState({
            isOpen:true,
        })
    }
    onSubmitPatInfo(e){
        e.preventDefault();

        let allergien = '';
        if(this.state.allergienCheck=== 'false'){
            allergien = this.state.allergienCheck
        }
        if(this.state.allergienCheck=== 'true'){
            allergien = this.state.allergien
        }

        let operation = '';
        if(this.state.rauchenCheck=== 'false'){
            operation = this.state.operationCheck
        }
        if(this.state.operationCheck=== 'true'){
            operation = this.state.operation
        }

        let rauchen = '';
        if(this.state.rauchenCheck !== 'ja'){
            rauchen = this.state.rauchenCheck
        } else {
            rauchen = this.state.rauchen
        }
        
        const fragebogen ={
            _id: Random.id(),
            title: 'Patientenfragebogen',
            beschwerde: this.state.beschwerde,
            allergien,
            medikamente: this.state.medikamente,
            einschränkungen:  this.state.einschränkungen,
            operation,
            groesse: this.state.groesse,
            gewicht: this.state.gewicht,
            alkohol: this.state.alkohol,
            rauchen
        }

        const konto = {
            _id: this.props.konto._id,
            kategorien: [
                {
                    _id: this.props.konto.kategorien[0]._id,
                    title: this.props.konto.kategorien[0].title,
                    profile: {
                        anrede: this.state.anrede,
                        vorname: this.state.vorname,
                        nachname: this.state.nachname,
                        geburtsdatum: this.state.geburtsdatum
                    },
                    kontakt: {
                        telefon: this.state.telefon,
                        email: this.state.email,
                        anschrift: {
                            strasse: this.state.strasse,
                            nummer: this.state.nummer,
                            plz: this.state.plz,
                            stadt: this.state.stadt,
                        }
                    },
                    versicherungsdaten: {
                        versicherung: this.state.versicherung,
                        versicherungsnummer: this.state.versicherungsnummer,
                        versichertennummer: this.state.versichertennummer 
                    }
                },
                fragebogen,
            ]
        };

        Meteor.call('konto.update', konto._id, konto, 
        (error, result) => {
            if(error){
                console.log(err)
                swal("Fehler", `${err.error}`, "error");
            }
            if(result){
                swal('Daten erfolgreich gespeichert',"", "success")
                    .then((val) => {
                        if(val){
                            this.handleModalPatInfoClose()
                        }
                    } )
                    .catch(err => console.log(err));
            }
        });
    }

    handleModalPatInfoClose(){
        this.setState({
            isOpen: false,
            beschwerde: '',
            allergien: '',
            allergienCheck:'',
            medikamente:'',
            einschränkungen:'',
            operation:'',
            operationCheck: '',
            groesse:'',
            gewicht:'',
            alkohol:'',
            rauchen:'',
            rauchenCheck:'',
        })
    }
    onChangeBeschwerde(e){
        const beschwerde = e.target.value;
        this.setState({beschwerde})
        
    }
    onChangeAllergien(e){
        const allergien = e.target.value;
        this.setState({allergien})
    }
    OnChangeCheckAllergien(e){
        const allergienCheck = e.target.value
        this.setState({allergienCheck})
    }
    onChangeMedikamente(e){
        const medikamente = e.target.value;
        this.setState({medikamente})
    }
    onChangeHandycap(e){
        const einschränkungen = e.target.value;
        this.setState({einschränkungen})
    }
    onChangeOperation(e){
        const operation = e.target.value;
        this.setState({operation});
    }
    OnChangeCheckOperation(e){
        const operationCheck = e.target.value;
        this.setState({operationCheck})
    }
    onChangeGroesse(e){
        const groesse = e.target.value.trim();
        this.setState({groesse});
    }
    onChangeGewicht(e){
        const gewicht = e.target.value.trim();
        this.setState({gewicht});
    }
    onChangeAlkohol(e){
        const alkohol = e.target.value;
        this.setState({alkohol});
    }
    onChangeRauchen(e){
        const rauchen = e.target.value;
        this.setState({rauchen});
    }
    OnChangeCheckRauchen(e){
        const rauchenCheck = e.target.value;
        this.setState({rauchenCheck});
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
                        {
                            this.props.konto.kategorien.length !== 2 ? 
                                <div>
                                    <p className="item__status-message error--text">
                                        <small>Um ihre Anmeldung zu beschleunigen, können Sie jetzt schon allgemeine Patienteninformationen hinterlegen</small>
                                    </p>
                                    <button type="button" className="button button--add-patient-info" onClick={this.addPatientInfo.bind(this)}>+ hinzufügen</button>
                                    
                                    <Modal 
                                        isOpen={this.state.isOpen} 
                                        contentLabel="Patientenfragebogen" 
                                        appElement={document.getElementById('app')}
                                        
                                        onRequestClose={this.handleModalPatInfoClose.bind(this)}
                                        className="boxed-view__box add-account__box"
                                        overlayClassName="boxed-view boxed-view--modal"
                                    >
                                        <h1>Patientenfragebogen</h1>
                                        <form onSubmit={this.onSubmitPatInfo.bind(this)} className="boxed-view__form">
                                            <div className="info-box">
                                                <p>{this.state.anrede} {this.state.vorname} {this.state.nachname} </p>
                                                <p>geboren: {moment(this.state.geburtsdatum).format('DD.MM.YYYY')}</p>
                                                <p>{this.state.strasse} {this.state.nummer}, {this.state.plz} {this.state.stadt}</p>
                                                {this.state.telefon ? <p>{this.state.telefon}</p> : undefined}
                                            </div>
                                            <div className="fragen-box">
                                                <label htmlFor="groesse">Wie <u>groß</u> sind Sie? (cm)</label>
                                                <input type="number" name="groesse" className="patient--input"
                                                    value={this.state.groesse} min="0" max="260" step="1" placeholder="Größe eingeben" onChange={this.onChangeGroesse.bind(this)} autoComplete="new-password"/>
                                                <label htmlFor="gewicht">Wie <u>schwer</u> sind Sie? (kg)</label>
                                                <input type="number" name="gewicht" className="patient--input"
                                                    value={this.state.gewicht} placeholder="Gewicht eingeben" min="0" max="500" onChange={this.onChangeGewicht.bind(this)} autoComplete="new-password"/>
                                                
                                                <label htmlFor="beschwerde">Was ist <u>heute</u> ihre <u>Hauptbeschwerde</u>?</label>
                                                <input type="text" name="beschwerde" className="patient--input"
                                                    value={this.state.beschwerde} placeholder="Beschwerde eingeben" onChange={this.onChangeBeschwerde.bind(this)} autoComplete="new-password"/>
                                                
                                                <br/>
                                                <label htmlFor="allergien">Sind <u>Allergien</u> bekannt oder gibt es <u>Medikamente, die Sie nicht vertragen</u>?</label><br/>
                                                <label htmlFor="allergienRadio">
                                                    <input type="radio" name="allergienRadio" 
                                                        value="false" 
                                                        checked={'false' === this.state.allergienCheck}
                                                        onChange={this.OnChangeCheckAllergien.bind(this)}/> nein <br/>
                                                    <input type="radio" name="allergienRadio" 
                                                        value="true" 
                                                        checked={'true' === this.state.allergienCheck}
                                                        onChange={this.OnChangeCheckAllergien.bind(this)}/> ja 
                                                </label>
                                                {this.state.allergienCheck === 'true' ? 
                                                    <input type="text" name="allergien" className="patient--input"
                                                        value={this.state.allergien} placeholder="Allergien eingeben" onChange={this.onChangeAllergien.bind(this)} autoComplete="new-password"/>
                                                    : undefined
                                                }
                                                <label htmlFor="medikamente">Welche <u>Medikamente</u> nehmen Sie? <u>(Name / Dosis / Zeitpunkt)</u></label>
                                                <textarea name="medikamente" placeholder="Medikamente eingeben" value={this.state.medikamente} onChange={this.onChangeMedikamente.bind(this)}/>
                                                <label htmlFor="handycap">Haben Sie gesundheitliche Einschränkungen?</label>
                                                <textarea name="handycap" placeholder="Einschränkungen eingeben" value={this.state.handycap} onChange={this.onChangeHandycap.bind(this)}/>
                                                
                                                <label htmlFor="operation">Hatten Sie schon einmal eine <u>Operation</u>?</label><br/>
                                                <label htmlFor="operationRadio">
                                                    <input type="radio" name="operationRadio" 
                                                        value="false" 
                                                        checked={'false' === this.state.operationCheck}
                                                        onChange={this.OnChangeCheckOperation.bind(this)}/> nein <br/>
                                                    <input type="radio" name="operationRadio" 
                                                        value="true" 
                                                        checked={'true' === this.state.operationCheck}
                                                        onChange={this.OnChangeCheckOperation.bind(this)}/> ja 
                                                </label>
                                                {this.state.operationCheck === 'true' ? 
                                                    <textarea type="text" name="operation" className="patient--input"
                                                    value={this.state.operation} placeholder="Operation eingeben" onChange={this.onChangeOperation.bind(this)} autoComplete="new-password"/>
                                                    : undefined
                                                }
                                                <label htmlFor="alkohol">Wie viel <u>Alkohol</u> trinken Sie im Schnitt?</label><br/>
                                                <input type="text" name="alkohol" className="patient--input"
                                                    value={this.state.alkohol} placeholder="Alkoholkonsum eingeben" onChange={this.onChangeAlkohol.bind(this)} autoComplete="new-password"/>

                                                <label htmlFor="rauchen"><u>Rauchen</u> Sie?</label><br/>
                                                <label htmlFor="rauchenRadio">
                                                    <input type="radio" name="rauchenRadio" 
                                                        value="noch nie geraucht" 
                                                        checked={'noch nie geraucht' === this.state.rauchenCheck}
                                                        onChange={this.OnChangeCheckRauchen.bind(this)}/> Ich habe noch nie geraucht <br/>
                                                        <input type="radio" name="rauchenRadio" 
                                                        value="nicht mehr" 
                                                        checked={'nicht mehr' === this.state.rauchenCheck}
                                                        onChange={this.OnChangeCheckRauchen.bind(this)}/> Nein, nicht mehr <br/>
                                                    <input type="radio" name="rauchenRadio" 
                                                        value="ja" 
                                                        checked={'ja' === this.state.rauchenCheck}
                                                        onChange={this.OnChangeCheckRauchen.bind(this)}/> Ja
                                                </label>
                                                {this.state.rauchenCheck === 'ja' ? 
                                                    <input type="text" name="rauchen" className="patient--input"
                                                        value={this.state.rauchen} placeholder="Etwa ... Zigaretten/Tag, seit etwa ... Jahren" onChange={this.onChangeRauchen.bind(this)} autoComplete="new-password"/>
                                                    : undefined
                                                }
                                            </div>
                                            <button type="submit" className="button button--add-account">speichern</button>
                                            <button type="button" className="button button--cancel-account" onClick={this.handleModalPatInfoClose.bind(this)}>abbrechen</button>
                                        </form>
                                    </Modal>


                                </div> : undefined
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
    }
}

export default withTracker( (props) => {
    
    const selectedKontoDetails = Session.get('selectedKontoDetails');
    const isLoading = Session.get('isLoading');
    const user = Meteor.user()
    return {
        user,
        selectedKontoDetails,
        isLoading,
    };
})(AccountEditor);