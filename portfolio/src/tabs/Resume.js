import React, { useState } from 'react';
import { Row, Col, Card, Button, ListGroup, Badge, Accordion } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function DesignProjectCard({ project, theme }) {
  const [openSection, setOpenSection] = useState('architecture');

  return (
    <Card className="mb-4 shadow-sm" style={{
      backgroundColor: theme.cardBackground,
      border: `2px solid ${theme.primaryColor}30`,
      color: theme.textColor
    }}>
      <Card.Header style={{ backgroundColor: theme.lightBlue, border: 'none' }}>
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h5 className="mb-1" style={{ color: theme.primaryColor }}>{project.name}</h5>
            <p className="mb-0 fst-italic small" style={{ color: theme.mutedText }}>{project.tagline}</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {project.period && <Badge bg="secondary">{project.period}</Badge>}
            <Badge bg={project.status === 'Production' ? 'success' : project.status === 'Live' ? 'info' : 'warning'}>
              {project.status}
            </Badge>
          </div>
        </div>
        <div className="mt-2 d-flex flex-wrap gap-2">
          <small style={{ color: theme.mutedText }}><strong>Context:</strong> {project.context}</small>
          <span style={{ color: theme.borderColor }}>·</span>
          <small style={{ color: theme.mutedText }}><strong>Role:</strong> {project.role}</small>
          <span style={{ color: theme.borderColor }}>·</span>
          <small style={{ color: theme.mutedText }}><strong>v1 in:</strong> {project.duration}</small>
        </div>
      </Card.Header>

      <Card.Body style={{ color: theme.textColor }}>
        <p style={{ color: theme.textColor }}>{project.description}</p>

        {/* Impact bar */}
        {project.impact && (
          <div className="d-flex flex-wrap gap-3 mb-3 p-3 rounded" style={{ backgroundColor: theme.lightGreen }}>
            <div>
              <span className="fw-bold" style={{ color: theme.secondaryColor }}>Teams: </span>
              <span style={{ color: theme.textColor }}>{project.impact.teams}</span>
            </div>
            <div>
              <span className="fw-bold" style={{ color: theme.secondaryColor }}>Products: </span>
              <span style={{ color: theme.textColor }}>{project.impact.products}</span>
            </div>
          </div>
        )}

        {/* Tech badges */}
        <div className="mb-3">
          {project.technologies.map((tech, idx) => (
            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">{tech}</Badge>
          ))}
        </div>

        {/* Accordion sections */}
        <Accordion activeKey={openSection} onSelect={setOpenSection} flush>

          {project.architecture && (
            <Accordion.Item eventKey="architecture" style={{ backgroundColor: theme.cardBackground, borderColor: theme.borderColor }}>
              <Accordion.Header>
                <span style={{ color: theme.primaryColor, fontWeight: 600 }}>Architecture & Design Patterns</span>
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                <p className="mb-3" style={{ color: theme.textColor }}>{project.architecture.overview}</p>
                <div className="mb-3">
                  <strong style={{ color: theme.secondaryColor }}>Layers:</strong>
                  <ul className="mt-2">
                    {project.architecture.layers.map((layer, idx) => (
                      <li key={idx} className="small mb-1" style={{ color: theme.textColor }}>{layer}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: theme.secondaryColor }}>Design Patterns Applied:</strong>
                  <ul className="mt-2">
                    {project.architecture.patterns.map((p, idx) => (
                      <li key={idx} className="small mb-1" style={{ color: theme.textColor }}>{p}</li>
                    ))}
                  </ul>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          )}

          {project.keyFeatures && (
            <Accordion.Item eventKey="features" style={{ backgroundColor: theme.cardBackground, borderColor: theme.borderColor }}>
              <Accordion.Header>
                <span style={{ color: theme.primaryColor, fontWeight: 600 }}>Key Features & Benefits</span>
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                <div className="mb-3">
                  <strong style={{ color: theme.secondaryColor }}>Features:</strong>
                  <ul className="mt-2">
                    {project.keyFeatures.map((f, idx) => (
                      <li key={idx} className="small mb-1" style={{ color: theme.textColor }}>{f}</li>
                    ))}
                  </ul>
                </div>
                {project.benefits && (
                  <div>
                    <strong style={{ color: theme.secondaryColor }}>Benefits:</strong>
                    <ul className="mt-2">
                      {project.benefits.map((b, idx) => (
                        <li key={idx} className="small mb-1" style={{ color: theme.textColor }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          )}

          {project.drawbacks && (
            <Accordion.Item eventKey="tradeoffs" style={{ backgroundColor: theme.cardBackground, borderColor: theme.borderColor }}>
              <Accordion.Header>
                <span style={{ color: theme.primaryColor, fontWeight: 600 }}>Tradeoffs & Roadmap</span>
              </Accordion.Header>
              <Accordion.Body style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                <div className="mb-3">
                  <strong style={{ color: theme.secondaryColor }}>Known Tradeoffs:</strong>
                  {project.drawbacks.map((d, idx) => (
                    <div key={idx} className="mt-2 p-2 rounded small" style={{ backgroundColor: theme.lightBlue }}>
                      <div className="mb-1" style={{ color: theme.textColor }}>
                        <strong>Issue: </strong>{d.issue}
                      </div>
                      <div style={{ color: theme.mutedText }}>
                        <strong>Mitigation: </strong>{d.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
                {project.improvements && (
                  <div>
                    <strong style={{ color: theme.secondaryColor }}>Future Improvements:</strong>
                    <ul className="mt-2">
                      {project.improvements.map((imp, idx) => (
                        <li key={idx} className="small mb-1" style={{ color: theme.textColor }}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          )}

        </Accordion>

        {/* External links (for non-work projects) */}
        {(project.githubUrl || project.liveUrl) && (
          <div className="d-flex gap-2 mt-3">
            {project.githubUrl && (
              <Button variant="outline-primary" size="sm" href={project.githubUrl} target="_blank">GitHub</Button>
            )}
            {project.liveUrl && (
              <Button variant="outline-success" size="sm" href={project.liveUrl} target="_blank">Live</Button>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

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
