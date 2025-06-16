import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function PageTemplate({ title, children, headerContent, footerContent }) {
  return (
    <Container fluid className="page-template">
      {/* Main Content Section with integrated header */}
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm border-0">
            {/* Integrated Header - like a table header */}
            <Card.Header className="bg-light border-bottom" style={{ 
              borderLeft: '4px solid #007bff'
            }}>
              <h4 className="mb-1 text-primary">{title}</h4>
              {headerContent && (
                <small className="text-muted">
                  {headerContent}
                </small>
              )}
            </Card.Header>
            
            {/* Content Body */}
            <Card.Body className="p-4" style={{ 
              backgroundColor: '#f8f9fa'
            }}>
              {children}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Footer Section */}
      {footerContent && (
        <Row className="mt-4">
          <Col>
            <Card className="border-0" style={{ 
              backgroundColor: '#e8f5e8',
              borderTop: '3px solid #28a745'
            }}>
              <Card.Body className="text-center py-3">
                <small className="text-muted">
                  {footerContent}
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default PageTemplate;
