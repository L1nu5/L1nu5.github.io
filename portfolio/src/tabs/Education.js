import React from 'react';
import { Row, Col, Card, ProgressBar, Badge, ListGroup } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';

function Education() {
  // Get data from the data service
  const education = dataService.getEducation();
  const institutions = dataService.getInstitutions();
  const skills = dataService.getSkills();
  const certifications = dataService.getCertifications();
  const skillsByCategory = dataService.getSkillsByCategory();

  return (
    <PageTemplate 
      title="Education & Skills" 
      headerContent="My academic journey and technical expertise"
      footerContent="Continuous learning drives innovation"
    >
      <Row className="mb-4">
        <Col>
          <Card style={{ backgroundColor: '#e8f5e8', border: '1px solid #28a745' }}>
            <Card.Body>
              <Card.Title className="text-success">Educational Philosophy</Card.Title>
              <Card.Text>
                {education.philosophy}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header style={{ backgroundColor: '#e3f2fd', border: 'none' }}>
              <h4 className="text-primary mb-0">Educational Background</h4>
            </Card.Header>
            <Card.Body>
              {institutions.map((institution, index) => (
                <div key={institution.id} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">{institution.degree}</h5>
                      <h6 className="text-primary">{institution.institution}</h6>
                      <small className="text-muted">{institution.location}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="secondary" className="mb-1">{institution.period}</Badge>
                      <br />
                      <Badge bg="success">GPA: {institution.gpa}</Badge>
                    </div>
                  </div>
                  
                  {institution.highlights && (
                    <div className="mb-2">
                      <strong>Key Coursework:</strong>
                      <div className="mt-1">
                        {institution.highlights.map((highlight, idx) => (
                          <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {institution.achievements && (
                    <div>
                      <strong>Achievements:</strong>
                      <ul className="mt-1">
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

        <Col lg={4}>
          <Card className="h-100">
            <Card.Header style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
              <h4 className="text-success mb-0">Certifications</h4>
            </Card.Header>
            <Card.Body>
              {certifications.map((cert, index) => (
                <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                  <h6 className="mb-1">{cert.name}</h6>
                  <small className="text-muted d-block">{cert.issuer}</small>
                  <small className="text-muted d-block">Issued: {new Date(cert.date).toLocaleDateString()}</small>
                  {cert.validUntil && (
                    <small className="text-muted d-block">Valid until: {new Date(cert.validUntil).toLocaleDateString()}</small>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #007bff' }}>
            <Card.Header style={{ backgroundColor: '#e3f2fd', border: 'none' }}>
              <h4 className="text-primary mb-0">Technical Skills</h4>
            </Card.Header>
            <Card.Body>
              <Row className="g-4">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <Col md={6} lg={4} key={category}>
                    <Card className="h-100 border-0" style={{ backgroundColor: '#ffffff' }}>
                      <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">{category}</h6>
                      </Card.Header>
                      <Card.Body className="p-3">
                        {categorySkills.map((skill, idx) => (
                          <div key={idx} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small fw-bold">{skill.name}</span>
                              <span className="small text-muted">{skill.level}%</span>
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
