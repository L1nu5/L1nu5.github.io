import React from 'react';
import { Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';

function Socials() {
  // Get data from the data service
  const socialLinks = dataService.getSocialLinks();
  const contactInfo = dataService.getContactInfo();
  const socialStats = dataService.getSocialStats();
  const featuredContent = dataService.getFeaturedContent();
  const description = dataService.getSocialsDescription();

  return (
    <PageTemplate 
      title="Social Media & Contact" 
      headerContent="Connect with me across various platforms"
      footerContent="Let's build something amazing together"
    >
      <Row className="mb-4">
        <Col>
          <Card style={{ backgroundColor: '#e3f2fd', border: '1px solid #007bff' }}>
            <Card.Body>
              <Card.Title className="text-primary">Let's Connect!</Card.Title>
              <Card.Text>
                {description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header style={{ backgroundColor: '#e8f5e8', border: 'none' }}>
              <h4 className="text-success mb-0">Social Media Platforms</h4>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {socialLinks.map((social) => (
                  <Col md={6} key={social.id}>
                    <Card className="h-100 border-0" style={{ backgroundColor: '#f8f9fa' }}>
                      <Card.Body className="text-center">
                        <div className="mb-3" style={{ fontSize: '2rem' }}>
                          {social.icon}
                        </div>
                        <Card.Title className="h5">{social.platform}</Card.Title>
                        <Card.Text className="text-muted small">
                          {social.description}
                        </Card.Text>
                        <div className="mb-2">
                          <Badge bg="outline-secondary" className="me-2">
                            {social.username}
                          </Badge>
                          <Badge bg="outline-info">
                            {social.followers}
                          </Badge>
                        </div>
                        <Button 
                          variant={social.variant} 
                          size="sm" 
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-100"
                        >
                          Visit {social.platform}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="h-100">
            <Card.Header style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
              <h4 className="text-primary mb-0">Contact Information</h4>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span><strong>Email:</strong></span>
                  <span className="text-end">{contactInfo.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span><strong>Location:</strong></span>
                  <span className="text-end">{contactInfo.location}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between">
                  <span><strong>Timezone:</strong></span>
                  <span className="text-end">{contactInfo.timezone}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Available for:</strong>
                  <div className="mt-1">
                    <Badge bg="success" className="me-1 mb-1">Networking</Badge>
                    <Badge bg="info" className="me-1 mb-1">Collaborations</Badge>
                    <Badge bg="warning" className="me-1 mb-1">Opportunities</Badge>
                    <Badge bg="secondary" className="me-1 mb-1">Gaming Discussions</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Preferred Contact:</strong>
                  <div className="mt-1 text-muted">{contactInfo.preferredContact}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <strong>Response Time:</strong>
                  <div className="mt-1 text-muted">{contactInfo.responseTime}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #28a745' }}>
            <Card.Header style={{ backgroundColor: '#e8f5e8', border: 'none' }}>
              <h4 className="text-success mb-0">Social Media Stats</h4>
            </Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col>
                  <div className="mb-2">
                    <h3 className="text-primary mb-0">{socialStats.totalFollowers}</h3>
                    <small className="text-muted">Total Followers</small>
                  </div>
                </Col>
                <Col>
                  <div className="mb-2">
                    <h3 className="text-success mb-0">{socialStats.platformsActive}</h3>
                    <small className="text-muted">Active Platforms</small>
                  </div>
                </Col>
              </Row>
              <Row className="text-center">
                <Col>
                  <div className="mb-2">
                    <h3 className="text-info mb-0">{socialStats.contentCreated}</h3>
                    <small className="text-muted">Content Created</small>
                  </div>
                </Col>
                <Col>
                  <div className="mb-2">
                    <h3 className="text-warning mb-0">{socialStats.engagementRate}</h3>
                    <small className="text-muted">Engagement Rate</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #007bff' }}>
            <Card.Header style={{ backgroundColor: '#e3f2fd', border: 'none' }}>
              <h4 className="text-primary mb-0">Featured Content</h4>
            </Card.Header>
            <Card.Body>
              {featuredContent.map((content, index) => (
                <div key={content.id} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0">{content.title}</h6>
                    <Badge bg="outline-secondary">{content.platform}</Badge>
                  </div>
                  <small className="text-muted d-block mb-1">
                    {content.type} • {new Date(content.date).toLocaleDateString()}
                  </small>
                  <small className="text-success d-block">
                    {content.engagement}
                  </small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default Socials;
