import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { withTracker  } from 'meteor/react-meteor-data';
import moment from 'moment';
import Modal from 'react-modal';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';
import Select from 'react-select';

export class AddPraxis extends React.Component {
    constructor(props){
        super(props)

        this.state={
            title:'',
            strasse: '',
            nummer: null,
            plz: null,
            stadt: '',
            telefon: null,
            email: '',
            mitarbeiter: null,
            isOpen: false,
            error: '',
            mitarbeiterList: []
        }
    }
    openPraxisModal(){
        this.setState({isOpen: true});
    }
    handleModalClose(){
        Session.set({
            isOpen: false,
            start: moment().format('YYYY-MM-DDTHH:mm:ss'),
            end: moment().add(30, 'm').format('YYYY-MM-DDTHH:mm:ss')
        })
        this.setState({
            isOpen: false, 
            titel: '',
            strasse: '',
            nummer: null,
            plz: null,
            stadt: '',
            telefon: null,
            email: '',
            error: '',
            mitarbeiterList:[]
        })
    }
    onSubmit(e) {
        e.preventDefault();
        const title = this.state.title;
        const strasse = this.state.strasse;
        const nummer = this.state.nummer;
        const plz = this.state.plz;
        const stadt = this.state.stadt;
        const mitarbeiter = this.state.mitarbeiterList;
        const telefon = this.state.telefon;
        const email = this.state.email;
        
        var pattern = new RegExp("[0-9]{5}");
        var result = pattern.test(plz);

        if(nummer < 1){
            this.setState({
                error: 'Die Hausnummer muss mindestens "1" betragen.'
            })
        } 
        else if(!result){
            this.setState({
                error: 'Bitte eine gültige Postleitzahl angeben.'
            })
        } 
        else {
            Meteor.call('praxis.insert',
            title,
            strasse,
            nummer,
            plz,
            stadt,
            telefon,
            email,
            mitarbeiter,
            (error, result) => {
                if(error) {
                    swal("Fehler", `${error.reason}`, "error");
                } else {
                    swal("Daten erfolgreich gespeichert", '', "success");
                    this.handleModalClose();
                }
            }
        );
        }

    }
    onChangeTitle(e) {
        const title = e.target.value;
        if(title) {
            this.setState({title});
        }
    }
    onChangeStrasse(e) {
        const strasse = e.target.value;
        if(strasse) {
            this.setState({strasse});
        }
    }
    onChangeNummer(e) {
        const nummer = parseInt(e.target.value);
        if(nummer) {
            this.setState({nummer});
        }
    }
    onChangePLZ(e) {
        const plz = parseInt(e.target.value);
        if(plz) {
            this.setState({plz});
        }
    }
    onChangeStadt(e) {
        const stadt = e.target.value;
        if(stadt) {
            this.setState({stadt});
        }
    }
    // renderOptions() {
    //     if(this.props.mitarbeiter.length === 0) {
    //         return (
    //             <option className="item__status-message">Keine Patienten vorhanden!</option>
    //         )
    //     }
    //     return this.props.mitarbeiter.map(( mitarbeiter) => {
    //         return (
    //             <option key={mitarbeiter._id} ref="pat_id" value={mitarbeiter._id}>{mitarbeiter.label}</option>
    //         )
    //     });
    // }

    handleChange = mitarbeiterList => {
        this.setState(
          { mitarbeiterList }

        );
      };
    onChangeTelefon(e){
        const telefon = e.target.value;
        if(telefon){
            this.setState({telefon});
        }
    }
    onChangeEmail(e){
        const email = e.target.value;
        if(email){
            this.setState({email});
        }
    }
    render() {
        return (
            <div className="add-termin--container">
                <button className="button button--add" onClick={this.openPraxisModal.bind(this)}>+ Praxis anlegen</button>
                <Modal 
                    isOpen={this.state.isOpen} 
                    contentLabel="Termin anlegen" 
                    appElement={document.getElementById('app')}
                    onAfterOpen={() => this.refs.title.focus()}
                    onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h1>Praxis hinzufügen</h1>
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        {this.state.error ? (<p className="error--text"><small>{this.state.error}</small></p>) : undefined}
                        <input name="title" ref="title" type="text" placeholder="Praxisname" onChange={this.onChangeTitle.bind(this)} autoComplete="off"/>
                        <input name="straße" type="text" placeholder="Straße" onChange={this.onChangeStrasse.bind(this)} autoComplete="off"/>
                        <input name="nummer" type="number" placeholder="Hausnr." onChange={this.onChangeNummer.bind(this)} autoComplete="off"/>
                        <input name="plz"  type="number" placeholder="Postleitzahl" onChange={this.onChangePLZ.bind(this)} autoComplete="off"/>
                        <input name="stadt" type="text" placeholder="Stadt" onChange={this.onChangeStadt.bind(this)} autoComplete="off"/>
                        <input name="telefon" type="tel" placeholder="Telefon" onChange={this.onChangeTelefon.bind(this)} autoComplete="off"/>
                        <input name="email" type="email" placeholder="E-mail" onChange={this.onChangeEmail.bind(this)} autoComplete="off"/>
                        <Select
                            value={this.state.mitarbeiterList}
                            onChange={this.handleChange}
                            isMulti
                            name="Mitarbeiter"
                            options={this.props.mitarbeiter}
                            className="select-box"
                            classNamePrefix="Mitarbeiter auswählen..."
                        />
                        {/* <Select
                            value={this.state.patientenList}
                            onChange={this.handleChangePatient}
                            isMulti
                            name="Mitarbeiter"
                            options={this.props.patienten}
                            className="select-box"
                            classNamePrefix="Mitarbeiter auswählen..."
                        /> */}
                        <button type="submit" className="button">Termin anlegen</button>
                        <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
                    </form>
                </Modal>
            </div>
        )
    }
}

export default withTracker( () => {
    Meteor.subscribe('mitarbeiter');
    let mitarbeiter = [];
    const users = Meteor.users.find({role: "admin"}).fetch();
    users.map(user => {
            user["label"] = `${user.profile.nachname}, ${user.profile.vorname}`;
            user["value"] = `${user.profile.nachname}, ${user.profile.vorname}`;
            mitarbeiter.push(user);
    })
    return {
        mitarbeiter,
        isOpen: Session.get('isOpen')
    };
})(AddPraxis);