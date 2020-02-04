import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import Modal from 'react-modal';
import Spinner from 'react-spinkit';
import { MdInfo, MdDone } from "react-icons/md";
import { IconContext } from "react-icons";

export default class WartelisteItem extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            isLoading: false,
            isOpen: false
        }
    }

    uncheckItem(e){
        e.preventDefault();
        let termin = {
            ...this.props
        };
        
        if(!!termin._id){
            termin['checkedIn'] = false;
            termin['status'] ="open";
            termin['patientRead'] = false;
            Meteor.call('termin.check', termin._id, termin,
                (err, res) => {
                    if(err) {
                        swal("Fehler", `${err.error}`, "error");
                    } else {
                        swal("Patient ausgechecked", "", "warning");
                    }
                }
            );
        }
    }
    renderIconPatientCheck(){
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
    renderIconAdminCheck(){
        if(this.props){
            if(this.props.adminRead === false){
                return (
                    <IconContext.Provider value={{size: "1em", className: "termin-icon--info" }}>
                        <MdInfo />
                    </IconContext.Provider>
                );
            }
        }
    }
    render() {
        return (
            <div className="item drag-it" id={this.props._id} >
                <div className="listitem-title" onClick={(val) => {
                    let termin = {
                        ...this.props
                    };
                    termin['adminRead'] = true;
                    Meteor.call('termin.check', termin._id, termin,
                        (err, res) => {
                            if(err) {
                                swal("Fehler", `${err.error}`, "error");
                            }
                        }
                    );
                }}>
                    {this.renderIconAdminCheck()}
                    {this.renderIconPatientCheck()}
                    <h5>{this.props.title}</h5>
                </div>
                <p className="item__message">
                    <small>{moment(this.props.start).format('HH:mm')} Uhr <br/>
                    {this.props.subject}</small>
                </p>
                <button type="button" className="button button--pill" onClick={this.uncheckItem.bind(this)}>checkout</button>
            </div>
        )
    }
}
WartelisteItem.propTypes = {
    _id: PropTypes.string.isRequired,
    user_id: PropTypes.string.isRequired
}
