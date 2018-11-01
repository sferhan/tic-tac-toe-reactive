import React from 'react';
import './App.css';
import {Board, BoardStates} from './Board'
import {FillStates} from './Square'

class Game extends React.Component {

  constructor(props) {
    super(props)
    console.log("current location : ", this.props.location.state.gameInformation)
    let gameInformation = this.props.location.state.gameInformation
    let players = { 
      firstPlayer: {
        name: gameInformation.firstPlayerName,
        symbol: FillStates.TICK,
        winCount: 0
      },
      secondPlayer: {
        name: gameInformation.secondPlayerName,
        symbol: FillStates.TACK,
        winCount: 0
      }
    }
    this.state = {
      players: players,
      currentPlayer: ((Math.random()*100)%2<1 ? players.firstPlayer: players.secondPlayer),
      status: BoardStates.INITIALIZED,
      boxesPerRow: gameInformation.boxesPerRow
    }
  }
  
  handlePlayerTookTurn = () => {
    let otherPlayer = this.state.players.firstPlayer.name===this.state.currentPlayer.name ? this.state.players.secondPlayer : this.state.players.firstPlayer
    this.setState({
      players: this.state.players,
      currentPlayer: otherPlayer,
      status: this.state.status
    })
  }

  handleBoardStateChange = (newBoardState) => {
    let newState = this.state
    newState.status = newBoardState
    if ( newBoardState === BoardStates.DECIDED ) {
      if ( this.state.currentPlayer.symbol === this.state.players.firstPlayer.symbol ) {
        newState.players.firstPlayer.winCount+=1
      }
      else {
        newState.players.secondPlayer.winCount+=1
      }
    }
    this.setState(newState)
  }

  handleRestartGame = () => {
    let newState = this.state
    newState.status = BoardStates.INITIALIZED
    this.setState(newState)
  }

  render() {
    return (
      <div className="game">
        <div className="players-information">
          <p>
            <b>{ this.state.players.firstPlayer.name }</b>({this.state.players.firstPlayer.symbol}) is playing with  <b>{ this.state.players.secondPlayer.name }</b> ({this.state.players.secondPlayer.symbol}) 
          </p>  
        </div>
        <div className="turn-information">
          <p>  Current turn :  <b>{ this.state.currentPlayer.name }</b>({this.state.currentPlayer.symbol}) </p>  
        </div>
        <div className="game-board">
          <Board boxesPerRow={7} handleBoardStateChange={this.handleBoardStateChange} handlePlayerTookTurn={this.handlePlayerTookTurn}  {...this.state}></Board>
        </div>
        <div className="game-info">
          <div className="gamestatus-info">
            { this.state.status === BoardStates.INITIALIZED ? (<p> Game has started </p>) :
             (this.state.status === BoardStates.UNDECIDED ? (<p> Game is on </p>): (<p> Player <b>{ this.state.currentPlayer.name }</b> has won </p>))}
          </div>
          <div className="wincount-info">
            <p> { this.state.players.firstPlayer.name } : <b> {this.state.players.firstPlayer.winCount} </b> </p>
            <p> { this.state.players.secondPlayer.name } : <b> {this.state.players.secondPlayer.winCount} </b> </p>
          </div>
        </div>
        <div className="game-actions">
          <button onClick={this.handleRestartGame}>Restart Game</button>
        </div>
      </div>
    )
  }
}

export default Game;
