import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, ListGroup, Nav } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import MusicTimeline from '../components/MusicTimeline';
import dataService from '../services/dataService';

function MusicEvents() {
  const [activeView, setActiveView] = useState('upcoming');

  // Get data from the data service
  const upcomingEvents = dataService.getUpcomingEvents();
  const pastEvents = dataService.getPastEvents();
  const musicSettings = dataService.getMusicSettings();
  const musicStats = dataService.getMusicStats();

  // Sort past events by date (most recent first) for timeline
  const timelineEvents = [...pastEvents].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Tickets Purchased': return 'success';
      case 'Planning to Attend': return 'info';
      case 'Interested': return 'warning';
      case 'Sold Out': return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeVariant = (type) => {
    switch (type) {
      case 'Concert': return 'primary';
      case 'Festival': return 'info';
      case 'Showcase': return 'secondary';
      case 'Acoustic': return 'success';
      default: return 'light';
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <PageTemplate 
      title="Music Events & Concerts" 
      headerContent="My musical journey through live performances and festivals"
      footerContent="Music is the soundtrack to life - these are the moments that moved me"
    >
      <Row>
        <Col>
          <Card className="mb-4" style={{ backgroundColor: '#e8f5e8', border: '1px solid #28a745' }}>
            <Card.Body>
              <Card.Title className="text-success">My Music Passion</Card.Title>
              <Card.Text>
                Music has always been a huge part of my life. I love discovering new artists, 
                attending live concerts, and experiencing the energy of music festivals. 
                From intimate acoustic sessions to massive stadium shows, each event offers 
                a unique experience that connects people through the power of music.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation Tabs */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <Nav variant="tabs" className="border-0">
                <Nav.Item>
                  <Nav.Link 
                    active={activeView === 'upcoming'} 
                    onClick={() => setActiveView('upcoming')}
                    style={{ 
                      color: activeView === 'upcoming' ? '#007bff' : '#6c757d',
                      backgroundColor: activeView === 'upcoming' ? '#e3f2fd' : 'transparent'
                    }}
                  >
                    🎫 Upcoming Events
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeView === 'timeline'} 
                    onClick={() => setActiveView('timeline')}
                    style={{ 
                      color: activeView === 'timeline' ? '#007bff' : '#6c757d',
                      backgroundColor: activeView === 'timeline' ? '#e3f2fd' : 'transparent'
                    }}
                  >
                    📅 Music Timeline
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    active={activeView === 'stats'} 
                    onClick={() => setActiveView('stats')}
                    style={{ 
                      color: activeView === 'stats' ? '#007bff' : '#6c757d',
                      backgroundColor: activeView === 'stats' ? '#e3f2fd' : 'transparent'
                    }}
                  >
                    📊 Music Stats
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Content based on active view */}
      {activeView === 'upcoming' && (
        <>
          <Row className="mb-4">
            <Col>
              <h4 className="text-primary mb-3">Upcoming Events I'm Attending</h4>
            </Col>
          </Row>

          <Row className="g-4">
            {upcomingEvents.map((event, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="h-100 shadow-sm">
                  <Card.Header style={{ backgroundColor: '#e3f2fd', border: 'none' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={getTypeVariant(event.type)}>{event.type}</Badge>
                      <Badge bg={getStatusVariant(event.status)}>{event.status}</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <Card.Title className="h5 text-primary">{event.title}</Card.Title>
                    <ListGroup variant="flush" className="mb-3">
                      <ListGroup.Item className="px-0 py-1">
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-1">
                        <strong>Time:</strong> {event.time}
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-1">
                        <strong>Venue:</strong> {event.venue}
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-1">
                        <strong>Location:</strong> {event.location}
                      </ListGroup.Item>
                    </ListGroup>
                    <Card.Text className="text-muted mb-2">{event.description}</Card.Text>
                    {event.artists && (
                      <div>
                        <strong>Featured Artists:</strong>
                        <div className="mt-1">
                          {event.artists.map((artist, idx) => (
                            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                              {artist}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card.Body>
                  <Card.Footer className="bg-transparent">
                    <Button 
                      variant={event.status === 'Tickets Purchased' ? 'success' : 'outline-primary'} 
                      size="sm" 
                      className="w-100"
                    >
                      {event.status === 'Tickets Purchased' ? 'Ready to Go!' : 'Get Tickets'}
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {activeView === 'timeline' && (
        <>
          <Row className="mb-4">
            <Col>
              <h4 className="text-primary mb-3">My Music Journey Timeline</h4>
              <p className="text-muted">
                A chronological journey through the concerts and festivals I've attended, 
                complete with photos, reviews, and memories from each event.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <MusicTimeline events={timelineEvents} />
            </Col>
          </Row>
        </>
      )}

      {activeView === 'stats' && (
        <Row>
          <Col lg={8}>
            <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #007bff' }}>
              <Card.Header style={{ backgroundColor: '#e3f2fd', border: 'none' }}>
                <h4 className="text-primary mb-0">Recent Concerts & Events</h4>
              </Card.Header>
              <Card.Body>
                {pastEvents.slice(0, 3).map((event, index) => (
                  <div key={index} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{event.title}</h6>
                        <small className="text-muted">{event.venue}</small>
                      </div>
                      <div className="text-end">
                        <Badge bg={getTypeVariant(event.type)} className="mb-1">
                          {event.type}
                        </Badge>
                        <br />
                        <small className="text-muted">
                          {new Date(event.date).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <span className="text-warning me-2">
                        {renderStars(event.rating)}
                      </span>
                      <small className="text-muted">({event.rating}/5)</small>
                    </div>
                    <p className="text-muted mb-0 small">
                      <em>"{event.review.substring(0, 100)}..."</em>
                    </p>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setActiveView('timeline')}
                  >
                    View Full Timeline
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card style={{ backgroundColor: '#e8f5e8', border: '1px solid #28a745' }}>
              <Card.Header style={{ backgroundColor: '#d4edda', border: 'none' }}>
                <h5 className="text-success mb-0">Music Stats</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span>Concerts Attended:</span>
                    <Badge bg="primary">{pastEvents.length}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span>Festivals Experienced:</span>
                    <Badge bg="info">{pastEvents.filter(e => e.type === 'Festival').length}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span>Average Rating:</span>
                    <Badge bg="warning">
                      {(pastEvents.reduce((sum, e) => sum + e.rating, 0) / pastEvents.length).toFixed(1)}/5
                    </Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span>Favorite Genre:</span>
                    <Badge bg="success">Indie Rock</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="px-0 d-flex justify-content-between">
                    <span>Best Concert:</span>
                    <Badge bg="danger">Radiohead</Badge>
                  </ListGroup.Item>
                </ListGroup>
                <div className="mt-3 d-grid gap-2">
                  <Button variant="outline-primary" size="sm">
                    View Concert Photos
                  </Button>
                  <Button variant="outline-success" size="sm">
                    Music Recommendations
                  </Button>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    onClick={() => setActiveView('timeline')}
                  >
                    Explore Timeline
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </PageTemplate>
  );
}

export default MusicEvents;
