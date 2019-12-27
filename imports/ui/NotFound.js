import React from 'react';
import {Link} from 'react-router-dom';

export default () => {
    return (
        <div className="boxed-view">
            <div className="boxed-view__box">
                <h1>Page Not Found</h1>
                <p>Leider konnten wir die angeforderte Seite nicht finden.</p>
                <Link className="button button--link" to="/">ZURÜCK</Link>
            </div>
        </div>
    )
}