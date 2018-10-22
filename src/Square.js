import React from 'react'
import { BoardStates } from './Board.js'

export let FillStates = Object.freeze({UNFILLED : '', TICK: '✔', TACK: '✗'})
export class Square extends React.Component {

    constructor(props) {
      super(props);
      this.state = { position: { x: props.x, y: props.y}, fillState: props.fillState}
      this.boxesperrow = props.boxesperrow
    }

    handleClick = () => {
      if (this.state.fillState !== FillStates.UNFILLED || this.props.status === BoardStates.DECIDED) {
        // If a square is already filled or the game has ended, do not change it
        return
      }
      let newState = {
        position: this.state.position,
        fillState: this.props.currentPlayer.symbol
      } 
      this.setState(newState)
      this.props.handleSquareMarked(newState)
    }

    componentWillReceiveProps(props) {
      this.setState({ position: { x: props.x, y: props.y}, fillState: props.fillState})
    }

    render() {
      return (
        <button className="square" onClick={() => this.handleClick()}>
            { this.state.fillState === FillStates.UNFILLED ? '' : this.state.fillState }
        </button>
      )
    }
  }