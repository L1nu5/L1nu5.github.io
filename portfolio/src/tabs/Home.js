import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';

function Home() {
  // Get data from the data service
  const homeContent = dataService.getHomeContent();

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
          <div className="p-3 border rounded" style={{ backgroundColor: '#e3f2fd' }}>
            <h4 className="text-primary">{homeContent.aboutMe.title}</h4>
            <p>
              {homeContent.aboutMe.description}
            </p>
          </div>
        </Col>
        <Col md={6}>
          <div className="p-3 border rounded" style={{ backgroundColor: '#e8f5e8' }}>
            <h4 className="text-success">{homeContent.quickNavigation.title}</h4>
            <p>
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
