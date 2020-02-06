import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import { withTracker  } from 'meteor/react-meteor-data';
import moment from 'moment';
import Modal from 'react-modal';
import { Tracker } from 'meteor/tracker';
import {Session} from 'meteor/session';
import { Random } from 'meteor/random';
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
            mitarbeiterList: [],
            openings: [],
            resources: []
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
            mitarbeiterList:[],
            openings:[],
            resources: []
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
        const openings = this.state.openings;
        const resources = this.state.resources;
        
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
            openings,
            resources,
            (error, result) => {
                if(error) {
                    swal("Fehler", `${error.reason}`, "error");
                } else {
                    swal("Daten erfolgreich gespeichert", '', "success");
                    this.handleModalClose();
                }
                if(result) {
                    Session.set('selectedPraxisId', result)
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
        const nummer = e.target.value;
        if(nummer) {
            this.setState({nummer});
        }
    }
    onChangePLZ(e) {
        const plz = e.target.value;
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
    addOpenings(){
        
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
    addResources(){
        
        this.setState({ resources: [...this.state.resources, {
            id: Random.id(),
            title:'',
        }]})
    }

    handleChangeResourceTitle(e, index) {
        
        this.state.resources[index]['title'] = e.target.value;

        this.setState({resources: this.state.resources})
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
        return (
            <div className="add-praxis--container">
                <button className="button button--add button--add-praxis" onClick={this.openPraxisModal.bind(this)}>+ Praxis anlegen</button>
                <Modal 
                    isOpen={this.state.isOpen} 
                    contentLabel="Termin anlegen" 
                    appElement={document.getElementById('app')}
                    // onAfterOpen={() => this.refs.title.focus()}
                    onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h1>Praxis hinzufügen</h1>
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form termin--modal">
                        {this.state.error ? (<p className="error--text"><small>{this.state.error}</small></p>) : undefined}
                        <input className="admin-input" name="title" type="text" placeholder="Praxisname" onChange={this.onChangeTitle.bind(this)} autoComplete="new-password"/>
                        <input className="admin-input" name="straße" type="text" placeholder="Straße" onChange={this.onChangeStrasse.bind(this)} autoComplete="new-password"/>
                        <input className="admin-input" name="nummer" type="text" placeholder="Hausnr." onChange={this.onChangeNummer.bind(this)} autoComplete="new-password"/>
                        <input className="admin-input" name="plz"  type="number" placeholder="Postleitzahl" onChange={this.onChangePLZ.bind(this)} autoComplete="new-password"/>
                        <input className="admin-input" name="stadt" type="text" placeholder="Stadt" onChange={this.onChangeStadt.bind(this)} autoComplete="new-password"/>
                        <input className="admin-input" name="telefon" type="tel" placeholder="Telefon" onChange={this.onChangeTelefon.bind(this)} autoComplete="new-password"/>
                        <input className="admin-input" name="email" type="email" placeholder="E-mail" onChange={this.onChangeEmail.bind(this)} autoComplete="new-password"/>
                        <Select
                            value={this.state.mitarbeiterList}
                            onChange={this.handleChange}
                            isMulti
                            name="Mitarbeiter"
                            options={this.props.mitarbeiter}
                            className="select-box"
                            classNamePrefix="Mitarbeiter auswählen..."
                        />
                        <button type="button" className="button button--cancel button--add-opening" onClick={this.addOpenings.bind(this)}>Öffnungszeiten hinzufügen</button>
                        {
                            this.state.openings.map((open, index) => {
                                return (
                                    <div className="praxis-opening-time--container" key={index}>
                                        <div className="praxis-opening-box praxis-opening-box--header ">
                                            <h5>Tag {index + 1}</h5>
                                            <button className="button--remove-opening" onClick={(e) => {this.handleRemoveOpening(e, index)}}>entfernen</button>
                                        </div>
                                        
                                        <input className="admin-input" type="text" name="tag" placeholder="Wochentag" onChange={(e) => this.handleChangeOpeningDay(e, index)} value={open.day} autoComplete="new-password" />
                                        <div className="praxis-opening-box">
                                            <div className="time-box">
                                                <label className="opening-label" htmlFor="open-time">von:</label>
                                                <input className="admin-input" type="time" name="open-time" placeholder="von" onChange={(e) => this.handleChangeOpeningStart(e, index)} value={open.start} autoComplete="new-password" />
                                            </div>
                                            <div className="time-box">
                                                <label className="opening-label" htmlFor="close-time">bis:</label>
                                                <input className="admin-input" type="time" name="close-time" placeholder="bis" onChange={(e) => this.handleChangeOpeningEnd(e, index)} value={open.end} autoComplete="new-password" />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <button type="button" className="button button--cancel button--add-opening" onClick={this.addResources.bind(this)}>Ressourcen hinzufügen</button>
                        {
                            this.state.resources.map((resource, index) => {
                                return (
                                    <div className="praxis-opening-time--container" key={index}>
                                        <div className="praxis-opening-box praxis-opening-box--header ">
                                            <h5>Resource {index + 1}</h5>
                                            <button className="button--remove-opening" onClick={(e) => {this.handleRemoveResource(e, index)}}>entfernen</button>
                                        </div>
                                        <input className="admin-input" type="text" name="title" placeholder="Name" onChange={(e) => this.handleChangeResourceTitle(e, index)} value={resource.title} autoComplete="false" />
                                       
                                    </div>
                                )
                            })
                        }
                
                        <button type="submit" className="button">speichern</button>
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
    const users = Meteor.users.find({role: "admin"}, {fields:{services: 0}}).fetch();
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