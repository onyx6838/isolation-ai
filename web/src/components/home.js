import React, { Component } from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import IsolationContainer from './isolationContainer'
import StrategyManager from '../managers/strategyManager';
import '../css/style.css';
import store from './store.js';
const socket = store.getState().socket;
global.jQuery = require('jquery');
require('bootstrap');


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 5,
            height: 5,
            roomCode:0,
            userName: '',
            index: 1,
            show:false,
            setdisabled:'',
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
      //  const code = document.querySelector('input[name = "roomCode"]').value;
        
        if(userName === "") {
            alert("Bạn phải nhập tên");
        }
       else {
            var roomCode = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
            document.querySelector('.div-randomCode').innerHTML = "Mã phòng: " + roomCode;
            socket.emit('createRoom',{roomCode:roomCode, userName:userName});
            socket.on('Created',(id) =>{
                alert("Hi " + userName+" Bạn đã tạo phòng thành công. Hãy gửi mã phòng cho một người bạn bạn muốn chơi cùng!")
                //this.setState({showLink:false});
                this.setState({setdisabled:'disabled', index: 0});
                //document.getElementById('link-joinRoom').classList.add('disabled');
                document.querySelector('.div-getRoomCode').hidden = true;
            })
            this.setState({roomCode: roomCode});
        }
    }
    joinRoom = (e) => {
        if(this.state.strategy === StrategyManager.minimax) {
            this.setState({showHome:false});
        }
        else{
            console.log(this.state.roomCode+"1111");
            socket.emit('joinRoom',{roomCode:this.state.roomCode, userName:this.state.userName});
            socket.on('joinRoomClient',(id,userName) => {
                    this.setState({showHome:false});
                    console.log("index: " + this.state.index);
            })
        }
    }
   
    componentDidUpdate  () {
        socket.on('initGame',(name)=>{
            this.setState({setdisabled:''});
           // document.getElementById("link-joinRoom").removeClass('disabled');
            console.log("codeRoom: "+ this.state.roomCode);
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
                        <div>
                            <label>Chọn bảng chơi: </label>
                            <input type="number" min = "3" max = "5" onChange={e=>this.setState({width: e.target.value})} className="m-2"/>
                            <input type="number" min = "3" max = "5" onChange={e=>this.setState({height: e.target.value})} className="m-2"/>
                        </div>
                        {this.state.show &&  <div>
                            <div className="input-group sm">
                                <label className="form-check-label w-25">Tên người chơi:</label>
                                <input type="text" name="userName" placeholder = "Tên người chơi" className = "form-control mb-2" onChange={e =>this.setState({userName: e.target.value})}/>
                                <button className = "btn btn-danger" onClick={this.createRoom} >Tạo phòng</button>
                            </div>
                            <div className="input-group sm">
                                <div className = "div-randomCode"></div>
                            </div>
                            <div className="input-group sm div-getRoomCode">
                                <label className="form-check-label w-25">Mã phòng:</label>
                                <input type="text" name="roomCode" placeholder = "Room Code" className = "form-control"  onChange={e =>this.setState({roomCode: e.target.value})}/>
                            </div>
                        </div>
                        }
                 <Link to="/game" className = {`btn btn-danger mt-2 ${this.state.setdisabled}`} id="link-joinRoom" onClick={this.joinRoom} >Vào chơi</Link>
              
                </div>
        }
             <Switch>
                <Route path="/game">
                    <IsolationContainer width={this.state.width} height={this.state.height} strategy={this.state.strategy} userName={this.state.userName} roomCode = {this.state.roomCode} index={this.state.index}></IsolationContainer>
                </Route>
            </Switch>
        </div>
              
        )
    }
}

    

export default Home
