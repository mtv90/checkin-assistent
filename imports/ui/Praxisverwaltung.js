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

    render(){
        return (
            <div className="">
                <PrivateHeader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
                
                <div className="page-content editor-container">
                    <div className="page-content__sidebar">
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

