import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

function PageTemplate({ title, children, headerContent, footerContent }) {
  const { theme } = useTheme();

  return (
    <Container fluid className="page-template">
      {/* Main Content Section with integrated header */}
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <Card className="shadow-sm border-0" style={{
            backgroundColor: theme.cardBackground,
            borderColor: theme.borderColor
          }}>
            {/* Integrated Header - like a table header */}
            <Card.Header className="border-bottom" style={{ 
              borderLeft: `4px solid ${theme.primaryColor}`,
              backgroundColor: theme.lightBlue,
              borderBottomColor: theme.borderColor,
              color: theme.textColor
            }}>
              <h4 className="mb-1" style={{ color: theme.primaryColor }}>{title}</h4>
              {headerContent && (
                <small style={{ color: theme.mutedText }}>
                  {headerContent}
                </small>
              )}
            </Card.Header>
            
            {/* Content Body */}
            <Card.Body className="p-4" style={{ 
              backgroundColor: theme.backgroundColor,
              color: theme.textColor
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
              backgroundColor: theme.lightGreen,
              borderTop: `3px solid ${theme.secondaryColor}`,
              borderColor: theme.borderColor
            }}>
              <Card.Body className="text-center py-3">
                <small style={{ color: theme.mutedText }}>
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
