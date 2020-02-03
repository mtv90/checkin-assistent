import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { withTracker  } from 'meteor/react-meteor-data';
import moment from 'moment';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';
import swal2 from 'sweetalert2';


export class AddAccountDetails extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isOpen: false,
            isLoading: false,
            errors: [],
            geburtsdatum:'',
            strasse: '',
            nummer: '',
            plz: '',
            stadt: '',
            telefon: '',
            anrede: '',
            versicherung:'',
            versicherungNr:'',
            versichertenNr:'',
            user: {
                profile:{
                    vorname:'',
                    nachname:'',
                },
                emails:[
                    {address:''}
                ]
            },
        }
    }
    componentDidMount(){
        this.props.user ? this.setState({user: {...this.props.user}}) : null;
        
    }
    openAccountModal(){
        this.setState({
            isOpen:true
        })
    }
    handleModalClose(){
        this.setState({
            isOpen: false,
            errors: [],
            geburtsdatum:'',
            strasse: '',
            nummer: '',
            plz: '',
            stadt: '',
            telefon: '',
            anrede: '',
            versicherung:'',
            versicherungNr:'',
            versichertenNr:'',
        })
    }
    onSubmit(e){
        
        e.preventDefault();
        let errors = []
        const title = this.props.title
        const profile = {
            anrede: this.state.anrede,
            vorname: this.state.user.profile.vorname,
            nachname: this.state.user.profile.nachname,
            geburtsdatum: this.state.geburtsdatum,
        }
        
        
        if(profile.anrede.length=== 0){            
            errors.push({title: "Ungültige Anrede"})
        }
        if(!profile.geburtsdatum){            
            errors.push({title: "Ungültiges Geburtsdatum"})
        }
        const kontakt = {
            telefon: this.state.telefon,
            email: this.state.user.emails[0].address,
            anschrift: {
                strasse: this.state.strasse,
                nummer: this.state.nummer,
                plz: this.state.plz,
                stadt: this.state.stadt,
            }
        }
        const versicherungsdaten = {
            versicherung: this.state.versicherung,
            versicherungsnummer: this.state.versicherungNr,
            versichertennummer: this.state.versichertenNr
        }
        if(versicherungsdaten.versicherungsnummer){
            if(versicherungsdaten.versicherungsnummer.length != 7)  {
                errors.push({title: "Ungültige Versicherungsnummer"})
            }
        }
        if(!(errors.length === 0)){
            this.setState({errors});
            swal2.fire({
                position: 'top-end',
                icon: 'error',
                title: `Fehler`,
                text: `Bitte überprüfen Sie ihre Eingaben.`,
                showConfirmButton: false,
                timer: 9000,
                toast:true
              })
        } 
        if(errors.length === 0) {
            Session.set('isLoading', true)
            Meteor.call('konto.insert',
                title,
                profile,
                kontakt,
                versicherungsdaten,
                (error, result) => {
                    if(error){
                        console.log(error);
                        swal("Fehler", `${error.message}`, "error")
                    }
                    if(result){
                        this.handleModalClose();
                        swal("Daten erfolgreich gespeichert","","success").then((value) => {
                            if(value){
                                Session.set('isLoading', false)
                            }
                        });
                    }
                }
            );
        }

    }
    onChangeVorname(e){
        const vorname = e.target.value
        this.setState({
            user:{
                profile: {
                    vorname
                }
            }
        })
    }
    onChangeNachname(e){
        const nachname = e.target.value
        this.setState({
            user:{
                profile: {
                    nachname
                }
            }
        })
    }
    onChangeGebDate(e){
        const geburtsdatum = e.target.value
        this.setState({geburtsdatum})
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
            emails:[
                {address: email}
            ]
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
        const versicherungNr = e.target.value
        this.setState({versicherungNr})
    }
    onChangeVersichertenNr(e){
        const versichertenNr = e.target.value
        this.setState({versichertenNr})
    }
    render(){

        return(
            <div className="add-praxis--container">
                <button className="button button--add" onClick={this.openAccountModal.bind(this)}>+ Stammdaten</button>
                <Modal 
                    isOpen={this.state.isOpen} 
                    contentLabel="Termin anlegen" 
                    appElement={document.getElementById('app')}
                    
                    onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box add-account__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h1>{this.props.title} hinzufügen</h1>
                    {this.state.errors ? (this.state.errors.map((error, index) => {
                        return <p className="error--text" key={index}>{error.title}</p>
                        })
                    ): undefined}
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        <select name="anrede" onChange={this.onChangeAnrede.bind(this)}>
                            <option value="">Anrede</option>
                            <option value="Herr">Herr</option>
                            <option value="Frau">Frau</option>
                        </select>
                        <input name="vorname" 
                            className="patient--input"
                            value={this.state.user.profile.vorname} type="text" placeholder="Vorname" onChange={this.onChangeVorname.bind(this)} autoComplete="off"/>
                        <input name="nachname" className="patient--input" 
                            value={this.state.user.profile.nachname} type="text" placeholder="Nachname" onChange={this.onChangeNachname.bind(this)} autoComplete="off"/>
                        <input name="geburtsdatum" className="patient--input" 
                            value={this.state.geburtsdatum} type="date" placeholder="Geburtsdatum" onChange={this.onChangeGebDate.bind(this)} autoComplete="off"/>
                        <h5 className="item__message item__status-message praxis--subheading">Kontaktdaten</h5>
                        <input name="straße" className="patient--input"
                            value={this.state.strasse} type="text" placeholder="Straße" onChange={this.onChangeStrasse.bind(this)} autoComplete="off"/>
                        <input name="nummer" className="patient--input"
                            value={this.state.nummer} type="text" placeholder="Hausnr." onChange={this.onChangeNummer.bind(this)} autoComplete="off"/>
                        <input name="plz" className="patient--input"
                            value={this.state.plz}  type="number" placeholder="Postleitzahl" onChange={this.onChangePLZ.bind(this)} autoComplete="off"/>
                        <input name="stadt" className="patient--input"
                            value={this.state.stadt} type="text" placeholder="Stadt" onChange={this.onChangeStadt.bind(this)} autoComplete="off"/>
                        <input name="telefon" className="patient--input"
                            value={this.state.telefon} type="tel" placeholder="Telefon" onChange={this.onChangeTelefon.bind(this)} autoComplete="off"/>
                        <input name="email" className="patient--input"
                            value={this.state.user.emails[0].address} type="email" placeholder="E-mail" onChange={this.onChangeEmail.bind(this)} autoComplete="off"/>
                        <h5 className="item__message item__status-message praxis--subheading">Versichertenstammdaten</h5>
                        <input name="versicherung" className="patient--input"
                            value={this.state.versicherung} ref="versicherungTitle" type="text" placeholder="Name der Versicherung" onChange={this.onChangeVersicherung.bind(this)} autoComplete="off"/>
                        <input name="versicherungNr" className="patient--input"
                            value={this.state.versicherungNr} ref="versicherungNr" type="number" placeholder="Nummer der Versicherung" onChange={this.onChangeVersicherungNr.bind(this)} autoComplete="off"/>
                        <input name="versichertenNr" className="patient--input"
                            value={this.state.versichertenNr} ref="versichertenNr" type="text" placeholder="Versicherten-Nummer" onChange={this.onChangeVersichertenNr.bind(this)} autoComplete="off"/>
                        <button type="submit" className="button button--add-account">speichern</button>
                        <button type="button" className="button button--cancel-account" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
                    </form>
                </Modal>
            </div>
        )
    }
}
AddAccountDetails.propTypes = {
    user: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
}
export default withTracker( () => {
    Meteor.subscribe('user');
    const user = Meteor.user()
    return {
       user
    };
})(AddAccountDetails);