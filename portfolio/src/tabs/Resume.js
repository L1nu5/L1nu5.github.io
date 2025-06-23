import React from 'react';
import { Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function Resume() {
  // Get data from the data service
  const workExperience = dataService.getWorkExperience();
  const projects = dataService.getProjects();
  const skills = dataService.getResumeSkills();
  const summary = dataService.getSummary();
  const downloadLinks = dataService.getDownloadLinks();
  const { theme } = useTheme();

  return (
    <PageTemplate 
      title="Professional Resume" 
      headerContent="My professional experience and achievements"
      footerContent="Ready to contribute to your team's success"
    >
      <Row className="mb-4">
        <Col>
          <Card style={{ 
            backgroundColor: theme.lightBlue, 
            border: `1px solid ${theme.primaryColor}`,
            color: theme.textColor
          }}>
            <Card.Body className="text-center">
              <Card.Title style={{ color: theme.primaryColor }}>Professional Summary</Card.Title>
              <Card.Text style={{ color: theme.textColor }}>
                {summary}
              </Card.Text>
              <Button variant="primary" size="lg" className="me-3" href={downloadLinks.pdfResume}>
                Download PDF Resume
              </Button>
              <Button variant="outline-success" size="lg" href={downloadLinks.portfolioPdf}>
                View Online Version
              </Button>
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
              <h4 style={{ color: theme.secondaryColor }} className="mb-0">Work Experience</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              {workExperience.map((job, index) => (
                <div key={job.id} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1" style={{ color: theme.textColor }}>{job.position}</h5>
                      <h6 style={{ color: theme.primaryColor }}>{job.company}</h6>
                      <small style={{ color: theme.mutedText }}>{job.location}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="secondary" className="mb-1">{job.period}</Badge>
                      <br />
                      <Badge bg={job.type === 'Full-time' ? 'success' : 'info'}>
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <ul className="mb-2" style={{ color: theme.textColor }}>
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                  {job.technologies && (
                    <div className="mb-2">
                      <strong style={{ color: theme.textColor }}>Technologies:</strong>
                      <div className="mt-1">
                        {job.technologies.map((tech, idx) => (
                          <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {job.achievements && (
                    <div>
                      <strong style={{ color: theme.textColor }}>Key Achievements:</strong>
                      <ul className="mt-1" style={{ color: theme.textColor }}>
                        {job.achievements.map((achievement, idx) => (
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
              <h4 style={{ color: theme.primaryColor }} className="mb-0">Key Skills</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <ListGroup variant="flush">
                {Object.values(skills).map((skillCategory, index) => (
                  <ListGroup.Item key={index} className="px-0" style={{
                    backgroundColor: 'transparent',
                    borderColor: theme.borderColor,
                    color: theme.textColor
                  }}>
                    <Badge bg={skillCategory.color} className="me-2">{skillCategory.category}</Badge>
                    <span style={{ color: theme.textColor }}>{skillCategory.skills.join(', ')}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
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
              <h4 style={{ color: theme.secondaryColor }} className="mb-0">Featured Projects</h4>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <Row className="g-3">
                {projects.map((project) => (
                  <Col md={6} key={project.id}>
                    <Card className="h-100 border-0" style={{ 
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor
                    }}>
                      <Card.Body>
                        <Card.Title className="h5" style={{ color: theme.primaryColor }}>{project.name}</Card.Title>
                        <Card.Text style={{ color: theme.textColor }}>{project.description}</Card.Text>
                        <div className="mb-2">
                          {project.technologies.map((tech, idx) => (
                            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {project.features && (
                          <div className="mb-2">
                            <strong style={{ color: theme.textColor }}>Features:</strong>
                            <ul className="mt-1" style={{ color: theme.textColor }}>
                              {project.features.slice(0, 3).map((feature, idx) => (
                                <li key={idx} className="small">{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="d-flex gap-2">
                          {project.githubUrl && (
                            <Button variant="outline-primary" size="sm" href={project.githubUrl} target="_blank">
                              GitHub
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button variant="outline-success" size="sm" href={project.liveUrl} target="_blank">
                              Live Demo
                            </Button>
                          )}
                        </div>
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

export default Resume;
