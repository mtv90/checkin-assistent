import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import PrivateHeader from './PrivateHeader';
import Praxisliste from './Praxisliste';
// import Praxisview from './Praxisview';
import PropTypes from 'prop-types';

export class Praxisverwaltung extends React.Component {
    openNav(){
        document.getElementById("mySidenav").style.width = "250px";
        
    }
    closeNav(){
        document.getElementById("mySidenav").style.width = "0";
        
    }
    render(){
        return (
            <div>
                <PrivateHeader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
                
                <button type="button" className="button menu" onClick={this.openNav.bind(this)}>&#9776;</button>
                <div id="mySidenav" className="sidenav">
                    <a type="button" className="closebtn" onClick={this.closeNav.bind(this)}>&times;</a>
                    <Praxisliste />
                </div>
                <div className="wrapper">
                    <div className="termin-liste">
                        <Praxisliste />
                    </div>
                </div>
                {/* <Praxisview /> */}
            </div>
        )
    }

}
export default Praxisverwaltung;