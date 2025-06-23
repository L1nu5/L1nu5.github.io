import React from 'react';
import { Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function Education() {
  // Get data from the data service
  const education = dataService.getEducation();
  const institutions = dataService.getInstitutions();
  const certifications = dataService.getCertifications();
  const skillsByCategory = dataService.getSkillsByCategory();
  const { theme } = useTheme();

  return (
    <PageTemplate 
      title="Education & Skills" 
      headerContent="My academic journey and technical expertise"
      footerContent="Continuous learning drives innovation"
    >
      <Row className="mb-4">
        <Col>
          <Card style={{ 
            backgroundColor: theme.lightGreen, 
            border: `1px solid ${theme.secondaryColor}`,
            color: theme.textColor
          }}>
            <Card.Body>
              <Card.Title style={{ color: theme.secondaryColor }}>Educational Philosophy</Card.Title>
              <Card.Text style={{ color: theme.textColor }}>
                {education.philosophy}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={certifications.length > 0 ? 8 : 12}>
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
              <h4 style={{ color: theme.primaryColor }} className="mb-0">Educational Background</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              {institutions.map((institution, index) => (
                <div key={institution.id} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1" style={{ color: theme.textColor }}>{institution.degree}</h5>
                      <h6 style={{ color: theme.primaryColor }}>{institution.institution}</h6>
                      <small style={{ color: theme.mutedText }}>{institution.location}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="secondary" className="mb-1">{institution.period}</Badge>
                      <br />
                      <Badge bg="success">GPA: {institution.gpa}</Badge>
                    </div>
                  </div>
                  
                  {institution.highlights && (
                    <div className="mb-2">
                      <strong style={{ color: theme.textColor }}>Key Coursework:</strong>
                      <div className="mt-1">
                        {institution.highlights.map((highlight, idx) => (
                          <Badge key={idx} bg="info" className="me-1 mb-1">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {institution.achievements && (
                    <div>
                      <strong style={{ color: theme.textColor }}>Achievements:</strong>
                      <ul className="mt-1" style={{ color: theme.textColor }}>
                        {institution.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {certifications.length > 0 && (
          <Col lg={4}>
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
                <h4 style={{ color: theme.secondaryColor }} className="mb-0">Certifications</h4>
              </Card.Header>
              <Card.Body style={{ color: theme.textColor }}>
                {certifications.map((cert, index) => (
                  <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                    <h6 className="mb-1" style={{ color: theme.textColor }}>{cert.name}</h6>
                    <small style={{ color: theme.mutedText }} className="d-block">{cert.issuer}</small>
                    <small style={{ color: theme.mutedText }} className="d-block">Issued: {new Date(cert.date).toLocaleDateString()}</small>
                    {cert.validUntil && (
                      <small style={{ color: theme.mutedText }} className="d-block">Valid until: {new Date(cert.validUntil).toLocaleDateString()}</small>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
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
              <h4 style={{ color: theme.primaryColor }} className="mb-0">Technical Skills</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <Row className="g-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <Col md={6} lg={4} key={category}>
                    <Card className="h-100 border-0" style={{ 
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor
                    }}>
                      <Card.Header style={{
                        backgroundColor: theme.lightBlue,
                        border: 'none',
                        color: theme.textColor
                      }}>
                        <h6 className="mb-0" style={{ color: theme.primaryColor }}>{category}</h6>
                      </Card.Header>
                      <Card.Body className="p-3" style={{ color: theme.textColor }}>
                        {categorySkills.map((skill, idx) => (
                          <div key={idx} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small fw-bold" style={{ color: theme.textColor }}>{skill.name}</span>
                              <span className="small" style={{ color: theme.mutedText }}>{skill.level}%</span>
                            </div>
                            <ProgressBar 
                              now={skill.level} 
                              variant={
                                skill.level >= 85 ? 'success' : 
                                skill.level >= 70 ? 'info' : 
                                skill.level >= 60 ? 'warning' : 'secondary'
                              }
                              style={{ height: '6px' }}
                            />
                          </div>
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default Education;
