import React from 'react';
import IsolationManager from '../managers/isolationManager';
import Grid from './grid';
import Player from './player';

class Isolation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      round: 1,
      playerIndex: props.playerIndex || 0,
      players: [{ x: props.player1x || -1, y: props.player1y || -1, moves: [{}] }, { x: props.player2x || -1, y: props.player2y || -1, moves: [{}] }],
      grid: props.grid,
      strategy: props.strategy,
      width: props.width,
      height: props.height,
    };

    this.state.players[0].moves = IsolationManager.allMoves(0, this.state.players, props.width, props.height);
    this.state.players[1].moves = IsolationManager.allMoves(1, this.state.players, props.width, props.height);

    this.grid = React.createRef();
    this.onGrid = this.onGrid.bind(this);
  }

  onGrid(x, y, values) {
    const playerIndex = this.state.playerIndex;
    const players = this.state.players;

    if (IsolationManager.isValidMove(x, y, playerIndex, players, values, this.grid.current.props.width, this.grid.current.props.height)) {
      //
      players[playerIndex].x = x;
      players[playerIndex].y = y;

      //
      values[y][x] = playerIndex + 1;

      //
      players[0].moves = IsolationManager.availableMoves(0, players, values, this.grid.current.props.width, this.grid.current.props.height);
      players[1].moves = IsolationManager.availableMoves(1, players, values, this.grid.current.props.width, this.grid.current.props.height);

      //
      this.grid.current.setValue(x, y, !playerIndex ? 'lightpink' : 'lightblue');

      //
      this.setState({ round: this.state.round + 1, playerIndex: !playerIndex ? 1 : 0, players});

      return true;
    }
  }

  render() {
    const moves = this.props.moves !== undefined ? this.props.moves : this.state.players[this.state.playerIndex].moves.length;
    const winnerIndex = this.state.playerIndex ? 1 : 2;

    return (
      <div id='app' ref={this.container}>
        <Grid width={this.state.width} height={this.state.height} grid={this.props.grid} cellStyle={this.props.cellStyle} players={this.state.players} onClick={this.onGrid} ref={this.grid}>
          <Player width="100" height="100" x={this.state.players[0].x} y={this.state.players[0].y} cellStyle={this.props.cellStyle} color="#C71585"></Player>
          <Player width="100" height="100" x={this.state.players[1].x} y={this.state.players[1].y} cellStyle={this.props.cellStyle} color="#00BFFF"></Player>
        </Grid>
        <div className='row'>
          <div className='col col-auto'>
            <div className={`badge ${!this.state.playerIndex ? 'badge-primary' : 'badge-warning'}`}>Player {this.state.playerIndex + 1}'s Turn</div>
          </div>
          <div className='col col-auto'>
            <div className='badge badge-light'>{moves} Moves Available</div>
          </div>
          <div className='col col-auto'>
            <div className={`badge badge-success ${!moves ? '' : 'd-none'}`}>Player {winnerIndex} wins!</div>
          </div>
        </div>

        <div className='row'>
          <div className='col'>
            <div className='badge badge-secondary'>
              Move {Math.round(this.state.round / 2)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Isolation;