import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import swal2 from 'sweetalert2';
import Modal from 'react-modal';
import Spinner from 'react-spinkit';
import moment from 'moment';
import { MdInfo, MdDone } from "react-icons/md";
import { IconContext } from "react-icons";

export default class TerminListeItem extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            isLoading: false,
            isOpen: false,
            moment: moment(),
        }
        this.interval = null;
    }

    handleRemoveItem(e){
        
        e.preventDefault();
        const _id = this.props._id;
        if(!!_id){
            Meteor.call('termine.remove', _id,
                (err, res) => {
                    if(err) {
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        swal("Daten wurden erfolgreich entfernt", '', "success");
                    }
                }
            )
        }
    }
    checkIn(e){
        e.preventDefault();
        let termin = {
            ...this.props
        };
        
        if(!!termin._id){
            termin['checkedIn'] = true;
            termin['status'] = 'waiting';
            termin['patientRead'] = false;
            termin['adminRead'] = true;
            Meteor.call('termin.check', termin._id, termin,
                (err, res) => {
                    if(err) {
                        console.log(err)
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        
                        swal("Patient erfolgreich eingechecked", "Er kann nun einem Behandlungszimmer zugewiesen werden.", "success");
                    }
                }
            );
        }
    }
    checkDelay(){
        if(this.state.moment.diff(this.props.start, 'minutes') >= -120 && this.state.moment.diff(this.props.start, 'minutes') < -15){

            return 'termin-list-item min30';
        }
        if(this.state.moment.diff(this.props.start, 'minutes') >= -15 && this.state.moment.diff(this.props.start, 'minutes') < 0){
            return 'termin-list-item min15'
        }
        if(this.state.moment.diff(this.props.start, 'minutes') >= 0 && this.state.moment.diff(this.props.start, 'minutes') < 15){
            return 'termin-list-item minPlus15'
        }  
        if(this.state.moment.diff(this.props.start, 'minutes') >= 15 ){
            return 'termin-list-item too-late'
        }
    }
    componentDidMount(){
        let start = this.props.start
        const self = this;
        let termin = {...this.props}
        self.interval = setInterval(function() {
            self.setState({
                moment: moment(),
            });
            
            if(moment().diff(termin.start, 'minutes') >= 15 && moment().diff(termin.start, 'minutes')){               
                
                if(termin.status !== 'storniert' && !termin.checkedIn  ){
                    swal2.fire({
                        position: 'top-end',
                        icon: 'warning',
                        title: `Verspätung: ${termin.title}: ${termin.subject}`,
                        text: 'Der Termin hat sich nicht entschuldigt und wird automatisch storniert',
                        showConfirmButton: false,
                        timer: 9000,
                        toast:true
                      }).then((value) => {
                          if(value){

                            termin['status'] = 'storniert'
                            termin['patientRead'] = false
                            termin['checkedIn'] = false
                            termin['stornoGrund'] = 'Nicht erschienen, unentschuldigte Verspätung'
                            
                            Meteor.call('termin.update', 
                            termin._id, 
                            termin,
                            (error, result) => {
                              if(error){
                                swal(`${error.error}`,"","error")
                              }
                              if(result){
                                Meteor.call('termin.update_mail',
                                termin.patient.emails[0].address, 
                                termin.praxis.title, 
                                termin.subject, 
                                termin,
                                (error, result) => {
                                  if(error){
                                    swal('Fehler', `${error.error}`, 'error');
                                  }
                                    if(result){
                                        swal2.fire({
                                            position: 'top-end',
                                            icon: 'success',
                                            title: `Verspätung: ${termin.title}: ${termin.subject}`,
                                            text: 'Der Termin wurde erfolgreich storniert',
                                            showConfirmButton: false,
                                            timer: 5000,
                                            toast:true
                                        })
                                    }
                                });
                                
                              }
                            })
                        }
                      })
                }
            }
        }, 60000);    
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    renderIcon(){
        if(this.props){
            if(this.props.patientRead === true){
                return (
                    <IconContext.Provider value={{size: "1em", className: "termin-icon--check" }}>
                        <MdDone />
                    </IconContext.Provider>
                );
            }
        }
    }
    render() {
        const className = this.checkDelay() ? this.checkDelay() : 'termin-list-item';
        
        return (
            
            <div className={className} id={this.props._id}>
                <div className="listitem-title">
                    {this.renderIcon()}
                    <h5>{this.props.title}</h5>
                </div>
                <p className="item__message">
                    <small>{moment(this.props.start).format('HH:mm')} Uhr <br/>
                    {this.props.subject}</small>
                </p>
                <button type="button" className="button button--pill" onClick={this.checkIn.bind(this)}>einchecken</button>
                <button type="button" className="button button--pill" onClick={this.handleRemoveItem.bind(this)}>löschen</button>
            </div>
        )
    }
}
TerminListeItem.propTypes = {
    _id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
