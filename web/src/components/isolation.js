import React from "react";
import IsolationManager from "../managers/isolationManager";
import StrategyManager from "../managers/strategyManager";
import Grid from "./grid";
import Player from "./player";
import store from "./store.js";

import {createBrowserHistory} from 'history'
const socket = store.getState().socket;
class Isolation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: this.props.index,//người tạo phòng index là 0, khách là 1; dùng để thay đổi lượt chơi
      roomCode: this.props.roomCode || 0,//mã phòng
      userName: props.userName || "",
      userPlayed: props.userName || "",//lưu tên người chơi trước
      nameWillPlay: props.userName || "",//tên người chơi tiếp theo
      round: 1,//lượt chơi của cả 2 người
      playerIndex: 0,//dành cho chơi vs máy, 0 là người, 1 là máy
      players: [//vị trí người chơi
        {
          x: props.player1x || -1,
          y: props.player1y || -1,
          moves: [{}],// các bước có thể di chuyển
        },
        {
          x: props.player2x || -1,
          y: props.player2y || -1,
          moves: [{}],
        },
      ],
      grid: props.grid,
      strategy: props.strategy,
      heuristic: props.heuristic,
      width: props.width,
      height: props.height,
      treeDepth: props.treeDepth,
      miniMaxDepth: props.miniMaxDepth,
      winnerIndex: 0,
    };
    this.state.players[0].moves = IsolationManager.allMoves(
      0,
      this.state.players,
      props.width,
      props.height
    );
    this.state.players[1].moves = IsolationManager.allMoves(
      1,
      this.state.players,
      props.width,
      props.height
    );
    this.grid = React.createRef();
    this.onGrid = this.onGrid.bind(this);

  }
  componentDidUpdate(nextProps) {
    const { strategy, heuristic, width, height, treeDepth, miniMaxDepth } =
      this.props;

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
    if (this.state.players[this.state.playerIndex].moves.length === 0) {
      console.log("end");
    } else {
      console.log("until");
    }

  }
  
  componentDidMount() {
    socket.on('removedRoom', message => {
      alert(message);
      var history = new createBrowserHistory();
      history.replace('http://localhost:3001');
      window.location.reload();
    })
    if (StrategyManager.none === this.state.strategy) {
      socket.on("sendDataClient", (data) => {
        this.grid.current.setValue(
          data.x,
          data.y,
          !data.playerIndex ? "lightpink" : "lightblue"
        );
        this.setState({
          x: data.x,
          y: data.y,
          playerIndex: !data.playerIndex ? 1 : 0,
          players: data.players,
          values: data.values,
          round: this.state.round + 1,
          nameWillPlay: data.nameWillPlay,
          userPlayed: data.userName,
        });
      });
    }
  }
  onGrid = (x, y, values) => {
    const playerIndex = this.state.playerIndex;//thứ tự 2 người chơi (người chơi thứ 0,1)
    const players = this.state.players;//lấy vị trí của người chơi đang đứng\
    //nếu bước đi hợp lệ
    if (
      IsolationManager.isValidMove(
        x,
        y,
        playerIndex,
        players,
        values,
        this.grid.current.props.width,
        this.grid.current.props.height
      )
    ) {
      players[playerIndex].x = x;
      players[playerIndex].y = y;
      // Update the grid local variable with the player move (so available moves will be accurate).
      values[y][x] = playerIndex + 1;//màu ô
      //cập nhật các bước có thể đi của người chơi
      players[0].moves = IsolationManager.availableMoves(
        0,
        players,
        values,
        this.grid.current.props.width,
        this.grid.current.props.height
      );
      //cập nhật các bước có thể đi của người chơi
      players[1].moves = IsolationManager.availableMoves(
        1,
        players,
        values,
        this.grid.current.props.width,
        this.grid.current.props.height
      );
      //nếu 2 người chơi
      if (StrategyManager.none === this.state.strategy){
        if(this.state.index===this.state.playerIndex){
          socket.emit("sendDataServer", {
            x: x,
            y: y,
            values: values,
            playerIndex: playerIndex,
            players: players,
            roomCode: this.state.roomCode,
            userNamePlaying: this.state.userName,
          });
        }
        else{
          alert("Chưa đến lượt, cút")
          return;
        }
      }
      
        
      else {
        //set màu vị trí được click
        this.grid.current.setValue(
          x,
          y,
          !playerIndex ? "lightpink" : "lightblue"
        );
        this.setState(
          {
            round: this.state.round + 1,
            playerIndex: !playerIndex ? 1 : 0,
            values: values,
            players: players,
          },
          () => {
            //nếu là máy và còn nước đi
            if (
              this.state.playerIndex &&
              this.state.players[this.state.playerIndex].moves.length > 0
            ) {
              //nếu có chiến thuật
              if (
                this.state.strategy &&
                this.state.strategy !== StrategyManager.none
              ) {
                //nếu lượt chơi của máy vẫn chưa lớn hơn 2 thì random máy tiếp
                if (
                  (this.state.width >= 4 ||
                  this.state.height >=4) &&
                  Math.round(this.state.round / 2) <= 2
                ) {
                  setTimeout(() => {
                    const tree = 1;// có tree=1 là random
                    // Get the AI's move.
                    ({ x, y } = this.props.strategy(
                      tree,
                      this.state.playerIndex,
                      this.state.players,
                      values,
                      this.grid.current.props.width,
                      this.grid.current.props.height
                    ));
                    console.log(`AI is moving to ${x},${y}.`);
                    // Move the AI player.
                    this.onGrid(x, y, values);
                  }, 1000);
                  console.log(123);
                } else {
                  //nếu lượt chơi của máy chưa lớn hơn 5
                  if (
                    this.state.width >= 4 &&
                    this.state.height >= 4 &&
                    Math.round(this.state.round / 2) <= 5
                  ) {
                    
                    this.setState({ miniMaxDepth: 5});
                    
                  } else {
                    this.setState({ miniMaxDepth: 15});
                   
                  } // AI turn.

                  setTimeout(() => {
                    const tree = StrategyManager.tree(
                      playerIndex,
                      JSON.parse(JSON.stringify(players)),
                      values,
                      this.grid.current.props.width,
                      this.grid.current.props.height,
                      this.state.round,
                      this.state.heuristic,
                      this.state.miniMaxDepth
                    );
                    // StrategyManager.renderTree(tree, this.state.treeDepth);

                    // Get the AI's move.
                    ({ x, y } = this.props.strategy(
                      tree,
                      this.state.playerIndex,
                      this.state.players,
                      values,
                      this.grid.current.props.width,
                      this.grid.current.props.height
                    ));
                    console.log(`AI is moving to ${x},${y}.`);

                    // Move the AI player.
                    this.onGrid(x, y, values);
                  }, 1000);
                  console.log(456);
                }
              }
            }
          }
        );
      }
      return true;
    }
  };
  render() {
    //các nước có thể di chuyển
    const moves =
      this.props.moves !== undefined
        ? this.props.moves
        : this.state.players[this.state.playerIndex].moves.length;
    const winnerIndex = this.state.playerIndex ? 1 : 2;

    return (
      <div id="app" ref={this.container}>
        <h1 style={{ fontWeight: "bold" }}>Isolation Game</h1>
        <Grid
          width={this.state.width}
          height={this.state.height}
          grid={this.props.grid}
          cellStyle={this.props.cellStyle}
          players={this.state.players}
          onClick={this.onGrid}
          ref={this.grid}
        >
          <Player
            width="100"
            height="100"
            x={this.state.players[0].x}
            y={this.state.players[0].y}
            cellStyle={this.props.cellStyle}
            color="#C71585"
            backgroundColor="lightpink"
          ></Player>
          <Player
            width="100"
            height="100"
            x={this.state.players[1].x}
            y={this.state.players[1].y}
            cellStyle={this.props.cellStyle}
            color="#00BFFF"
            backgroundColor="lightblue"
          ></Player>
        </Grid>
        <div className="row">
          <div className="col col-auto">
            <div
              className={`badge ${
                !this.state.playerIndex ? "badge-danger" : "badge-primary"
              }`}
            >
              
              {this.state.nameWillPlay
                ? this.state.nameWillPlay
                : this.state.playerIndex === 0
                ? "You"
                : "Computer"}
              's Turn
            </div>
          </div>
          <div className="col col-auto">
            <div className="badge badge-success">{moves} Moves Available</div>
          </div>
          <div className="col col-auto">
            <div className={`badge badge-success ${!moves ? "" : "d-none"}`}>
              
              {this.state.userPlayed
                ? this.state.userPlayed
                : winnerIndex === 1
                ? "You"
                : "Computer"}{" "}
              wins!
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="badge badge-secondary">
              Turn {Math.round(this.state.round / 2)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Isolation;
