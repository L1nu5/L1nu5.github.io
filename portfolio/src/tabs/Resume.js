import React from 'react';
import { Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';

function Resume() {
  // Get data from the data service
  const workExperience = dataService.getWorkExperience();
  const projects = dataService.getProjects();
  const skills = dataService.getResumeSkills();
  const summary = dataService.getSummary();
  const downloadLinks = dataService.getDownloadLinks();

  return (
    <PageTemplate 
      title="Professional Resume" 
      headerContent="My professional experience and achievements"
      footerContent="Ready to contribute to your team's success"
    >
      <Row className="mb-4">
        <Col>
          <Card style={{ backgroundColor: '#e3f2fd', border: '1px solid #007bff' }}>
            <Card.Body className="text-center">
              <Card.Title className="text-primary">Professional Summary</Card.Title>
              <Card.Text>
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
          <Card className="h-100">
            <Card.Header style={{ backgroundColor: '#e8f5e8', border: 'none' }}>
              <h4 className="text-success mb-0">Work Experience</h4>
            </Card.Header>
            <Card.Body>
              {workExperience.map((job, index) => (
                <div key={job.id} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">{job.position}</h5>
                      <h6 className="text-primary">{job.company}</h6>
                      <small className="text-muted">{job.location}</small>
                    </div>
                    <div className="text-end">
                      <Badge bg="secondary" className="mb-1">{job.period}</Badge>
                      <br />
                      <Badge bg={job.type === 'Full-time' ? 'success' : 'info'}>
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <ul className="mb-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                  {job.technologies && (
                    <div className="mb-2">
                      <strong>Technologies:</strong>
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
                      <strong>Key Achievements:</strong>
                      <ul className="mt-1">
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
          <Card className="h-100">
            <Card.Header style={{ backgroundColor: '#f8f9fa', border: 'none' }}>
              <h4 className="text-primary mb-0">Key Skills</h4>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {Object.values(skills).map((skillCategory, index) => (
                  <ListGroup.Item key={index} className="px-0">
                    <Badge bg={skillCategory.color} className="me-2">{skillCategory.category}</Badge>
                    {skillCategory.skills.join(', ')}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #28a745' }}>
            <Card.Header style={{ backgroundColor: '#e8f5e8', border: 'none' }}>
              <h4 className="text-success mb-0">Featured Projects</h4>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                {projects.map((project) => (
                  <Col md={6} key={project.id}>
                    <Card className="h-100 border-0" style={{ backgroundColor: '#ffffff' }}>
                      <Card.Body>
                        <Card.Title className="h5 text-primary">{project.name}</Card.Title>
                        <Card.Text>{project.description}</Card.Text>
                        <div className="mb-2">
                          {project.technologies.map((tech, idx) => (
                            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {project.features && (
                          <div className="mb-2">
                            <strong>Features:</strong>
                            <ul className="mt-1">
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
