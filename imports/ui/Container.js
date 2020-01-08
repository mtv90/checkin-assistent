import React from 'react';
import history from '../routes/history';
import { Tracker } from 'meteor/tracker';
import PropTypes from 'prop-types';
import AdminDashboard from './AdminDashboard';
import PatientenDashboard from './PatientenDashboard';
import NotFound from './NotFound';


export default class Container extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            routes: {},
            isLoading: false
        }
        
    }
    componentDidMount() {
        this.setState({isLoading:true});
        
        this.userTracker = Tracker.autorun(() => {
            
            const admin = Session.get('admin');
            const patient = Session.get('patient')
            
            if(admin){
                this.setState({
                    admin,
                    isLoading:false
                })
            }
            if(patient){
                this.setState({
                    patient,
                    isLoading:false
                })
            }

        });        
    }
    componentWillUnmount() {
        // this.userTracker = Tracker.stop();
    }
    render() {

        var Spinner = require('react-spinkit');
        const {isLoading} = this.state;
        
        if (isLoading) {
          return  <Spinner name='ball-grid-pulse' className="spinner" color="#92A8D1" />;
        }
        switch (!!Meteor.userId()) {
            case this.state.admin:
                return (
                    <div>
                        <AdminDashboard/>
                    </div>
                );
            case this.state.patient:
                return (
                    <div>
                        <PatientenDashboard/>
                    </div>
                );
        
            default:
                return (
                    <div>
                       <p>Es wurde noch keine Benutzerrolle zugewiesen. Bitte an den Admin wenden!</p>
                    </div>
                )
                break;
        }
        if(!!Meteor.userId()){
            if(!!this.state.admin) {
                return (
                    <div>
                        <AdminDashboard/>
                    </div>
                );
            }
            if(!!this.state.patient) {
                return (
                    <div>
                        <PatientenDashboard/>
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <Spinner name='pacman' className="" color="#92A8D1" />;
                    </div>
                )
            }
        }

    }
}
// TerminListeItem.propTypes = {
//     _id: PropTypes.string.isRequired,
//     user_id: PropTypes.string.isRequired
// }