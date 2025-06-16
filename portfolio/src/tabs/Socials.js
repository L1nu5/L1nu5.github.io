import React from 'react';
import { Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';

function Socials() {
  const socialLinks = [
    {
      platform: 'LinkedIn',
      url: '#',
      description: 'Connect with me professionally',
      variant: 'primary'
    },
    {
      platform: 'GitHub',
      url: '#',
      description: 'Check out my code repositories',
      variant: 'dark'
    },
    {
      platform: 'Twitter',
      url: '#',
      description: 'Follow my thoughts and updates',
      variant: 'info'
    }
  ];

  return (
    <PageTemplate 
      title="Social Connections" 
      headerContent="Let's connect and stay in touch!"
      footerContent="Feel free to reach out through any of these platforms"
    >
      <Row>
        <Col>
          <Card className="mb-4" style={{ backgroundColor: '#e8f5e8', border: '1px solid #28a745' }}>
            <Card.Body>
              <Card.Title className="text-success">Stay Connected</Card.Title>
              <Card.Text>
                I'm active on various social platforms. Whether you want to discuss professional 
                opportunities, collaborate on projects, or just say hello, I'd love to hear from you!
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {socialLinks.map((social, index) => (
          <Col md={4} key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <Card.Title className={`text-${social.variant}`}>
                  {social.platform}
                </Card.Title>
                <Card.Text className="mb-3">
                  {social.description}
                </Card.Text>
                <Button 
                  variant={`outline-${social.variant}`} 
                  href={social.url}
                  className="w-100"
                >
                  Visit {social.platform}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col>
          <Card style={{ backgroundColor: '#e3f2fd', border: '1px solid #007bff' }}>
            <Card.Body>
              <Card.Title className="text-primary">Contact Information</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                  <strong>Email:</strong> your.email@example.com
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                  <strong>Location:</strong> Your City, Country
                </ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: 'transparent' }}>
                  <strong>Available for:</strong> Networking, Collaborations, Opportunities
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default Socials;
