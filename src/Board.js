import React from 'react'
import {Square, FillStates} from './Square'

export let BoardStates = Object.freeze({UNDECIDED : 0, DEADEND: 1, DECIDED: 2, INITIALIZED: 3})

let Directions = Object.freeze({RIGHT: 0, BOTTOM: 1, DIAGONAL_DOWN: 2, DIAGONAL_UP: 3})

export class Board extends React.Component {

    constructor(props) {
        super(props)
        let boxValues = new Array(props.boxesPerRow)
        for (let row = 0; row < props.boxesPerRow; row++) {
            boxValues[row] = new Array(props.boxesPerRow).fill(FillStates.UNFILLED)
        }
        this.state = {
            boxesPerRow: props.boxesPerRow,
            boxValues: boxValues,
            status: props.status,
            maxDepth: props.boxesPerRow
        }
    }

    // On the basis of change in state of a square at some position this function checks whether
    // this change can decide the board state by matching the state of this square with squares
    // around it with a max depth of 3
    decideBoardStatus = () => {
        
        let boardState = BoardStates.DEADEND
        for (let row = 0; row<this.props.boxesPerRow; row++) {
            for (let column = 0; column<this.props.boxesPerRow; column++) {
                if ( this.state.boxValues[row][column] === FillStates.UNFILLED ) {
                    boardState = BoardStates.UNDECIDED
                    break
                }
            }
            if (boardState === BoardStates.UNDECIDED) break
        }
        if (boardState === BoardStates.DEADEND) return BoardStates.DEADEND

        for (let row = 0; row<this.props.boxesPerRow; row++) {
            for (let column = 0; column<this.props.boxesPerRow; column++) {

                if(
                this.matchSquaresFillStateTillDepthInDirection({
                    x: column,
                    y: row
                }, this.props.currentPlayer.symbol, 1, this.state.maxDepth, Directions.BOTTOM) ||
                this.matchSquaresFillStateTillDepthInDirection({
                    x: column,
                    y: row
                }, this.props.currentPlayer.symbol, 1, this.state.maxDepth, Directions.RIGHT) ||
                this.matchSquaresFillStateTillDepthInDirection({
                    x: column,
                    y: row
                }, this.props.currentPlayer.symbol, 1, this.state.maxDepth, Directions.DIAGONAL_DOWN) ||
                this.matchSquaresFillStateTillDepthInDirection({
                    x: column,
                    y: row
                }, this.props.currentPlayer.symbol, 1, this.state.maxDepth, Directions.DIAGONAL_UP)) {
                    return BoardStates.DECIDED
                }
            }
        }
        return boardState
    }

    matchSquaresFillStateTillDepthInDirection = (position, fillState, currentDepth, maxDepth, matchDirection) => {
        if (this.state.boxValues[position.y][position.x] !== fillState) {
            return false
        }
        else {
            if (currentDepth === maxDepth) {
                return true
            }
            else {
                switch (matchDirection) {
                    case Directions.RIGHT:
                        if (position.x+1 >= this.state.boxesPerRow) {
                            return false
                        }
                        else {
                            return this.matchSquaresFillStateTillDepthInDirection({
                                x: position.x+1,
                                y: position.y
                            }, fillState, ++currentDepth, maxDepth, matchDirection)
                        }
                    case Directions.BOTTOM:
                        if (position.y+1 >= this.state.boxesPerRow) {
                            return false
                        }
                        else {
                            return this.matchSquaresFillStateTillDepthInDirection({
                                x: position.x,
                                y: position.y+1
                            }, fillState, ++currentDepth, maxDepth, matchDirection)
                        }
                    case Directions.DIAGONAL_DOWN:
                        if (position.y+1 >= this.state.boxesPerRow || position.x+1 >= this.state.boxesPerRow) {
                            return false
                        }
                        else {
                            return this.matchSquaresFillStateTillDepthInDirection({
                                x: position.x+1,
                                y: position.y+1
                            }, fillState, ++currentDepth, maxDepth, matchDirection)
                        }
                    case Directions.DIAGONAL_UP:
                    if (position.y-1 >= this.state.boxesPerRow || position.y-1 < 0 || position.x+1 >= this.state.boxesPerRow) {
                        return false
                    }
                    else {
                        return this.matchSquaresFillStateTillDepthInDirection({
                            x: position.x+1,
                            y: position.y-1
                        }, fillState, ++currentDepth, maxDepth, matchDirection)
                    }
                    default:
                        return false;
                }
            }
        }
    }

    createSquareGrid(boxesPerRow) {
        let grid = []
        for (let row = 0; row<boxesPerRow; row++) {
            let rowSubGrid = []
            for(let column = 0; column<boxesPerRow; column++) {
                rowSubGrid.push(<Square handleSquareMarked={this.handleSquareMarked} {...this.props} key={row.toString()+column.toString()} boxesperrow={boxesPerRow} x={column} y={row} fillState={this.state.boxValues[row][column]}> </Square>)
            }
            grid.push(<div key={row} className="board-row"> {rowSubGrid} </div>)
        }
        return grid
    }

    handleSquareMarked = (targetSquareState) => {
        if ( this.state.status === BoardStates.DECIDED ) {
            return
        }
        let newState = this.state
        newState.boxValues[targetSquareState.position.y][targetSquareState.position.x] = targetSquareState.fillState
        this.setState(newState)
        let boardState = this.decideBoardStatus();
        if (this.state.status !== boardState) {
            this.props.handleBoardStateChange(boardState)
        }
        if ( boardState !== BoardStates.DECIDED ) {
            this.props.handlePlayerTookTurn()
        }
    }

    componentWillReceiveProps(props) {
        if ( props.status === BoardStates.INITIALIZED ) {
            let boxValues = new Array(props.boxesPerRow)
            for (let row = 0; row < props.boxesPerRow; row++) {
                boxValues[row] = new Array(props.boxesPerRow).fill(FillStates.UNFILLED)
            }
            let newState = {
                boxesPerRow: props.boxesPerRow,
                boxValues: boxValues,
                status: props.status
            }
            this.setState(newState)
        }
    }

    render() {
        return(
            <div>
                { this.createSquareGrid(this.state.boxesPerRow) }
            </div>
        )
    }

}