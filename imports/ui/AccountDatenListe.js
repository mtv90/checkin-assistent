import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker  } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import history from '../routes/history';
import {Konten} from '../api/konten';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import {Session} from 'meteor/session';
import AccountItem from './AccountItem';
import FlipMove from 'react-flip-move';
import Loading from './Loading';
import AddAccountDetails from './AddAccountDetails';



export const AccountDatenListe = (props) => {
    var Spinner = require('react-spinkit');
    if(props.isLoading){
        return (
            <div className="pacman-view">
                <Spinner name='pacman' color="#92A8D1" />
            </div>
        )
    }
    return (
        <div className="praxisliste">
            {props.konto ? (
                    props.konto.kategorien.map( (item) => {
                        if(item._id){
                            return <AccountItem key={item._id} item={item} />
                        }
                    }
               ) 
            ) : undefined }
            {!props.konto ? <AddAccountDetails title="Stammdaten"/> : undefined}
             
            
            
            {/* <FlipMove maintainContainerHeight={true}>
                {props.patiententermine.map( (termin) => {
                    return <AccountItem key={account._id} account={account}/> 
                })}
            </FlipMove>
            Stammdaten
            Fragebogen
            Nachrichten */}
        </div>
    );
};

export default withTracker( () => {
    const selectedKontoDetails = Session.get('selectedKontoDetails');
    const isLoading = Session.get('isLoading');
    Meteor.subscribe('meinKonto')
    let konto = Konten.findOne({user_id: Meteor.userId()});
    
    if(konto){
        let konten_ed = []
        konto.kategorien = konto.kategorien.map( (kategorie) => {
            return {
                ...kategorie,
                selected: kategorie._id === selectedKontoDetails
            }
        });
        
        return {
            konto,
            isLoading
        };
    } else {
        return <Loading/>
    }
       
})(AccountDatenListe);