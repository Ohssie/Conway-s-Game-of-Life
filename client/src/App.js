import { Container, Grid, GridColumn, Segment, Divider } from 'semantic-ui-react'
import CreateBoard from './components/CreateBoard'
import ListSimulations from './components/ListSimulations'
import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <div>
      <Grid centered columns={2} relaxed='very' style={{ margin: 10 }}>
        <Grid.Column width={4}>
          <Segment>
            <Container>
              <CreateBoard />
            </Container>
          </Segment>
          <Segment>
            <Container>
              <ListSimulations />
            </Container>
          </Segment>
        </Grid.Column>
        {/* <Divider vertical/> */}
        <Grid.Column width={12}>
          <Container>
            gfhiuegrht2
          </Container>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
