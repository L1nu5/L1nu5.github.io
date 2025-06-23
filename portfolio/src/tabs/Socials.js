import React from 'react';
import { Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function Socials() {
  // Get data from the data service
  const socialLinks = dataService.getSocialLinks();
  const contactInfo = dataService.getContactInfo();
  const socialStats = dataService.getSocialStats();
  const featuredContent = dataService.getFeaturedContent();
  const description = dataService.getSocialsDescription();
  const { theme } = useTheme();

  return (
    <PageTemplate 
      title="Social Media & Contact" 
      headerContent="Connect with me across various platforms"
      footerContent="Let's build something amazing together"
    >
      <Row className="mb-4">
        <Col>
          <Card style={{ 
            backgroundColor: theme.lightBlue, 
            border: `1px solid ${theme.primaryColor}`,
            color: theme.textColor
          }}>
            <Card.Body>
              <Card.Title style={{ color: theme.primaryColor }}>Let's Connect!</Card.Title>
              <Card.Text style={{ color: theme.textColor }}>
                {description}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="h-100" style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
            color: theme.textColor
          }}>
            <Card.Header style={{ 
              backgroundColor: theme.lightGreen, 
              border: 'none',
              color: theme.textColor
            }}>
              <h4 style={{ color: theme.secondaryColor }} className="mb-0">Social Media Platforms</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <Row className="g-3">
                {socialLinks.map((social) => (
                  <Col md={6} key={social.id}>
                    <Card className="h-100 border-0" style={{ 
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor
                    }}>
                      <Card.Body className="text-center">
                        <div className="mb-3" style={{ fontSize: '2rem' }}>
                          {social.icon}
                        </div>
                        <Card.Title className="h5" style={{ color: theme.textColor }}>{social.platform}</Card.Title>
                        <Card.Text className="small" style={{ color: theme.mutedText }}>
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
          <Card className="h-100" style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor,
            color: theme.textColor
          }}>
            <Card.Header style={{ 
              backgroundColor: theme.lightBlue, 
              border: 'none',
              color: theme.textColor
            }}>
              <h4 style={{ color: theme.primaryColor }} className="mb-0">Contact Information</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <ListGroup variant="flush">
                <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <span><strong>Email:</strong></span>
                  <span className="text-end">{contactInfo.email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <span><strong>Location:</strong></span>
                  <span className="text-end">{contactInfo.location}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <span><strong>Timezone:</strong></span>
                  <span className="text-end">{contactInfo.timezone}</span>
                </ListGroup.Item>
                <ListGroup.Item className="px-0" style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <strong>Available for:</strong>
                  <div className="mt-1">
                    <Badge bg="success" className="me-1 mb-1">Networking</Badge>
                    <Badge bg="info" className="me-1 mb-1">Collaborations</Badge>
                    <Badge bg="warning" className="me-1 mb-1">Opportunities</Badge>
                    <Badge bg="secondary" className="me-1 mb-1">Gaming Discussions</Badge>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0" style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <strong>Preferred Contact:</strong>
                  <div className="mt-1" style={{ color: theme.mutedText }}>{contactInfo.preferredContact}</div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0" style={{
                  backgroundColor: 'transparent',
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <strong>Response Time:</strong>
                  <div className="mt-1" style={{ color: theme.mutedText }}>{contactInfo.responseTime}</div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={6}>
          <Card style={{ 
            backgroundColor: theme.cardBackground, 
            border: `1px solid ${theme.secondaryColor}`,
            color: theme.textColor
          }}>
            <Card.Header style={{ 
              backgroundColor: theme.lightGreen, 
              border: 'none',
              color: theme.textColor
            }}>
              <h4 style={{ color: theme.secondaryColor }} className="mb-0">Social Media Stats</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <Row className="text-center">
                <Col>
                  <div className="mb-2">
                    <h3 style={{ color: theme.primaryColor }} className="mb-0">{socialStats.totalFollowers}</h3>
                    <small style={{ color: theme.mutedText }}>Total Followers</small>
                  </div>
                </Col>
                <Col>
                  <div className="mb-2">
                    <h3 style={{ color: theme.secondaryColor }} className="mb-0">{socialStats.platformsActive}</h3>
                    <small style={{ color: theme.mutedText }}>Active Platforms</small>
                  </div>
                </Col>
              </Row>
              <Row className="text-center">
                <Col>
                  <div className="mb-2">
                    <h3 style={{ color: '#74c0fc' }} className="mb-0">{socialStats.contentCreated}</h3>
                    <small style={{ color: theme.mutedText }}>Content Created</small>
                  </div>
                </Col>
                <Col>
                  <div className="mb-2">
                    <h3 style={{ color: '#ffd43b' }} className="mb-0">{socialStats.engagementRate}</h3>
                    <small style={{ color: theme.mutedText }}>Engagement Rate</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card style={{ 
            backgroundColor: theme.cardBackground, 
            border: `1px solid ${theme.primaryColor}`,
            color: theme.textColor
          }}>
            <Card.Header style={{ 
              backgroundColor: theme.lightBlue, 
              border: 'none',
              color: theme.textColor
            }}>
              <h4 style={{ color: theme.primaryColor }} className="mb-0">Featured Content</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              {featuredContent.map((content, index) => (
                <div key={content.id} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0" style={{ color: theme.textColor }}>{content.title}</h6>
                    <Badge bg="outline-secondary">{content.platform}</Badge>
                  </div>
                  <small style={{ color: theme.mutedText }} className="d-block mb-1">
                    {content.type} • {new Date(content.date).toLocaleDateString()}
                  </small>
                  <small style={{ color: theme.secondaryColor }} className="d-block">
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
