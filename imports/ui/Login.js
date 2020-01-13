import React from 'react';
import {Link} from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import history from '../routes/history'

export default class Login extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        error: ''
      }
    }

    onLogin(e){
        let email = this.refs.email.value.trim();
        let password = this.refs.password.value.trim();
    
        Meteor.loginWithPassword({email}, password, (err) => {
          if(err){
            this.setState({error: 'Login nicht möglich. Bitte Email und Passwort überprüfen.'});
          } else {
            this.setState({error: ''});
            history.push('/dashboard')
          }
        });
        
    }
    render() {
        return (
            <div className="boxed-view">
                <div className="boxed-view__box">
                    <h1 className="card-title">Anmelden</h1>
                    {this.state.error ? <p className=" red-text text-darken-1">{this.state.error}</p> : undefined}
                    <form onSubmit={this.onLogin.bind(this)} className="boxed-view__form">
                        <input placeholder="Email" type="email" ref="email" required />
                        <input placeholder="Passwort" type="password" ref="password" required />
                        <button className="button" type="submit" name="action">anmelden</button>   
                    </form>
                    <Link className="" to="/signup"><small>Noch keinen Account? Jetzt registrieren..</small></Link>
                </div>
            </div>
        )
    }
}