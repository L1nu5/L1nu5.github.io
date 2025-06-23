import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

function MusicTimeline({ events }) {
  const { theme } = useTheme();

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Festival': return '🎪';
      case 'Concert': return '🎤';
      case 'Acoustic': return '🎸';
      case 'Showcase': return '🎵';
      default: return '🎶';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Festival': return '#17a2b8';
      case 'Concert': return theme.primaryColor;
      case 'Acoustic': return theme.secondaryColor;
      case 'Showcase': return '#6c757d';
      default: return '#6f42c1';
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const ImageCollage = ({ images, eventTitle }) => (
    <Row className="g-2 mb-3">
      {images && images.slice(0, 4).map((image, index) => (
        <Col xs={6} key={index}>
          <div 
            style={{
              height: '80px',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
              border: `2px solid ${theme.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.cardBackground,
              color: theme.mutedText,
              fontSize: '12px',
              textAlign: 'center'
            }}
          >
            {/* Placeholder text for demo - in real app, images would load */}
            📸 {eventTitle}
          </div>
        </Col>
      ))}
    </Row>
  );

  return (
    <div className="custom-timeline">
      {events.map((event, index) => (
        <div key={index} className="timeline-item mb-4">
          <Row>
            {/* Timeline Line and Icon */}
            <Col xs={2} md={1} className="text-center">
              <div className="timeline-icon-container">
                <div 
                  className="timeline-icon rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: getTypeColor(event.type),
                    color: 'white',
                    fontSize: '20px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {getTypeIcon(event.type)}
                </div>
                {/* Timeline line */}
                {index < events.length - 1 && (
                  <div 
                    className="timeline-line"
                    style={{
                      width: '2px',
                      height: '100px',
                      backgroundColor: theme.borderColor,
                      margin: '0 auto',
                      position: 'relative',
                      top: '10px'
                    }}
                  />
                )}
              </div>
            </Col>

            {/* Event Content */}
            <Col xs={10} md={11}>
              <Card 
                className="shadow-sm mb-3" 
                style={{ 
                  border: `2px solid ${getTypeColor(event.type)}20`,
                  backgroundColor: theme.cardBackground,
                  color: theme.textColor
                }}
              >
                <Card.Header style={{ 
                  backgroundColor: `${getTypeColor(event.type)}10`, 
                  border: 'none',
                  color: theme.textColor
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1" style={{ color: getTypeColor(event.type) }}>
                        {event.title}
                      </h5>
                      <small style={{ color: theme.mutedText }}>
                        📍 {event.venue} • {new Date(event.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </small>
                    </div>
                    <Badge bg={event.type === 'Festival' ? 'info' : event.type === 'Concert' ? 'primary' : 'success'}>
                      {event.type}
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body style={{ color: theme.textColor }}>
                  {/* Image Collage */}
                  <ImageCollage 
                    images={event.images || []} 
                    eventTitle={event.title.split(' ')[0]}
                  />

                  {/* Rating */}
                  <div className="mb-3">
                    <span className="text-warning me-2" style={{ fontSize: '18px' }}>
                      {renderStars(event.rating)}
                    </span>
                    <small style={{ color: theme.mutedText }}>({event.rating}/5)</small>
                  </div>

                  {/* Review */}
                  <Card 
                    className="border-0 mb-3" 
                    style={{ 
                      backgroundColor: theme.lightBlue,
                      color: theme.textColor
                    }}
                  >
                    <Card.Body className="p-3">
                      <Card.Text className="mb-0 fst-italic" style={{ color: theme.textColor }}>
                        "{event.review}"
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  {/* Artists/Highlights */}
                  {event.highlights && (
                    <div>
                      <strong style={{ color: theme.secondaryColor }}>Highlights:</strong>
                      <div className="mt-2">
                        {event.highlights.map((highlight, idx) => (
                          <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
}

export default MusicTimeline;
