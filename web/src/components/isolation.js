import React from "react";
import IsolationManager from '../managers/isolationManager';
import StrategyManager from '../managers/strategyManager';
import Grid from './grid';
import Player from './player';
import store from './store.js';
const socket = store.getState().socket;
class Isolation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,
      roomCode: this.props.roomCode || 0,
      userName: props.userName || '',
      userPlayed: props.userName || '',
      nameWillPlay: props.userName || '',
      round: 1,
      playerIndex: 0,
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
      winnerIndex: 0,
    };
    this.state.players[0].moves = IsolationManager.allMoves(0, this.state.players, props.width, props.height);
    this.state.players[1].moves = IsolationManager.allMoves(1, this.state.players, props.width, props.height);
    this.grid = React.createRef();
    this.onGrid = this.onGrid.bind(this);
  }
  componentDidUpdate(nextProps) {
    const { strategy, heuristic, width, height, treeDepth, miniMaxDepth } = this.props;

    if (strategy && nextProps.strategy !== strategy) {
      this.setState({ strategy });
    }

    if (heuristic && nextProps.heuristic !== heuristic) {
      this.setState({ heuristic });
    }

    if (width && nextProps.width !== width) {
      this.setState({ width });
    }

    if (height && nextProps.height !== height) {
      this.setState({ height });
    }

    if (treeDepth && nextProps.treeDepth !== treeDepth) {
      this.setState({ treeDepth });
    }

    if (miniMaxDepth && nextProps.miniMaxDepth !== miniMaxDepth) {
      this.setState({ miniMaxDepth });
    }
    if(this.state.players[this.state.playerIndex].moves.length=== 0) {
      console.log('end');
    }else {
      console.log('until');
    }
  }
  componentDidMount() {
    if (StrategyManager.none === this.state.strategy) {
      socket.on('sendDataClient', data => {
        this.grid.current.setValue(data.x, data.y, !data.playerIndex ? 'lightpink' : 'lightblue');
        this.setState({ x: data.x, y: data.y, playerIndex: !data.playerIndex ? 1 : 0, players: data.players, values: data.values, round: this.state.round + 1, nameWillPlay: data.nameWillPlay, userPlayed: data.userName });
      });
    }
  }
  onGrid = (x, y, values) => {
    const playerIndex = this.state.playerIndex;
    const players = this.state.players;
    if (IsolationManager.isValidMove(x, y, playerIndex, players, values, this.grid.current.props.width, this.grid.current.props.height)) {
      players[playerIndex].x = x;
      players[playerIndex].y = y;
      // Update the grid local variable with the player move (so available moves will be accurate).
      values[y][x] = playerIndex + 1;
      // Update available moves for all players.
      players[0].moves = IsolationManager.availableMoves(0, players, values, this.grid.current.props.width, this.grid.current.props.height);
      players[1].moves = IsolationManager.availableMoves(1, players, values, this.grid.current.props.width, this.grid.current.props.height);
      if (StrategyManager.none === this.state.strategy) 
      {
        if(this.state.index === this.state.playerIndex)   {
          socket.emit('sendDataServer', { x: x, y: y, values: values, playerIndex: playerIndex, players: players, roomCode: this.state.roomCode, userName: this.state.userName });
          return;
        }
        else {
            alert("Chưa đến lượt");
            return ;
        }
      }
      if (StrategyManager.none === this.state.strategy) socket.emit('sendDataServer', { x: x, y: y, values: values, playerIndex: playerIndex, players: players, roomCode: this.state.roomCode, userNamePlaying: this.state.userName });
      else {
        this.grid.current.setValue(x, y, !playerIndex ? 'lightpink' : 'lightblue');
        this.setState({ round: this.state.round + 1, playerIndex: !playerIndex ? 1 : 0, values: values, players: players }, () => {
          if (this.state.playerIndex && this.state.players[this.state.playerIndex].moves.length > 0) {
           if (this.state.strategy && this.state.strategy !== StrategyManager.none) {
                  if (this.state.width === 5 && this.state.height === 5 && Math.round(this.state.round / 2) <= 3) {
                        setTimeout(() => {
                          const tree = 1;
                          // Get the AI's move.
                          ({ x, y } = this.props.strategy(tree, this.state.playerIndex, this.state.players, values, this.grid.current.props.width, this.grid.current.props.height));
                          console.log(`AI is moving to ${x},${y}.`)

                          // Move the AI player.
                          this.onGrid(x, y, values);
                        }, 1000);
                  } else {
                          if(this.state.width >= 4 && this.state.height >=4  && Math.round(this.state.round / 2) <= 5) {
                              this.setState({miniMaxDepth: 15, minDepth: 5}) 
                          }
                          else {
                            this.setState({miniMaxDepth: 25, minDepth: 9})   
                          }     // AI turn.
                      
                        setTimeout(() => {
                          const tree = StrategyManager.tree(playerIndex, JSON.parse(JSON.stringify(players)), values, this.grid.current.props.width, this.grid.current.props.height, this.state.round, this.state.heuristic, this.state.miniMaxDepth);
                          // StrategyManager.renderTree(tree, this.state.treeDepth);

                          // Get the AI's move.
                          ({ x, y } = this.props.strategy(tree, this.state.playerIndex, this.state.players, values, this.grid.current.props.width, this.grid.current.props.height));
                          console.log(`AI is moving to ${x},${y}.`)

                          // Move the AI player.
                          this.onGrid(x, y, values);
                          }, 1000);
                    }
                }
            }
          });
        }
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
            <div className={`badge ${!this.state.playerIndex ? 'badge-danger' : 'badge-primary'}`}>Player {this.state.nameWillPlay ? this.state.nameWillPlay : this.state.playerIndex === 0 ? "You": "Computer"}'s Turn</div>
          </div>
          <div className='col col-auto'>
            <div className='badge badge-success'>{moves} Moves Available</div>
          </div>
          <div className='col col-auto'>
            <div className={`badge badge-success ${!moves ? '' : 'd-none'}`}>Player {this.state.userPlayed ? this.state.userPlayed : (winnerIndex === 1 ? 'You' : 'Computer')} wins!</div>
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