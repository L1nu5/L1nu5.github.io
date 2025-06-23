import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, ListGroup, Nav } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import MusicTimeline from '../components/MusicTimeline';
import MusicStats from '../components/MusicStats';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function MusicEvents() {
  const [activeView, setActiveView] = useState('upcoming');
  const { theme } = useTheme();

  // Get data from the data service
  const upcomingEvents = dataService.getUpcomingEvents();
  const pastEvents = dataService.getPastEvents();

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
          <Card className="mb-4" style={{ 
            backgroundColor: theme.lightGreen, 
            border: `1px solid ${theme.secondaryColor}`,
            color: theme.textColor
          }}>
            <Card.Body>
              <Card.Title style={{ color: theme.secondaryColor }}>My Music Passion</Card.Title>
              <Card.Text style={{ color: theme.textColor }}>
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
          <Card className="border-0 shadow-sm" style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor
          }}>
            <Card.Body className="p-0">
              <Nav variant="tabs" className="border-0">
                <Nav.Item>
                  <Nav.Link 
                    active={activeView === 'upcoming'} 
                    onClick={() => setActiveView('upcoming')}
                    style={{ 
                      color: activeView === 'upcoming' ? theme.primaryColor : theme.mutedText,
                      backgroundColor: activeView === 'upcoming' ? theme.lightBlue : 'transparent',
                      borderColor: activeView === 'upcoming' ? theme.primaryColor : 'transparent'
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
                      color: activeView === 'timeline' ? theme.primaryColor : theme.mutedText,
                      backgroundColor: activeView === 'timeline' ? theme.lightBlue : 'transparent',
                      borderColor: activeView === 'timeline' ? theme.primaryColor : 'transparent'
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
                      color: activeView === 'stats' ? theme.primaryColor : theme.mutedText,
                      backgroundColor: activeView === 'stats' ? theme.lightBlue : 'transparent',
                      borderColor: activeView === 'stats' ? theme.primaryColor : 'transparent'
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
              <h4 style={{ color: theme.primaryColor }} className="mb-3">Upcoming Events I'm Attending</h4>
            </Col>
          </Row>

          <Row className="g-4">
            {upcomingEvents.map((event, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="h-100 shadow-sm" style={{
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}>
                  <Card.Header style={{ 
                    backgroundColor: theme.lightBlue, 
                    border: 'none',
                    color: theme.textColor
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg={getTypeVariant(event.type)}>{event.type}</Badge>
                      <Badge bg={getStatusVariant(event.status)}>{event.status}</Badge>
                    </div>
                  </Card.Header>
                  <Card.Body style={{ color: theme.textColor }}>
                    <Card.Title className="h5" style={{ color: theme.primaryColor }}>{event.title}</Card.Title>
                    <ListGroup variant="flush" className="mb-3">
                      <ListGroup.Item className="px-0 py-1" style={{
                        backgroundColor: 'transparent',
                        borderColor: theme.borderColor,
                        color: theme.textColor
                      }}>
                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-1" style={{
                        backgroundColor: 'transparent',
                        borderColor: theme.borderColor,
                        color: theme.textColor
                      }}>
                        <strong>Time:</strong> {event.time}
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-1" style={{
                        backgroundColor: 'transparent',
                        borderColor: theme.borderColor,
                        color: theme.textColor
                      }}>
                        <strong>Venue:</strong> {event.venue}
                      </ListGroup.Item>
                      <ListGroup.Item className="px-0 py-1" style={{
                        backgroundColor: 'transparent',
                        borderColor: theme.borderColor,
                        color: theme.textColor
                      }}>
                        <strong>Location:</strong> {event.location}
                      </ListGroup.Item>
                    </ListGroup>
                    <Card.Text className="mb-2" style={{ color: theme.mutedText }}>{event.description}</Card.Text>
                    {event.artists && (
                      <div>
                        <strong style={{ color: theme.textColor }}>Featured Artists:</strong>
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
                  <Card.Footer style={{ 
                    backgroundColor: 'transparent',
                    borderColor: theme.borderColor
                  }}>
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
              <h4 style={{ color: theme.primaryColor }} className="mb-3">My Music Journey Timeline</h4>
              <p style={{ color: theme.mutedText }}>
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
        <>
          {/* Stats.fm Music Data */}
          <Row className="mb-4">
            <Col>
              <MusicStats />
            </Col>
          </Row>

          {/* Concert Events Stats */}
          <Row>
            <Col lg={8}>
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
                  <h4 style={{ color: theme.primaryColor }} className="mb-0">Recent Concerts & Events</h4>
                </Card.Header>
                <Card.Body style={{ color: theme.textColor }}>
                  {pastEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1" style={{ color: theme.textColor }}>{event.title}</h6>
                          <small style={{ color: theme.mutedText }}>{event.venue}</small>
                        </div>
                        <div className="text-end">
                          <Badge bg={getTypeVariant(event.type)} className="mb-1">
                            {event.type}
                          </Badge>
                          <br />
                          <small style={{ color: theme.mutedText }}>
                            {new Date(event.date).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-warning me-2">
                          {renderStars(event.rating)}
                        </span>
                        <small style={{ color: theme.mutedText }}>({event.rating}/5)</small>
                      </div>
                      <p className="mb-0 small" style={{ color: theme.mutedText }}>
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
              <Card style={{ 
                backgroundColor: theme.lightGreen, 
                border: `1px solid ${theme.secondaryColor}`,
                color: theme.textColor
              }}>
                <Card.Header style={{ 
                  backgroundColor: theme.lightGreen, 
                  border: 'none',
                  color: theme.textColor
                }}>
                  <h5 style={{ color: theme.secondaryColor }} className="mb-0">Concert Stats</h5>
                </Card.Header>
                <Card.Body style={{ color: theme.textColor }}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                      backgroundColor: 'transparent',
                      borderColor: theme.borderColor,
                      color: theme.textColor
                    }}>
                      <span>Concerts Attended:</span>
                      <Badge bg="primary">{pastEvents.length}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                      backgroundColor: 'transparent',
                      borderColor: theme.borderColor,
                      color: theme.textColor
                    }}>
                      <span>Festivals Experienced:</span>
                      <Badge bg="info">{pastEvents.filter(e => e.type === 'Festival').length}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                      backgroundColor: 'transparent',
                      borderColor: theme.borderColor,
                      color: theme.textColor
                    }}>
                      <span>Average Rating:</span>
                      <Badge bg="warning">
                        {(pastEvents.reduce((sum, e) => sum + e.rating, 0) / pastEvents.length).toFixed(1)}/5
                      </Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                      backgroundColor: 'transparent',
                      borderColor: theme.borderColor,
                      color: theme.textColor
                    }}>
                      <span>Favorite Genre:</span>
                      <Badge bg="success">Indie Rock</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="px-0 d-flex justify-content-between" style={{
                      backgroundColor: 'transparent',
                      borderColor: theme.borderColor,
                      color: theme.textColor
                    }}>
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
        </>
      )}
    </PageTemplate>
  );
}

export default MusicEvents;
