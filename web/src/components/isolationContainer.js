import React from 'react';
import StrategyManager from '../managers/strategyManager';
import HeuristicManager from '../managers/heuristicManager'
import Isolation from './isolation';
import '../css/style.css';
import io from "socket.io-client";
const socket = io('localhost:3000');
class IsolationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: this.props.roomCode||0,
            userName: props.userName||'',
            showHeuristic: props.strategy === StrategyManager.none? false:true,
            strategy: props.strategy || StrategyManager.none,
            heuristic: props.heuristic || HeuristicManager.simple,
            width: props.width || 4,
            height: props.height || 4,
            treeDepth: props.treeDepth || 30,
            miniMaxDepth: props.miniMaxDepth || 7
        };
        console.log(this.state.roomCode);
    }
  
    // onStrategy = (e) => {
    //     this.setState({ strategy: StrategyManager[e.currentTarget.value] });
    //     console.log(`Strategy set to ${e.currentTarget.value}.`);
    // }
    // componentWillUpdate  () {
    //     socket.on('initGame',()=>{
    //         this.setState({ showIsolation: true });
    //     })
    // }
    onHeuristic = (e) => {
        this.setState({ heuristic: HeuristicManager[e.currentTarget.value] });
        console.log(`Heuristic set to ${e.currentTarget.value}.`);
    }

    render() {
            return (
                <div className="wrapper">
                        <Isolation width={this.state.width}
                            roomCode = {this.state.roomCode}
                            userName = {this.state.userName}
                            height={this.state.height}
                            strategy={this.state.strategy}
                            treeDepth={this.state.treeDepth}
                            miniMaxDepth={this.state.miniMaxDepth}
                            heuristic={this.state.heuristic} />
                            {this.state.showHeuristic && <div className="gamePlayOptions mt-3">
                                <div className='row'>
                                    <div className='col text-muted'>
                                        Game Play
                                    </div>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col text-muted'>
                                        AI Tactical
                                    </div>
                                </div>
                                {/* list tactic */}
                                <div className="row">
                                    <div className="col">
                                        <input type="radio" name="heuristic" value="simple" checked={this.state.heuristic === HeuristicManager.simple} onChange={this.onHeuristic} /> <span>Simple</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input type="radio" name="heuristic" value="offensive" checked={this.state.heuristic === HeuristicManager.offensive} onChange={this.onHeuristic} /> <span>Offensive</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col">
                                        <input type="radio" name="heuristic" value="defensive" checked={this.state.heuristic === HeuristicManager.defensive} onChange={this.onHeuristic} /> <span>Defensive</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input type="radio" name="heuristic" value="aggressive" checked={this.state.heuristic === HeuristicManager.aggressive} onChange={this.onHeuristic} /> <span>Aggressive</span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <input type="radio" name="heuristic" value="offensiveToDefensive" checked={this.state.heuristic === HeuristicManager.offensiveToDefensive} onChange={this.onHeuristic} /> <span>Offensive to Defensive</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <input type="radio" name="heuristic" value="defensiveToOffensive" checked={this.state.heuristic === HeuristicManager.defensiveToOffensive} onChange={this.onHeuristic} /> <span>Defensive to Offensive</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <input type="radio" name="heuristic" value="walls" checked={this.state.heuristic === HeuristicManager.walls} onChange={this.onHeuristic} /> <span>Walls</span>
                                    </div>
                                </div>
                            </div>}
                    </div>
            );
        }
       
    
}

export default IsolationContainer;