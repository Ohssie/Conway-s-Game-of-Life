import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'

class CreateBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      length: '',
      width: ''
    }
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = async () => {
    const { length, width } = this.state

    let grid = []
    
    for (let i = 0; i < length; i++) {
      let row = [];
      for (var j = 0; j < width; j++) {
        row.push(Math.round(Math.random()));
      }
      grid[i] = row;
    }
    this.props.setGridData(grid);
  }
  render() {
    const { length, width } = this.state
    
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Length</label>
            <Form.Input 
              fluid
              placeholder='100'
              name='length'
              value={length}
              onChange={this.handleChange}
            />
          </Form.Field>
          
          <Form.Field>
            <label>Width</label>
            <Form.Input 
              fluid
              placeholder='100'
              name='width'
              value={width}
              onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>        
        
        <Button fluid type='submit'>Go!</Button>
      </Form>
    )
  }
}

export default CreateBoard