import React, { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import IsolationContainer from './isolationContainer'
import StrategyManager from '../managers/strategyManager';
import '../css/style.css';
import io from "socket.io-client";
const socket = io('localhost:3000');
global.jQuery = require('jquery');
require('bootstrap');

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode:0,
            userName: '',
            show:false,
            showLink: true,
            showHome:  window.location.href === "http://localhost:3001/game" ? false : true,
            strategy: props.strategy || StrategyManager.minimax,
        };
       
    }
    onStrategy = (e) => {
        this.setState({ strategy: StrategyManager[e.currentTarget.value]});
        if(e.currentTarget.value === "none") {
            this.setState({ show: true});
        }else {
            this.setState({ show: false });
        }
    }
    
    createRoom=(e) => {
        const userName = document.querySelector('input[name = "userName"]').value;
        const code = document.querySelector('input[name = "roomCode"]').value;
        
        if(userName === "") {
            alert("Bạn phải nhập tên");
        }
        else if(code === "") {
            alert("Bạn phải nhập mã phòng")
        }else {
            socket.emit('createRoom',{roomCode:code, userName:userName});
            socket.on('successCreated',(userName) =>{
                console.log(userName);
                alert("Hi " + userName+" Bạn đã tạo phòng thành công. Hãy gửi mã phòng cho một người bạn bạn muốn chơi cùng!")
                this.setState({showLink:false});
            })
        }
    }
    joinRoom = (e) => {
        if(this.state.strategy === StrategyManager.minimax) {
            this.setState({showLink:false});
        }
        else{
            const code = document.querySelector('input[name = "roomCode"]').value;
            const userName = document.querySelector('input[name = "userName"]').value;
            socket.emit('joinRoom',{roomCode:code, userName:userName});
            socket.on('connectToRoom',(id,userName) => {
                console.log(id+"/" + userName);
            })
        
            this.setState({showHome:false});
        }
       
        
    }
    componentDidUpdate  () {
        socket.on('initGame',(name)=>{
            this.setState({showLink:true});
            //console.log("codeRoom: "+ this.state.roomCode);
        })
    }
    render() {
            return ( 
            <div className="container">
                {this.state.showHome && 
                <div className="col-6">
                    <h3 className="text-uppercase">CHỌN CHẾ ĐỘ CHƠI</h3>
                        <div>
                            <input type="radio" name="strategy" value="minimax" checked={this.state.strategy === StrategyManager.minimax} onChange={this.onStrategy} id="computer" /> <label htmlFor="computer" className="form-check-label mr-4">Computer</label>
                            <input type="radio" name="strategy" value="none" checked={!this.state.strategy || this.state.strategy === StrategyManager.none} onChange={this.onStrategy} id="players" /> <label htmlFor = "players" className="form-check-label">2 Players</label>
                        </div>
                        {this.state.show &&  <div>
                            <div className="input-group sm">
                                <label className="form-check-label w-25">Tên người chơi:</label>
                                <input type="text" name="userName" placeholder = "Tên người chơi" className = "form-control mb-2" onChange={e =>this.setState({userName: e.target.value})}/>
                            </div>
                            <div className="input-group sm">
                                <label className="form-check-label w-25">Mã phòng:</label>
                                <input type="text" name="roomCode" placeholder = "Room Code" className = "form-control"  onChange={e =>this.setState({roomCode: e.target.value})}/>
                                <button to="/game" className = "btn btn-danger" onClick={this.createRoom} >Tạo phòng</button>
                            </div>
                        </div>
                        }
                    {this.state.showLink &&   <Link to="/game" className = "btn btn-danger mt-2" onClick={this.joinRoom}>Vào chơi</Link>}
              
                </div>
        }
             <Switch>
                <Route path="/game">
                    <IsolationContainer width="5" height="5" strategy={this.state.strategy} userName={this.state.userName} roomCode = {this.state.roomCode}></IsolationContainer>
                </Route>
            </Switch>
        </div>
              
        )
}
}
    

export default Home
