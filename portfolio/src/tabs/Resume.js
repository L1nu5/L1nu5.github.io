import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import DesignProjectCard from '../components/DesignProjectCard';
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
              <Button variant="primary" size="lg" className="me-3" href={downloadLinks.pdfResume} target="_blank">
                Download PDF Resume
              </Button>
              <Button variant="outline-success" size="lg" href={downloadLinks.portfolioPdf} target="_blank">
                View Portfolio PDF
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
              <Row className="g-2">
                {Object.values(skills).map((skillCategory, index) => (
                  <Col xs={6} key={index}>
                    <div style={{
                      backgroundColor: theme.backgroundColor,
                      border: `1px solid ${theme.borderColor}`,
                      borderRadius: '6px',
                      padding: '0.6rem 0.75rem',
                      height: '100%'
                    }}>
                      <Badge bg={skillCategory.color} className="mb-2 d-block text-truncate">
                        {skillCategory.category}
                      </Badge>
                      <div className="d-flex flex-wrap gap-1">
                        {skillCategory.skills.map((skill, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.7rem',
                            color: theme.mutedText,
                            backgroundColor: theme.lightBlue,
                            borderRadius: '3px',
                            padding: '1px 5px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
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
              {projects.map((project) =>
                project.architecture ? (
                  <DesignProjectCard key={project.id} project={project} theme={theme} />
                ) : (
                  <Card key={project.id} className="mb-3 border-0" style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor
                  }}>
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-1">
                        <Card.Title className="h5 mb-0" style={{ color: theme.primaryColor }}>{project.name}</Card.Title>
                        {project.period && <Badge bg="secondary">{project.period}</Badge>}
                      </div>
                      {project.tagline && (
                        <p className="small fst-italic mb-2" style={{ color: theme.mutedText }}>{project.tagline}</p>
                      )}
                      <Card.Text style={{ color: theme.textColor }}>{project.description}</Card.Text>
                      <div className="mb-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">{tech}</Badge>
                        ))}
                      </div>
                      {project.features && (
                        <div className="mb-2">
                          <strong style={{ color: theme.textColor }}>Features:</strong>
                          <ul className="mt-1" style={{ color: theme.textColor }}>
                            {project.features.map((feature, idx) => (
                              <li key={idx} className="small">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="d-flex gap-2">
                        {project.githubUrl && (
                          <Button variant="outline-primary" size="sm" href={project.githubUrl} target="_blank">GitHub</Button>
                        )}
                        {project.liveUrl && (
                          <Button variant="outline-success" size="sm" href={project.liveUrl} target="_blank">Live</Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                )
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default Resume;
