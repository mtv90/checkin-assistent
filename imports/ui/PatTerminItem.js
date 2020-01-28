import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import moment from 'moment';
import {Session} from 'meteor/session';
import FlipMove from 'react-flip-move';
import { MdInfo, MdDone } from "react-icons/md";
import { IconContext } from "react-icons";

export class PatTerminItem extends React.Component {
    constructor(props){
        super(props);
        this.state= {
            date:''
        }
        
    }
    componentDidMount(){
        
    }
    render() {
        const className = this.props.termin.selected ? 'pat-termin-item pat-termin-item--selected' : 'pat-termin-item'
        return (
            <div className={className} id={this.props.termin._id} onClick={ () => {
                this.props.Session.set('selectedTerminId', this.props.termin._id)
                this.props.termin['patientRead'] = true;
               
                Meteor.call('termin.check', this.props.termin._id, this.props.termin,
                    (err, res) => {
                        if(err) {
                            console.log(err)
                            swal("Fehler", `${err.error}`, "error");
                        }
                    })
            }}>
                <h5>{this.props.termin.subject}</h5>
                
                {this.props.termin.patientRead ? 
                    undefined: 
                    (
                        <IconContext.Provider value={{size: "1.4em", className: "termin-icon--info" }}>
                            <MdInfo />
                        </IconContext.Provider>
                    )}
                
                <p className="item__message">{moment(this.props.termin.start).format("HH:mm")} Uhr | {moment(this.props.termin.start).format("DD.MM.YYYY")}</p>
            </div>
        )
    }
}
PatTerminItem.propTypes = {
    termin: PropTypes.object.isRequired,
    Session: PropTypes.object.isRequired
}

export default withTracker( () => {
    return { Session };
})(PatTerminItem);