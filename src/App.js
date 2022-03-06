import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumEvents from './NumEvents';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import { Container, Row, Col } from "react-bootstrap";
import { WarningAlert } from './alert';
import WelcomeScreen from './WelcomeScreen';

export class App extends Component {
  state = {
    events: [],
    locations: [],
    numberEvents: 32,
    selectedLocation: 'all',
    showWelcomeScreen: undefined
  }

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem('access_token');
    const isTokenValid = (await checkToken(accessToken)).error ? false :
      true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });
    if ((code || isTokenValid) && this.mounted) {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({ events: events.slice(0, this.state.numberEvents), locations: extractLocations(events) })
        }
      })
    }
  }





  componentWillUnmount() {
    this.mounted = false;
  }

  updateEvents = (location) => {
    getEvents().then((events) => {
      let locationEvents = location === "all"
        ? events :
        events.filter((event) => event.location === location)
      const { numberEvents } = this.state
      if (this.mounted) {
        this.setState({
          events: locationEvents.slice(0, numberEvents),
          currentLocation: location,
        })
      }
    })
  }

  updateNumberEvents = (eventCount) => {
    const { currentLocation } = this.state;
    this.setState({
      numberEvents: eventCount,
    });
    this.updateEvents(currentLocation, eventCount);
  };


  //Using bootstrap below to make this a responsive design. 
  //Using the WarningAlert below (navigator API) when the app is offline. 
  render() {
    if (this.state.showWelcomeScreen === undefined) return <div
      className="App" />
    return (
      <div className="App">
        {!navigator.onLine && <WarningAlert text={
          "The app is offline. Loading events will be unavailable until you reconnect. "} />}
        <Container fluid className="mainAppContainer">
          <Row>
            <Col className="align-items-center">
              <h1> MeetApp </h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2> Search for a city!</h2>
              <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
              <h2> How many events do you want to see? </h2>
              <NumEvents numberEvents={this.state.numberEvents} updateNumberEvents={this.updateNumberEvents} />
            </Col>
          </Row>
          <Row>
            <Col>
              <EventList events={this.state.events} />
            </Col>
          </Row>
        </Container>
        <WelcomeScreen showWelcomeScreen={this.state.showWelcomeScreen}
          getAccessToken={() => { getAccessToken() }} />
      </div>
    );
  }
}

export default App;