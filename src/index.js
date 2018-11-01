import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game';
import App from './App'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SomeComponent from './SomeComponent';
import 'typeface-roboto';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={App}/>
            <Route path="/game/:number" component={SomeComponent}/>
            <Route exact path='/game/' component={Game}/>
        </Switch>
    </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
