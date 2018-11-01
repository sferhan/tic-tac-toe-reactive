import React from 'react'
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core'

export class CustomTextField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: this.props.text === undefined ? "" : this.props.text,
            isTextChangedOnce: false
        }
    }

    render() {
        let shouldShowError = ((this.props.required === undefined || this.props.required===true)
                                && this.state.text==="" && (this.state.isTextChangedOnce || this.props.isFinalizing))
      return (
        <FormControl error={shouldShowError} aria-describedby="component-error-text" fullWidth>
                  <InputLabel htmlFor="component-error">{this.props.label}</InputLabel>
                  <Input id="component-error" onChange = {(event) => {
                      let newState = this.state
                      newState.text = event.target.value
                      newState.isTextChangedOnce=true
                      this.setState(newState)
                      this.props.onTextChanged(this.state.text)
                    }} />
                  <FormHelperText id="component-error-text">{shouldShowError ? "This field is required" : ""}</FormHelperText>
        </FormControl>
      )
    }
}