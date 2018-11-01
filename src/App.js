import React from 'react'
import {Dialog, DialogTitle, DialogContent, Select, MenuItem, InputLabel, FormControl,
        DialogContentText, DialogActions, Button} from '@material-ui/core'
import { CustomTextField } from './custom-controls/CustomTextField'        
export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      gameInformationDialogOpen: false,
      firstPlayerName: "",
      secondPlayerName: "",
      boxesPerRow: 3,
      maxBoxesPerRow: 15,
      minBoxesPerRow: 3,
      isFinalizing: false
    }
  }

  handleGameInformationDialogAccepted= () => {

    let newState = this.state
    newState.isFinalizing = true
    this.setState(newState)

    if ( this.state.firstPlayerName==="" || this.state.secondPlayerName==="" ) {
      return false
    }

    console.log("Starting game")
    newState = this.state
    newState.gameInformationDialogOpen = false
    this.setState(newState)

    this.props.history.push('/game', {
      gameInformation: this.state
    })
    
  }

  getMenuForNumberOfBoxes() {
    let menuItems = []
    for (let i=this.state.minBoxesPerRow; i<=this.state.maxBoxesPerRow; i++) {
      menuItems.push(<MenuItem key={'menuitem'+i} value={i}>{i}</MenuItem>)
    }
    return menuItems
  }

  handleStartGame = () => {
    let newState = this.state
    newState.gameInformationDialogOpen = true
    this.setState(newState)
  }

  render() {
    let inputStyling  = {
      margin: '20px 0'
    }
    return (
      <div>

        <button onClick={this.handleStartGame}>
          Start Game
        </button>
        <Dialog
          open={this.state.gameInformationDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title" >
          <DialogTitle id="form-dialog-title">Game Information</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Before starting the game we need some information
            </DialogContentText>
            <form>
                
                <CustomTextField required={true} label='First Player' {...this.state} onTextChanged={(text) => {
                     let newState = this.state
                      newState.firstPlayerName = text
                      this.setState(newState)
                    }} />
                
                <CustomTextField required={true} label='Second Player' {...this.state} onTextChanged={(text) => {
                     let newState = this.state
                      newState.secondPlayerName = text
                      this.setState(newState)
                    }} />

                <FormControl fullWidth margin='dense'>
                  <InputLabel htmlFor="bpr-select">Number of boxes per row in grid</InputLabel>
                  <Select
                    value = {this.state.boxesPerRow}
                    onChange={(event, object) => {
                      let newState = this.state
                      newState.boxesPerRow = object.props.value
                      console.log("changing box state to : ", newState)
                      this.setState(newState)
                    }}
                    fullWidth
                    placeholder="Number of boxes per row in grid"
                    style={inputStyling}
                    inputProps={{
                      name: 'bpr-select',
                      id: 'bpr-select',
                    }} >
                    {this.getMenuForNumberOfBoxes()}
                  </Select>
                </FormControl>
            </form>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleGameInformationDialogAccepted} color="primary">
              Play
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}