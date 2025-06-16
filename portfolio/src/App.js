import React from 'react';
import { Tab, Tabs, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './tabs/Home';
import Socials from './tabs/Socials';
import Education from './tabs/Education';
import Resume from './tabs/Resume';
import MusicEvents from './tabs/MusicEvents';

function App() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container fluid className="py-4">
        {/* Header Section */}
        <Card className="mb-4 border-0 shadow-sm" style={{ 
          background: 'linear-gradient(135deg, #007bff 0%, #28a745 100%)',
          color: 'white'
        }}>
          <Card.Body className="text-center py-5">
            <h1 className="display-3 mb-2">My Portfolio</h1>
            <p className="lead mb-0">Welcome to my professional showcase</p>
          </Card.Body>
        </Card>

        {/* Navigation Tabs */}
        <Card className="shadow-sm border-0">
          <Card.Body className="p-0">
            <Tabs 
              defaultActiveKey="home" 
              id="portfolio-tabs"
              className="border-0"
              style={{ 
                '--bs-nav-tabs-border-color': 'transparent',
                '--bs-nav-tabs-link-active-bg': '#e3f2fd',
                '--bs-nav-tabs-link-active-border-color': '#007bff',
                '--bs-nav-tabs-link-active-color': '#007bff'
              }}
            >
              <Tab eventKey="home" title="🏠 Home">
                <div className="p-4">
                  <Home />
                </div>
              </Tab>
              <Tab eventKey="socials" title="🌐 Socials">
                <div className="p-4">
                  <Socials />
                </div>
              </Tab>
              <Tab eventKey="education" title="🎓 Education">
                <div className="p-4">
                  <Education />
                </div>
              </Tab>
              <Tab eventKey="resume" title="📄 Resume">
                <div className="p-4">
                  <Resume />
                </div>
              </Tab>
              <Tab eventKey="musicEvents" title="🎵 Music Events">
                <div className="p-4">
                  <MusicEvents />
                </div>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>

        {/* Footer */}
        <Card className="mt-4 border-0" style={{ 
          backgroundColor: '#e8f5e8',
          borderTop: '3px solid #28a745'
        }}>
          <Card.Body className="text-center py-3">
            <small className="text-muted">
              © 2025 My Portfolio | Built with React & Bootstrap | 
              <span className="text-success"> Designed with passion</span>
            </small>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
