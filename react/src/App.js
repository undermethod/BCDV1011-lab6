//import logo from './logo.svg';
import './App.css';
import React from "react";

const HOSTNAME = "localhost";
const PORT_EXPRESS = 2999;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      storedData: 0,
      disableSet: true
    };
  }

  getStoredData = async () => {
    await fetch(`http://${HOSTNAME}:${PORT_EXPRESS}/get`)
      .then(result => result.json())
      .then(data => {
        console.log("storedData:", data);
        this.setState({
          loading: false,
          storedData: data
        });
      })
      .catch(err => console.error(err))
    ;
  }

  setStoredData = async (_value) => {
    await fetch(`http://${HOSTNAME}:${PORT_EXPRESS}/set?val=${_value}`, { method: "POST" })
      .then(result => result.json())
      .then(data => {
        console.log("tx:", data.tx);
        console.log("storedData:", data.val);
        this.setState({
          loading: false,
          storedData: data.val
        });
      })
      .catch(err => console.error(err))
    ;
  }

  handleClickGet = ev => {
    ev.preventDefault();
    this.setState({
      loading: true
    });
    this.getStoredData();
  }

  handleClickSet = ev => {
    ev.preventDefault();
    const setValueInput = document.querySelector("#setValue");
    if(!setValueInput.value) {
      console.log("Fill in value first.");
      return;
    }

    this.setState({
      loading: true,
      disableSet: true
    });
    this.setStoredData(setValueInput.value);
    setValueInput.value = "";
  }

  handleSetValueInput = ev => {
    ev.preventDefault();
    this.setState({
      disableSet: !(ev.target.value)
    });
  }

  componentDidMount = () => {
    this.getStoredData();
  }

  render = () => {
    return (
      <div className="App">
        <h2>Simple Storage</h2>
        <section className="get">
          <div>
            Stored Data:
            <input readOnly value={this.state.loading ? "Loading..." : Number(this.state.storedData).toLocaleString()}></input>
          </div>
          <div>
            <button onClick={this.handleClickGet}>Get Stored Data</button>
          </div>
        </section>
        <section className="set">
          <div>
            Update storage:
            <input id="setValue" type="number" onInput={this.handleSetValueInput}></input>
          </div>
          <div>
            <button onClick={this.handleClickSet} disabled={this.state.disableSet}>Set</button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
