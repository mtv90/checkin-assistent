import React from 'react';
import { Meteor } from 'meteor/meteor';
import {Link} from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import Select from 'react-select';
import swal from 'sweetalert';

const options = [
  { value: 'admin', label: 'Administrator' },
  { value: 'patient', label: 'Patient' }
]

export default class Signup extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          error: '',
          selectedOption: null,
        }
        if (!!Meteor.userId()) {
          history.push('/dashboard')
        }

    }

    
    onSubmit(e){
      let vorname = this.refs.vorname.value.trim();
      let nachname = this.refs.nachname.value.trim();
      let email = this.refs.email.value.trim();
      let password = this.refs.password.value.trim();
      let confirmPassword = this.refs.confirmPassword.value.trim();
      let role = this.state.selectedOption.value;
      
      switch (password) {
        case password.length < 6:
          this.setState({error: 'Das Passwort muss mehr als 6 Zeichen haben.'});
          break;
        case !(password === confirmPassword):
          this.setState({ error: 'Die Passwörter stimmen nicht überein!'})
          break;
        case (password === confirmPassword) && password.length < 6:
          this.setState({ error: 'Die Passwörter sind kurz!'})
          break;
        default:
          this.setState({error:''})
          Accounts.createUser({
            role,
            profile: {
              vorname, 
              nachname,
            }, 
            email, 
            password
          }, (err) => {
            if (err) {
              this.setState({error: err.reason});
            } else {
              this.setState({error: ''});
            }
          });
          
          // Methodenaufruf, damit die Verifizierungsmail versendet wird 

          Meteor.call('sendeEmail', 
            email,
            (error, result) => {
              if(error){
                swal("Fehler", `${error.error}`, "error");
              } else{
                swal("Nutzer erfolgreich angelegt", "Es wurde eine Email zur Verifizierung an die angegebene Adresse versandt.", "success");
              }
            },
          );
          break;
      }
    }

    handleChangeRollen(selectedOption){
      
      this.setState({selectedOption});

    }

    render(){
      const { selectedOption } = this.state;
    
      return (
        <div className="boxed-view">
          <div className="boxed-view__box box-view__shadow"> 
            <h1 className="">Registrieren</h1>
            {this.state.error ? <p className="red darken-1">{this.state.error}</p> : undefined}
            <form className="boxed-view__form" onSubmit={this.onSubmit.bind(this)}>
              <input className="admin-input" type="text" placeholder="Vorname" name="vorname" ref="vorname" autoComplete="new-password" required autoFocus/>
              <input className="admin-input" type="text" placeholder="Nachname" name="nachname" ref="nachname" autoComplete="new-password" required/>
              <input className="admin-input" type="email" placeholder="Email" name="email" ref="email" autoComplete="new-password" required/>
              <input className="admin-input" type="password" placeholder="Passwort" name="password" ref="password" autoComplete="new-password" required/>
              <input className="admin-input" type="password" placeholder="Passwort wiederholen" name="passwordconfirm" autoComplete="new-password" ref="confirmPassword" required/>
              <div className="">
                <label htmlFor="rolle">Benutzerrolle</label>
                  <Select
                    className="select-box"
                      placeholder="auswählen..."
                      value={selectedOption}
                      onChange={this.handleChangeRollen.bind(this)}
                      options={options}
                    />
                  </div>
              <button className="button" type="submit">registrieren</button>
              <Link to="/"><small>Sie haben einen schon einen Account?</small></Link>
            </form>
          </div>
        </div>
        );
      }
}