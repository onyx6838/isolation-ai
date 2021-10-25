import React from 'react';
import IsolationManager from '../managers/isolationManager';
import StrategyManager from '../managers/strategyManager';
import Grid from './Grid';
import Player from './Player';

class Isolation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      round: 1,
      playerIndex: props.playerIndex || 0,
      players: [
        {
          x: props.player1x || -1,
          y: props.player1y || -1,
          moves: [{}]
        }
        , {
          x: props.player2x || -1,
          y: props.player2y || -1,
          moves: [{}]
        }],
      grid: props.grid,
      strategy: props.strategy,
      heuristic: props.heuristic,
      width: props.width,
      height: props.height,
      treeDepth: props.treeDepth,
      miniMaxDepth: props.miniMaxDepth,
    };

    this.state.players[0].moves = IsolationManager.allMoves(0, this.state.players, props.width, props.height);
    this.state.players[1].moves = IsolationManager.allMoves(1, this.state.players, props.width, props.height);

    this.grid = React.createRef();
  }

  onGrid = (x, y, values) => {
    const playerIndex = this.state.playerIndex;
    const players = this.state.players;

    if (IsolationManager.isValidMove(x, y, playerIndex, players, values, this.grid.current.props.width, this.grid.current.props.height)) {
      // Update player position.
      players[playerIndex].x = x;
      players[playerIndex].y = y;

      // Update the grid local variable with the player move (so available moves will be accurate).
      values[y][x] = playerIndex + 1;

      // Update available moves for all players.
      players[0].moves = IsolationManager.availableMoves(0, players, values, this.grid.current.props.width, this.grid.current.props.height);
      players[1].moves = IsolationManager.availableMoves(1, players, values, this.grid.current.props.width, this.grid.current.props.height);

      // Update cell value in the grid.
      this.grid.current.setValue(x, y, !playerIndex ? 'lightpink' : 'lightblue');

      
      
      this.setState({ round: this.state.round + 1, playerIndex: !playerIndex ? 1 : 0, players}, () => {
        if (this.state.playerIndex && this.state.players[this.state.playerIndex].moves.length > 0) {
          
          if(this.state.strategy && this.state.strategy === StrategyManager.random) {
            setTimeout(() => {
            ({ x, y } = this.props.strategy(this.state.playerIndex, this.state.players, values, this.grid.current.props.width, this.grid.current.props.height));
            console.log(`AI is moving to ${x},${y}.`)
            this.onGrid(x, y, values);
          }, 1000);
          }
          else if (this.state.strategy && this.state.strategy === StrategyManager.minimax) {
            if(Math.round(this.state.round / 2) === 1) {
                const tree = '';
                setTimeout(() => {
                  // tree = StrategyManager.tree(playerIndex, JSON.parse(JSON.stringify(players)), values, this.grid.current.props.width, this.grid.current.props.height, this.state.round, this.state.heuristic, this.state.miniMaxDepth);
                // StrategyManager.renderTree(tree, this.state.treeDepth);
  
                // Get the AI's move.
                ({ x, y } = this.props.strategy(tree,this.state.playerIndex, this.state.players, values, this.grid.current.props.width, this.grid.current.props.height));
                console.log(`AI is moving to ${x},${y}.`)
  
                // Move the AI player.
                this.onGrid(x, y, values);
              }, 1000);
            }else {
              // AI turn.
              setTimeout(() => {
                const tree = StrategyManager.tree(playerIndex, JSON.parse(JSON.stringify(players)), values, this.grid.current.props.width, this.grid.current.props.height, this.state.round, this.state.heuristic, this.state.miniMaxDepth);
              // StrategyManager.renderTree(tree, this.state.treeDepth);

              // Get the AI's move.
              ({ x, y } = this.props.strategy(tree,this.state.playerIndex, this.state.players, values, this.grid.current.props.width, this.grid.current.props.height));
              console.log(`AI is moving to ${x},${y}.`)

              // Move the AI player.
              this.onGrid(x, y, values);
            }, 1000);
            }
            }
           
        }
      });
      
      return true;
    }
  }

  render() {
    const moves = this.props.moves !== undefined ? this.props.moves : this.state.players[this.state.playerIndex].moves.length;
    const winnerIndex = this.state.playerIndex ? 1 : 2;

    return (
      <div id='app' ref={this.container}>
        <h1 style={{ fontWeight: 'bold' }}>Isolation Game</h1>
        <Grid width={this.state.width} height={this.state.height} grid={this.props.grid} cellStyle={this.props.cellStyle} players={this.state.players} onClick={this.onGrid} ref={this.grid}>
          <Player width="100" height="100" x={this.state.players[0].x} y={this.state.players[0].y} cellStyle={this.props.cellStyle} color="#C71585" backgroundColor='lightpink'></Player>
          <Player width="100" height="100" x={this.state.players[1].x} y={this.state.players[1].y} cellStyle={this.props.cellStyle} color="#00BFFF" backgroundColor='lightblue'></Player>
        </Grid>
        <div className='row'>
          <div className='col col-auto'>
            <div className={`badge ${!this.state.playerIndex ? 'badge-danger' : 'badge-primary'}`}>Player {this.state.playerIndex + 1}'s Turn</div>
          </div>
          <div className='col col-auto'>
            <div className='badge badge-success'>{moves} Moves Available</div>
          </div>
          <div className='col col-auto'>
            <div className={`badge badge-success ${!moves ? '' : 'd-none'}`}>Player {winnerIndex} wins!</div>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <div className='badge badge-secondary'>
              Turn {Math.round(this.state.round / 2)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Isolation;