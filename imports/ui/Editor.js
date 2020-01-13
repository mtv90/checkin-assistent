import React from 'react';
import {Meteor} from 'meteor/meteor'
import { withTracker  } from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import {Termine} from '../api/termine';
import PropTypes from 'prop-types';

export class Editor extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        
    }
    render() {
       if(this.props.termin) {
        return (
            <div>
                {/* Wann ?
                Wo?
                Bei wem?
                Was muss ich mitrbingen? */}
            </div>
        )
       } else {
           return (
               <p>
                   {this.props.selectedTerminId ? 'Kein Termin gefunden' : 'Bitte einen Termin auswählen.'}
               </p>
           )
       }
    }
}

// Editor.propTypes = {
//     selectedTerminId: PropTypes.string,
//     termin: PropTypes.object
// }

export default withTracker( () => {
    const selectedTerminId = Session.get('selectedTerminId');
    return {
        selectedTerminId,
        termin: Termine.findOne({_id: selectedTerminId}),
        call: Meteor.call,
        history,
        Session
    };
})(Editor);