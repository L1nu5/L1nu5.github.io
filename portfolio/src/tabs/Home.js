import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function Home() {
  // Get data from the data service
  const homeContent = dataService.getHomeContent();
  const { theme } = useTheme();

  return (
    <PageTemplate 
      title={homeContent.welcomeTitle} 
      headerContent={homeContent.welcomeSubtitle}
    >
      <Row>
        <Col>
          <Alert variant="info" className="mb-4">
            <Alert.Heading>Hello there!</Alert.Heading>
            <p>
              {homeContent.introText}
            </p>
          </Alert>
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col md={6}>
          <div className="p-3 border rounded" style={{ 
            backgroundColor: theme.lightBlue,
            borderColor: theme.borderColor,
            color: theme.textColor
          }}>
            <h4 style={{ color: theme.primaryColor }}>{homeContent.aboutMe.title}</h4>
            <p style={{ color: theme.textColor }}>
              {homeContent.aboutMe.description}
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 border rounded" style={{ 
            backgroundColor: theme.lightGreen,
            borderColor: theme.borderColor,
            color: theme.textColor
          }}>
            <h4 style={{ color: theme.secondaryColor }}>{homeContent.quickNavigation.title}</h4>
            <p style={{ color: theme.textColor }}>
              {homeContent.quickNavigation.description}
            </p>
          </div>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col className="text-center">
          <Button variant="outline-primary" size="lg" className="me-3">
            {homeContent.callToAction.resumeButton}
          </Button>
          <Button variant="outline-success" size="lg">
            {homeContent.callToAction.connectButton}
          </Button>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default Home;
