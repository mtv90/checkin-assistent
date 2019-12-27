import React from 'react';
import history from '../routes/history';
import { Tracker } from 'meteor/tracker';
import AdminDashboard from './AdminDashboard';
import PatientenDashboard from './PatientenDashboard';
import NotFound from './NotFound';


export default class Container extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            admin: false,
            patient: false,
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
                    patient,
                    isLoading: false
                })
            }
            if(patient){
                this.setState({
                    admin,
                    patient,
                    isLoading: false
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
    
        if (isLoading && !this.state.admin && !this.state.patient) {
          return  <Spinner name='ball-grid-pulse' className="spinner" color="#92A8D1" />;
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