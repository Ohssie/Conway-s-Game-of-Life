import { Container, Grid, Segment } from 'semantic-ui-react'
import CreateBoard from './components/CreateBoard'
import DataGrid from './components/DataGrid'
import { useState, useEffect } from 'react';

function App() {
  const [gridData, setGridData] = useState(null)
  useEffect(() => {
    try {
      const loc = localStorage.getItem('grid')
      if (loc != null) setGridData(JSON.parse(loc));
      console.log({loc})
    } catch (e) {
      console.log(e.message)
    }
    
  });
  console.log({gridData})
  return (
    <div>
      <Grid centered columns={2} relaxed='very' style={{ margin: 10 }}>
        {gridData == null && <Grid.Column width={4}>
          <Segment>
            <Container>
              <CreateBoard setGridData={setGridData} />
            </Container>
          </Segment>
        </Grid.Column>
        }
        {/* <Divider vertical/> */}
        {gridData != null &&
          <Grid.Column width={16}>
            <Container>
              <DataGrid data={gridData} setGridData={setGridData} />
            </Container>
          </Grid.Column>
        }
      </Grid>
    </div>
  );
}

export default App;
