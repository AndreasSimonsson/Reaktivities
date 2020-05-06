import React, {Component} from 'react';
import { Header, Icon, List } from 'semantic-ui-react'
import './App.css';
import Axios from 'axios';

class  App extends Component {

  state = {
    values: []
  }

  componentDidMount() {
    // this.setState({
    //   values: [{id:1, name:"Value 101"}, {id:2, name:"Value 202"}]
    // })

    Axios.get("http://localhost:5000/api/values").then(result => {
      this.setState({values: result.data })
    }) 
    
  }

  render()
  {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
        {
          this.state.values.map((value:any) => 
            (<List.Item key={value.id}>{value.name}</List.Item>)
            )
        }
        </List>
      </div>
    );
  }
}

export default App;
