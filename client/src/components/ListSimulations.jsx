import React, { Component } from 'react'
import { List } from 'semantic-ui-react'
import api from '../api'

class ListSimulations extends Component {
  constructor(props) {
    super(props)
    this.state= {
      simulations: [],
      columns: [],
      isLoading: false,
    }
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true })

    await api.getAllSimulations().then(simulations => {
      console.log({simulations})
      this.setState({
        simulations: simulations.data.data,
        isLoading: false
      })
    })
  }

  render() {
    const { simulations, isLoading } = this.state
    let showSimulations = true
    if (!simulations.length) {
      showSimulations = false
    }
    console.log(`here are the simulations => ${simulations}`)
    return (
      <List divided relaxed>
        {simulations.map(board => (
          <List.Item>
            <List.Icon name='play' size='small' verticalAlign='middle' />
            <List.Content>
              <List.Header as='a'>{ board._id }</List.Header>
              {/* <List.Description>{ board.createdAt }</List.Description> */}
            </List.Content>
          </List.Item>
        ))}
      </List>
    )
  }
}

export default ListSimulations