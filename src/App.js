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

  updateEvents = (location, eventCount = this.state.eventCount) => {
    getEvents().then((events) => {
      let locationEvents = (location === "all" ? events : events.filter((event) => event.location === location));
      locationEvents = locationEvents.slice(0, eventCount)
      this.setState({
        events: locationEvents,
        numberOfEvents: eventCount,
        selectedLocation: location
      });
    });
  }
  /*updateEvents = (location) => {
    getEvents().then((events) => {
      const locationEvents = location === 'all'//(location === 'all')
        ? events
        : events.filter((event) =>
          event.location === location);
      const { numberEvents } = this.state;
      if (this.mounted) {
        this.setState({
          events: locationEvents.slice(0, numberEvents),
          selectedLocation: location,
        })
      }
    })
  }*/

  /*updateNumOfEvents = (eventCount) => {
    const { selectedLocation } = this.state;
    this.setState({
      numberEvents: eventCount,
    });
    this.updateEvents(selectedLocation, eventCount);
  };*/

  ////numberEvents={this.state.numberEvents} --- EventList
  //Need to update state in NumEvents. 
  render() {

    return (
      <div className="App">
        <EventList events={this.state.events} />
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <NumEvents selectedLocation={this.state.selectedLocation} updateEvents={this.updateEvents} />
      </div>
    );
  }
}

export default App;