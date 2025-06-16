import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function PageTemplate({ title, children, headerContent, footerContent }) {
  return (
    <Container fluid className="page-template">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ 
            background: 'linear-gradient(135deg, #007bff 0%, #28a745 100%)',
            color: 'white'
          }}>
            <Card.Body className="text-center py-4">
              <h1 className="display-4 mb-3">{title}</h1>
              {headerContent && (
                <div className="lead">
                  {headerContent}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Section */}
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4" style={{ 
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #007bff'
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
                {footerContent}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default PageTemplate;
