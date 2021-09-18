import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'
import api from '../api'

class CreateBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      length: '',
      width: ''
    }
  }
  // state = { length: '', width: ''}
  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = async () => {
    const { length, width } = this.state
    const payload = { length, width }

    console.log(`the height is ${length} and the width is ${width}`)

    await api.startSimulation(payload).then(res => {
      console.log('this simulation was stored')
      this.setState({ length: '', width: '' })
      console.log({res})
    })
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
      // <Card>
      //   <Image src='/images/avatar/large/matthew.png' wrapped ui={false} />
      //   <Card.Content>
      //     <Card.Header>Matthew</Card.Header>
      //     <Card.Meta>
      //       <span className='date'>Joined in 2015</span>
      //     </Card.Meta>
      //     <Card.Description>
      //       Matthew is a musician living in Nashville.
      //     </Card.Description>
      //   </Card.Content>
      //   <Card.Content extra>
      //     <a>
      //       <Icon name='user' />
      //       22 Friends
      //     </a>
      //   </Card.Content>
      // </Card>
    )
  }
}

export default CreateBoard