import React from 'react';
import { Meteor } from 'meteor/meteor';
import swal from 'sweetalert';
import Select from 'react-select'
import Modal from 'react-modal';
import { Tracker } from 'meteor/tracker';

export default class AddTermin extends React.Component {
    constructor(props){
        super(props)
        this.state={
            patients:[],
            titel:'',
            isOpen: false,
            error: ''
        }
    }
    onSubmit(e) {
        const {titel} = this.state;
        Meteor.call('termine.insert', titel,
            (error, result) => {
                if(error) {
                    swal("Fehler", `${error.error}`, "error");
                } else {
                    swal("Daten erfolgreich gespeichert", '', "success");
                    this.handleModalClose();
                }
            }
        );

        e.preventDefault();
    }
    onChangeTitel(e){
        this.setState({
            titel: e.target.value
        })
    }
    handleModalClose(){
        this.setState({
            isOpen: false, 
            titel: ''
        })
    }
    render() {
        return (
            <div>
                <button className="button" onClick={() => this.setState({isOpen: true})}>+ Termin anlegen</button>
                <Modal 
                    isOpen={this.state.isOpen} 
                    contentLabel="Termin anlegen" 
                    appElement={document.getElementById('app')}
                    onAfterOpen={() => this.refs.titel.focus()}
                    onRequestClose={this.handleModalClose.bind(this)}
                    className="boxed-view__box"
                    overlayClassName="boxed-view boxed-view--modal"
                >
                    <h1>Termin hinzufügen</h1>
                    <form onSubmit={this.onSubmit.bind(this)} className="boxed-view__form">
                        <input type="text" ref="titel" placeholder="Titel eingeben" onChange={this.onChangeTitel.bind(this)}/>
                        <Select options={this.state.patients}/>
                        <button className="button">Termin anlegen</button>
                        <button type="button" className="button button--cancel" onClick={this.handleModalClose.bind(this)}>abbrechen</button>
                    </form>
                </Modal>
            </div>
        );
    }
}