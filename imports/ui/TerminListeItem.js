import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
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
        if(this.state.moment.diff(this.props.start, 'minutes') >= -120 && this.state.moment.diff(this.props.start, 'minutes') < -30){

            return 'termin-list-item min30';
        }
        if(this.state.moment.diff(this.props.start, 'minutes') >= -30 && this.state.moment.diff(this.props.start, 'minutes') < 0){
            return 'termin-list-item min15'
        }
        if(this.state.moment.diff(this.props.start, 'minutes') >= 0 ){
            return 'termin-list-item too-late'
        }  
    }
    componentDidMount(){
        
        const self = this;
        self.interval = setInterval(function() {
          self.setState({
            moment: moment(),
          });
        }, 300000);    
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
        
        // console.log(mo.diff(this.props.start, 'minutes'))
        // mo.diff(this.props.start, 'seconds')
        // console.log(moment(this.props.start).fromNow()) 
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
