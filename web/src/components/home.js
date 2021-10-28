import React, { Component } from 'react'

import { Link, Route, Switch } from 'react-router-dom'

import IsolationContainer from './isolationContainer'

class Home extends Component {

    state = {
        
    }

    render() {
        return (
            <div>
                <ul>
                    <li><Link to="/game">Game</Link></li>
                </ul>
                <button>Create Game</button>
                <br/>
                <br/>
                <input type="text" name="" id="" value="Room ID"/><button>Join Game</button>
                <Switch>
                    <Route path="/game">
                        <IsolationContainer width="4" height="4" />
                    </Route>
                </Switch>
            </div>
        )
    }
}

export default Home
