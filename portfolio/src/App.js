import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './src/tabs/Home';
import Socials from './src/tabs/Socials';
import Education from './src/tabs/Education';
import Resume from './src/tabs/Resume';
import MusicEvents from './src/tabs/MusicEvents';

function App() {
  return (
    <div className="container">
      <h1>My Portfolio</h1>
      <Tabs defaultActiveKey="home" id="portfolio-tabs">
        <Tab eventKey="home" title="Home">
          <Home />
        </Tab>
        <Tab eventKey="socials" title="Socials">
          <Socials />
        </Tab>
        <Tab eventKey="education" title="Education">
          <Education />
        </Tab>
        <Tab eventKey="resume" title="Resume">
          <Resume />
        </Tab>
        <Tab eventKey="musicEvents" title="Music Events">
          <MusicEvents />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;