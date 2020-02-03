import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import PropTypes from 'prop-types';

import {Session} from 'meteor/session';
import Patientheader from './Patientheader';
import AccountDatenListe from './AccountDatenListe';
import AccountEditor from './AccountEditor';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import {Konten} from '../api/konten';

import 'react-tabs/style/react-tabs.css';

export const Account = (props) => {
    var Spinner = require('react-spinkit');

    // if(!props.konto){
    //     return (
    //         <div className="pacman-view">
    //             <Spinner name='pacman' color="#1BBC9B" />
    //         </div>
    //     )
    // }
    return (
        <div>
            <Patientheader title={`${Session.get('user').profile.nachname}, ${Session.get('user').profile.vorname}`}/>
            <div className="page-content editor-container">
                <div className="page-content__sidebar">
                   
                    <div className="sidebar-button--wrapper">
                    
                    <Link className="button button--link button--cancel-account" to={{pathname: `/dashboard`}}>Dashboard</Link>
                
                    <button className="button button--link button--cancel-account" onClick={() => { Accounts.logout(); history.replace('/'); }}>logout</button>
                </div>
                    
                    
                    <Tabs className="tabs-content">
                        <TabList>
                        <Tab>Konto</Tab>
                        <Tab>Historie</Tab>
                        <Tab>Nachrichten</Tab>
                        </TabList>

                        <TabPanel>
                        <div><AccountDatenListe/></div>
                        </TabPanel>
                        <TabPanel>
                        <h2>TEST</h2>
                        </TabPanel>
                        <TabPanel>
                        <h2>Nachrichten</h2>
                        </TabPanel>
                    </Tabs>
                </div>
                <div className="page-content__main">
                    {props.konto ? <AccountEditor konto={props.konto}/> : <div className="editor">
                     <p className="editor--message">
                        Es wurden noch keine Stammdaten hinterlegt
                     </p>
                </div>}
                    
                </div>
            </div>
        </div>
    );
};
Account.propTypes = {
    konto: PropTypes.object,
} 
export default withTracker( () => {
    Meteor.subscribe('meinKonto')
    // const konto = Konten.findOne({user_id: Meteor.userId()});
    
    return {
        konto: Konten.findOne({user_id: Meteor.userId()}),
    };
})(Account);
