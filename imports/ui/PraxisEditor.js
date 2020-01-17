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
            patienten: []
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
            patienten: this.state.patienten
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
    cancelEdit(e){
        e.preventDefault();
        this.setState({
            edit: false
        })

    }
    startEdit(e){
        e.preventDefault();
        const mypraxis = this.props.praxis;
        Session.set('editpraxis', mypraxis)
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
            patienten: this.props.praxis.patienten
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
            edit: false
        })
    }
    handleChangeMitarbeiter = (mitarbeiter) => {
        console.log(mitarbeiter)
        this.setState({mitarbeiter});
        
    }
    handleChangePatienten = (patienten) => {
        console.log(patienten)
        this.setState({patienten});
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
                {/* boxed-view__form */}
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
                    <input 
                        disabled = {this.state.edit ? "" : "disabled"} 
                        name="straße" 
                        type="text" 
                        placeholder="Straße" 
                        value={this.state.edit ? this.state.strasse : this.props.praxis.strasse}
                        onChange={this.onChangeStrasse.bind(this)} 
                        autoComplete="off"/>
                    <input 
                        disabled = {this.state.edit ? "" : "disabled"} 
                        name="nummer" 
                        type="text" 
                        placeholder="Hausnr."
                        value={this.state.edit ? this.state.nummer : this.props.praxis.nummer} 
                        onChange={this.onChangeNummer.bind(this)} 
                        autoComplete="off"/>
                    <input 
                        disabled = {this.state.edit ? "" : "disabled"} 
                        name="plz"  
                        type="number" 
                        placeholder="Postleitzahl"
                        value={this.state.edit ? this.state.plz : this.props.praxis.plz} 
                        onChange={this.onChangePLZ.bind(this)} 
                        autoComplete="off"/>
                    <input 
                        disabled = {this.state.edit ? "" : "disabled"} 
                        name="stadt" type="text" 
                        placeholder="Stadt"
                        value={this.state.edit ? this.state.stadt : this.props.praxis.stadt} 
                        onChange={this.onChangeStadt.bind(this)} 
                        autoComplete="off"/>
                    <input 
                        disabled = {this.state.edit ? "" : "disabled"} 
                        name="telefon" 
                        type="tel" 
                        placeholder="Telefon" 
                        value={this.state.edit ? this.state.telefon : this.props.praxis.telefon}
                        onChange={this.onChangeTelefon.bind(this)} 
                        autoComplete="off"/>
                    <input 
                        disabled = {this.state.edit ? "" : "disabled"} 
                        name="email" type="email" 
                        placeholder="E-mail" 
                        value={this.state.edit ? this.state.email : this.props.praxis.email}
                        onChange={this.onChangeEmail.bind(this)} 
                        autoComplete="off"/>
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
                    {this.state.edit ?  <button type="submit" className="button">speichern</button> : undefined}
                    {this.state.edit ? <button type="button" className="button button--cancel" onClick={this.handleEditCancel.bind(this)}>abbrechen</button> : undefined}
                        
                </form>
            </div>
        )
       } else {
           return (
               <div className="editor">
                    <p>
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