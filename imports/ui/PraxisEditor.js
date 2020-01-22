import React from 'react';
import { withTracker  } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';
import {Praxen} from '../api/praxen';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import Select from 'react-select';

export class PraxisEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            edit: false,
            mypraxis:'',
            title:'',
            strasse: '',
            nummer: null,
            plz: null,
            stadt: '',
            email: '',
            telefon: null,
            mitarbeiter: [],
            patienten: [],
            openings: [],
            resources: []
        }
    }

    onChangeTitle(e){
        const title = e.target.value;
        
        this.setState({title});
    }
    onChangeStrasse(e){
        const strasse = e.target.value;
        
        this.setState({strasse});
    }
    onChangeNummer(e){
        const nummer = e.target.value;
        
        this.setState({nummer});
    }
    onChangePLZ(e){
        const plz = e.target.value;
        
        this.setState({plz});
    }
    onChangeStadt(e){
        const stadt = e.target.value;
        
        this.setState({stadt});
    }
    onChangeTelefon(e){
        const telefon = e.target.value;
        
        this.setState({telefon});
    }
    onChangeEmail(e){
        const email = e.target.value;
        
        this.setState({email});
        
    }
    onSubmit(e) {
        e.preventDefault();
        let old = Session.get('editpraxis')
        // console.log(this.state.mitarbeiter)
        // return this.state.mitarbeiter;
        let edited = {
            title: this.state.title,
            strasse: this.state.strasse,
            nummer: this.state.nummer,
            plz: this.state.plz,
            stadt: this.state.stadt,
            email: this.state.email,
            telefon: this.state.telefon,
            mitarbeiter: this.state.mitarbeiter,
            patienten: this.state.patienten,
            openings: this.state.openings,
            resources: this.state.resources
        }
       
        let praxis = {
            ...old,
            ...edited}

        Meteor.call('praxis.update', 
            this.props.praxis._id, 
            praxis,
            (error, result) => {
                if(error){
                    swal("Fehler", `${error.reason}`, "error");
                } else {
                    swal("Daten erfolgreich aktualisiert", "", "success");
                    this.setState({edit: false});
                }
            })
    }

    startEdit(e){
        e.preventDefault();
        const mypraxis = this.props.praxis;
        Session.set('editpraxis', mypraxis);
        Session.set('editOpenings', mypraxis.openings)
        Session.set('editResources', mypraxis.resources)
        this.setState({
            edit: true,
            title: this.props.praxis.title,
            strasse: this.props.praxis.strasse,
            nummer: this.props.praxis.nummer,
            plz: this.props.praxis.plz,
            stadt: this.props.praxis.stadt,
            email: this.props.praxis.email,
            telefon: this.props.praxis.telefon,
            mitarbeiter: this.props.praxis.mitarbeiter,
            patienten: this.props.praxis.patienten,
            openings: this.props.praxis.openings,
            resources: this.props.praxis.resources
        });

    }
    getTitleValue(){
        if(this.state.edit){
            return this.state.mypraxis.title;
        } else {
            return this.props.praxis.title;
        }
    }
    handleEditCancel(e) {
        e.preventDefault();
        this.setState({
            edit: false,
            openings:[]
        })
        this.props.praxis.openings = Session.get('editOpenings');
        this.props.praxis.resources = Session.get('editResources');
    }
    handleChangeMitarbeiter = (mitarbeiter) => {
        this.setState({mitarbeiter});
        
    }
    handleChangePatienten = (patienten) => {
        this.setState({patienten});
    }

    addResources(){
        this.setState({ resources: [...this.state.resources, {
            _id: Random.id(),
            title:'',
        }]})
    }

    handleChangeResourceTitle(e, index) {
        
        this.state.resources[index]['title'] = e.target.value;

        this.setState({resources: this.state.resources})
    }

    addOpenings(e){
        
        if(this.state.openings.length < 7){
            this.setState({ openings: [...this.state.openings, {
                day:'',
                start: moment().format('HH:mm'),
                end: moment().format('HH:mm')
            }]})
           
        } else {
            console.log("Eine Woche kann leider nur 7 Tage haben!")
        }
        
    }
    handleChangeOpeningDay(e, index) {
        
        this.state.openings[index]['day'] = e.target.value;

        this.setState({openings: this.state.openings})
    }
    handleChangeOpeningStart(e, index){
        this.state.openings[index]['start'] = e.target.value;

        this.setState({openings: this.state.openings})
    }
    handleChangeOpeningEnd(e, index){
        this.state.openings[index]['end'] = e.target.value;

        this.setState({openings: this.state.openings})
    }
    handleRemoveOpening(e, index) {
        this.state.openings.splice(index, 1);

        this.setState({openings: this.state.openings})
    }
    handleRemoveResource(e, index) {
        this.state.resources.splice(index, 1);

        this.setState({resources: this.state.resources})
    }
    render() {
       if(this.props.praxis) {   
        return (
            <div className="editor">
                <div className="button--edit_container">
                {
                    !this.state.edit ? <button type="button" className="button button--edit" onClick={this.startEdit.bind(this)}>bearbeiten</button> : undefined
                }
                </div>
                
                <form onSubmit={this.onSubmit.bind(this)} className="praxis-editor__input">
                    
                    {this.state.error ? (<p className="error--text"><small>{this.state.error}</small></p>) : undefined}
                    <input 
                            className="praxis-title"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="title" 
                            ref="title" 
                            type="text"
                            placeholder="Praxisname"
                            value={this.state.edit ? this.state.title : this.props.praxis.title} 
                            onChange={this.onChangeTitle.bind(this)} 
                            autoComplete="off"/>
                    <h5 className="item__message item__status-message praxis--subheading">Adresse</h5>
                    <div className="adress-container">
                        <input 
                            className="praxis--strasse"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="straße" 
                            type="text" 
                            placeholder="Straße" 
                            value={this.state.edit ? this.state.strasse : this.props.praxis.strasse}
                            onChange={this.onChangeStrasse.bind(this)} 
                            autoComplete="off"/>
                        <input 
                            className="praxis--hausnummer"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="nummer" 
                            type="text" 
                            placeholder="Hausnr."
                            value={this.state.edit ? this.state.nummer : this.props.praxis.nummer} 
                            onChange={this.onChangeNummer.bind(this)} 
                            autoComplete="off"/>
                        <input 
                            className="praxis--plz"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="plz"  
                            type="number" 
                            placeholder="Postleitzahl"
                            value={this.state.edit ? this.state.plz : this.props.praxis.plz} 
                            onChange={this.onChangePLZ.bind(this)} 
                            autoComplete="off"/>
                        <input 
                            className="praxis--stadt"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="stadt" type="text" 
                            placeholder="Stadt"
                            value={this.state.edit ? this.state.stadt : this.props.praxis.stadt} 
                            onChange={this.onChangeStadt.bind(this)} 
                            autoComplete="off"/>
                    </div>
                    <h5 className="item__message item__status-message praxis--subheading">Kontaktdaten</h5>
                    <div className="adress-container">
                        <label htmlFor="telefon" className="praxis--label">Telefon:</label>
                        <input 
                            className="praxis--telefon"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="telefon" 
                            type="tel" 
                            placeholder="Telefon" 
                            value={this.state.edit ? this.state.telefon : this.props.praxis.telefon}
                            onChange={this.onChangeTelefon.bind(this)} 
                            autoComplete="off"/>
                    </div>
                    <div className="adress-container">
                        <label htmlFor="email" className="praxis--label">E-Mail:</label>
                        <input 
                            className="praxis--email"
                            disabled = {this.state.edit ? "" : "disabled"} 
                            name="email" type="email" 
                            placeholder="E-mail" 
                            value={this.state.edit ? this.state.email : this.props.praxis.email}
                            onChange={this.onChangeEmail.bind(this)} 
                            autoComplete="off"/>
                    </div>
                    <h5 className="item__message item__status-message praxis--subheading">Öffnungszeiten</h5>
                    {this.state.edit ? (
                        <button 
                            disabled = {this.state.edit ? "" : "disabled"}
                            type="button" 
                            className="button button--cancel button--add-opening" 
                            onClick={this.addOpenings.bind(this)}>Öffnungszeiten hinzufügen</button>
                    ) 
                    : 
                    undefined }
                    {this.state.edit ? 
                        ( this.state.openings ?
                            this.state.openings.map((open, index) => {
                                return (
                                    <div className="praxis-opening-time--container" key={index}>
                                        <div className="praxis-opening-box praxis-opening-box--header ">
                                            <h5>Tag {index + 1}</h5>
                                            {this.state.edit? <button
                                                disabled = {this.state.edit ? "" : "disabled"}
                                                className="button--remove-opening" 
                                                onClick={(e) => {this.handleRemoveOpening(e, index)}}>
                                                    entfernen
                                            </button> : undefined}
                                        </div>
                                        <div className="desktop-opening-container">
                                            <input
                                                className="opening-day" 
                                                disabled = {this.state.edit ? "" : "disabled"}
                                                type="text" 
                                                name="tag" 
                                                placeholder="Wochentag" 
                                                onChange={(e) => this.handleChangeOpeningDay(e, index)} 
                                                value={open.day} 
                                                autoComplete="false" />
                                            <div className="praxis-opening-box">
                                                <div className="time-box time-box--editor">
                                                    <label className="opening-label" htmlFor="open-time">von:</label>
                                                    <input 
                                                        disabled = {this.state.edit ? "" : "disabled"}
                                                        type="time" 
                                                        name="open-time" 
                                                        placeholder="von" 
                                                        onChange={(e) => this.handleChangeOpeningStart(e, index)} 
                                                        value={open.start} />
                                                </div>
                                                <div className="time-box time-box--editor">
                                                    <label className="opening-label" htmlFor="close-time">bis:</label>
                                                    <input
                                                        disabled = {this.state.edit ? "" : "disabled"} 
                                                        type="time" 
                                                        name="close-time" 
                                                        placeholder="bis" 
                                                        onChange={(e) => this.handleChangeOpeningEnd(e, index)} 
                                                        value={open.end} />
                                                 </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : 
                            (<p className="editor--message">
                                Es wurden noch keine Öffnungszeiten angegeben
                            </p>)
                        ) 
                    : 
                        (this.props.praxis.openings.length != 0 ?
                            this.props.praxis.openings.map((open, index) => {
                                return (
                                    <p className="item__message item-title" key={index}>
                                        <strong>{open.day}</strong>, von {open.start}Uhr bis {open.end}Uhr
                                    </p>
                                )
                            }) :
                            (<p className="editor--message">
                                Es wurden noch keine Öffnungszeiten angegeben
                            </p>)
                    )}
                    <h5 className="item__message item__status-message praxis--subheading">Praxis-Ressourcen</h5>
                    {this.state.edit ? (
                        <button 
                            disabled = {this.state.edit ? "" : "disabled"}
                            type="button" 
                            className="button button--cancel button--add-opening" 
                            onClick={this.addResources.bind(this)}>Ressourcen hinzufügen</button>
                    ) 
                    : 
                    undefined }
                    {this.state.edit ? 
                        ( this.state.resources ?
                            this.state.resources.map((resource, index) => {
                                return (
                                    <div className="praxis-opening-time--container" key={index}>
                                        <div className="praxis-opening-box praxis-opening-box--header ">
                                            <h5>Ressource {index + 1}</h5>
                                            {this.state.edit? <button
                                                disabled = {this.state.edit ? "" : "disabled"}
                                                className="button--remove-opening" 
                                                onClick={(e) => {this.handleRemoveResource(e, index)}}>
                                                    entfernen
                                            </button> : undefined}
                                        </div>
                                        <div className="desktop-opening-container">
                                            <input
                                                className="opening-day" 
                                                disabled = {this.state.edit ? "" : "disabled"}
                                                type="text" 
                                                name="title" 
                                                placeholder="Ressourcentitel" 
                                                onChange={(e) => this.handleChangeResourceTitle(e, index)} 
                                                value={resource.title} 
                                                autoComplete="false" />
                                        </div>
                                    </div>
                                )
                            }) : 
                            (<p className="editor--message">
                                Es wurden noch Ressourcen angelegt.
                            </p>)
                        ) 
                    : 
                        (this.props.praxis.resources.length != 0 ?
                            this.props.praxis.resources.map((resource, index) => {
                                return (
                                    <p className="item__message item-title" key={index}>
                                        <strong>{resource.title}</strong>
                                    </p>
                                )
                            }) :
                            (<p className="editor--message">
                                Es wurden noch keine Ressourcen angelegt.
                            </p>)
                    )}
                    <h5 className="item__message item__status-message praxis--subheading">Mitarbeiter</h5>
                    <Select 
                        value={this.state.edit ? this.state.mitarbeiter : this.props.praxis.mitarbeiter}
                        onChange={this.handleChangeMitarbeiter}
                        isMulti
                        name="Mitarbeiter"
                        options={this.props.mitarbeiter}
                        // isOptionDisabled = {this.state.edit ? 'yes' : false}
                        isDisabled={this.state.edit ? false : true}
                        className="select-box"
                        classNamePrefix="Mitarbeiter auswählen..."
                    />
                    <h5 className="item__message item__status-message praxis--subheading">Patienten</h5>
                    <Select
                        value={this.state.edit ? this.state.patienten : this.props.praxis.patienten}
                        onChange={this.handleChangePatienten}
                        isMulti
                        name="Patienten"
                        options={this.props.patienten}
                        isDisabled={this.state.edit ? false : true}
                        className="select-box"
                        classNamePrefix="Patienten auswählen..."
                    />
                    <div className="adress-container">
                        {this.state.edit ?  <button type="submit" className="button button--edit praxis--speichern">speichern</button> : undefined}
                        {this.state.edit ? <button type="button" className="button button--cancel button--edit praxis--cancel" onClick={this.handleEditCancel.bind(this)}>abbrechen</button> : undefined}
                    </div>   
                </form>
            </div>
        )
       } else {
           return (
               <div className="editor">
                    <p className="editor--message">
                        {this.props.selectedPraxisId ? 'Keine Praxis gefunden' : 'Bitte eine Praxis auswählen.'}
                    </p>
               </div>
           )
       }
    }
}

PraxisEditor.propTypes = {
    praxis: PropTypes.object,
    selectedPraxisId: PropTypes.string,
}

export default withTracker( () => {
    const selectedPraxisId = Session.get('selectedPraxisId');

    Meteor.subscribe('mitarbeiter');
    let mitarbeiter = [];
    const users = Meteor.users.find({role: "admin"}, {fields:{services: 0}}).fetch();
    
    users.map(user => {
            user["label"] = `${user.profile.nachname}, ${user.profile.vorname}`;
            user["value"] = `${user.profile.nachname}, ${user.profile.vorname}`;
            mitarbeiter.push(user);
    });

    Meteor.subscribe('userList');
    let patienten = [];
    const usersAsPatients = Meteor.users.find({role: "patient"}).fetch();
    
    usersAsPatients.map(patient => {
            patient["label"] = `${patient.profile.nachname}, ${patient.profile.vorname}`;
            patient["value"] = `${patient.profile.nachname}, ${patient.profile.vorname}`;
            patienten.push(patient);
    })

    return {
        selectedPraxisId,
        praxis: Praxen.findOne(selectedPraxisId),
        mitarbeiter,
        patienten
    }

})(PraxisEditor);