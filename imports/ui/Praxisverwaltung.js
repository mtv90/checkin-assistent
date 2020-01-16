import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import PrivateHeader from './PrivateHeader';
import Praxisliste from './Praxisliste';
import PraxisEditor from './PraxisEditor';
import PropTypes from 'prop-types';

export class Praxisverwaltung extends React.Component {
    openNav(){
        document.getElementById("mySidenav").style.width = "250px";
        
    }
    closeNav(){
        document.getElementById("mySidenav").style.width = "0";
        
    }
    // componentWillUnmount(){
    //     alert('TEST')
    // }
    render(){
        return (
            <div>
                <PrivateHeader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
                
                <button type="button" className="button menu" onClick={this.openNav.bind(this)}>&#9776;</button>
                <div id="mySidenav" className="sidenav">
                    <a type="button" className="closebtn" onClick={this.closeNav.bind(this)}>&times;</a>
                    <Praxisliste />
                </div>
                <div className="wrapper page-content">
                    <div className="termin-liste page-content__sidebar">
                        <Praxisliste />
                    </div>
                    <div className="page-content__main">
                        <PraxisEditor />
                    </div>
                </div>
            </div>
        )
    }

}
export default Praxisverwaltung;

// export default withTracker( () => {
//     // const selectedTerminId = Session.get('selectedTerminId');
//     Meteor.subscribe('praxen');
//     return {
//     };
// })(Praxisverwaltung);