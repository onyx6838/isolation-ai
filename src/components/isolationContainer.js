import React from 'react';
import StrategyManager from '../managers/strategyManager';
import Isolation from './isolation';
import '../css/style.css';

class IsolationContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      strategy: props.strategy || StrategyManager.none,
      width: props.width || 4,
      height: props.height || 4,
    }; 
  }
  onStrategy(e) {
    this.setState({ strategy: StrategyManager[e.currentTarget.value] });
    console.log(`Strategy set to ${e.currentTarget.value}.`);
  }
  render() {
    return (
      <div>
        <Isolation width={this.state.width} height={this.state.height} strategy={this.state.strategy}></Isolation>

        <div className="gamePlayOptions mt-3">
          <div className='row'>
            <div className='col text-muted'>
              Game Play
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <input type="radio" name="strategy" value="minimax" checked={this.state.strategy === StrategyManager.minimax} onChange={this.onStrategy} /> <span>Minimax</span>
              <input type="radio" name="strategy" value="random" checked={this.state.strategy === StrategyManager.random} onChange={this.onStrategy} /> <span>Random</span>
              <input type="radio" name="strategy" value="none" checked={!this.state.strategy || this.state.strategy === StrategyManager.none} onChange={this.onStrategy} /> <span>2 Players</span>
            </div>
          </div>
         
        </div>
      </div>
    );
  }fff
}

export default IsolationContainer;