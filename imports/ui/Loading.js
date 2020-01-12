import React from 'react';

export const Loading = (props) => {
    var Spinner = require('react-spinkit');
    return (
        <div className="pacman-view">
            <Spinner name='pacman' color="#92A8D1" />
        </div>
    )
}
export default Loading;