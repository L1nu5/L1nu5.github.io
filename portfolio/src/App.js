import React from 'react';
import { Tab, Tabs, Container, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './tabs/Home';
import Socials from './tabs/Socials';
import Education from './tabs/Education';
import Resume from './tabs/Resume';
import MusicEvents from './tabs/MusicEvents';
import dataService from './services/dataService';

function App() {
  // Get data from the data service
  const personalInfo = dataService.getPersonalInfo();
  const theme = dataService.getTheme();
  const navigation = dataService.getNavigation();
  const footerContent = dataService.getFooterContent();

  return (
    <div style={{ backgroundColor: theme.backgroundColor, minHeight: '100vh' }}>
      <Container fluid className="py-4">
        {/* Header Section */}
        <Card className="mb-4 border-0 shadow-sm" style={{ 
          background: `linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
          color: 'white'
        }}>
          <Card.Body className="text-center py-5">
            <h1 className="display-3 mb-2">{personalInfo.name}</h1>
            <p className="lead mb-0">{personalInfo.tagline}</p>
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
                '--bs-nav-tabs-link-active-bg': theme.lightBlue,
                '--bs-nav-tabs-link-active-border-color': theme.primaryColor,
                '--bs-nav-tabs-link-active-color': theme.primaryColor
              }}
            >
              {navigation.tabs.map((tab) => (
                <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
                  <div className="p-4">
                    {tab.key === 'home' && <Home />}
                    {tab.key === 'socials' && <Socials />}
                    {tab.key === 'education' && <Education />}
                    {tab.key === 'resume' && <Resume />}
                    {tab.key === 'musicEvents' && <MusicEvents />}
                  </div>
                </Tab>
              ))}
            </Tabs>
          </Card.Body>
        </Card>

        {/* Footer */}
        <Card className="mt-4 border-0" style={{ 
          backgroundColor: theme.lightGreen,
          borderTop: `3px solid ${theme.secondaryColor}`
        }}>
          <Card.Body className="text-center py-3">
            <small className="text-muted">
              {footerContent.copyright} | {footerContent.builtWith} | 
              <span className="text-success"> {footerContent.designNote}</span>
            </small>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default App;
