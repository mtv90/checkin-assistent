import React from 'react';
import {Link} from 'react-router-dom';

export default class Verified extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let token = props.match.params.token;
        console.log(token)
    }
    render() {
        return (
            <div className="boxed-view">
                <div className="boxed-view__box">
                    <h1>Email verifiziert</h1>
                    <p>Viel Spaß.</p>
                    <Link className="button button--link" to="/">ZURÜCK</Link>
                </div>
            </div>
        )
    }
}