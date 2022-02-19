import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumEvents from './NumEvents';
import { getEvents, extractLocations } from './api';
import './nprogress.css'


export class App extends Component {
  state = {
    events: [],
    locations: [],
    numberEvents: 32,
    selectedLocation: 'all'
  }

  componentDidMount() { //Loading events when app loads. Using API call to save initial data to state. 
    this.mounted = true; //Updating state only if this.mounted is true. 
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ events, locations: extractLocations(events) })
      }
    })
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location, numberEvents) => {
    getEvents().then((events) => {
      let locationEvents = (location === "all") ?
        events :
        events.filter((event) => event.location === location)
      this.setState({
        events: locationEvents.slice(0, this.state.numberEvents)
      })
    })
  }

  setNewNumber = (e) => {
    const newNumber = parseInt(e.target.value);
    this.setState({
      numberEvents: newNumber
    })
    this.updateEvents(this.state.selectedLocation, this.state.numEvents)
  }

  render() {

    return (
      <div className="App">
        <EventList events={this.state.events} />
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <NumEvents numberEvents={this.state.numberEvents} setNewNumber={this.setNewNumber} />
      </div>
    );
  }
}

export default App;