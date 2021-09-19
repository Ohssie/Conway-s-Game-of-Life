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
    } catch (e) {
      console.log(e.message)
    }
    
  }, []);
  return (
    <div>
      <Grid centered style={{ margin: 10 }}>
        {gridData == null && <Grid.Column width={4}>
          <Segment>
            <Container>
              <CreateBoard setGridData={setGridData} />
            </Container>
          </Segment>
        </Grid.Column>
        }
        {gridData != null &&
          <Grid.Column width={16} centered='true'>
            {/* <Segment> */}
              <Container>
                <DataGrid data={gridData} setGridData={setGridData} />
              </Container>
            {/* </Segment> */}
          </Grid.Column>
        }
      </Grid>
    </div>
  );
}

export default App;
