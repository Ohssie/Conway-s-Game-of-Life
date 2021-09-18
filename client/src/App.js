import { Container, Grid, GridColumn, Segment, Divider } from 'semantic-ui-react'
import CreateBoard from './components/CreateBoard'
import ListSimulations from './components/ListSimulations'
import DataGrid from './components/DataGrid'
import logo from './logo.svg';
import { useState } from 'react';
// import './App.css';

function App() {
  const [gridData, setGridData] = useState([])
  return (
    <div>
      <Grid centered columns={2} relaxed='very' style={{ margin: 10 }}>
        <Grid.Column width={4}>
          <Segment>
            <Container>
              <CreateBoard setGridData={setGridData} />
            </Container>
          </Segment>
          <Segment>
            <Container>
              <ListSimulations setGridData={setGridData} />
            </Container>
          </Segment>
        </Grid.Column>
        {/* <Divider vertical/> */}
        <Grid.Column width={12}>
          <Container>
            <DataGrid data={gridData}/>
          </Container>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default App;
