import React from 'react';
import { Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';

function Resume() {
  const workExperience = [
    {
      company: 'Tech Solutions Inc.',
      position: 'Software Developer',
      period: '2024 - Present',
      type: 'Full-time',
      responsibilities: [
        'Developed responsive web applications using React and Node.js',
        'Collaborated with cross-functional teams to deliver high-quality software',
        'Implemented RESTful APIs and database optimization'
      ]
    },
    {
      company: 'StartupXYZ',
      position: 'Frontend Developer Intern',
      period: '2023 - 2024',
      type: 'Internship',
      responsibilities: [
        'Built user interfaces using React and Bootstrap',
        'Participated in agile development processes',
        'Contributed to code reviews and testing procedures'
      ]
    }
  ];

  const projects = [
    {
      name: 'E-commerce Platform',
      tech: ['React', 'Node.js', 'MongoDB'],
      description: 'Full-stack web application with user authentication and payment integration'
    },
    {
      name: 'Task Management App',
      tech: ['React', 'Firebase'],
      description: 'Real-time collaborative task management tool with drag-and-drop functionality'
    }
  ];

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
                Passionate software developer with experience in full-stack web development. 
                Skilled in modern JavaScript frameworks and committed to writing clean, 
                efficient code. Strong problem-solving abilities and excellent team collaboration skills.
              </Card.Text>
              <Button variant="primary" size="lg" className="me-3">
                Download PDF Resume
              </Button>
              <Button variant="outline-success" size="lg">
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
                <div key={index} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">{job.position}</h5>
                      <h6 className="text-primary">{job.company}</h6>
                    </div>
                    <div className="text-end">
                      <Badge bg="secondary" className="mb-1">{job.period}</Badge>
                      <br />
                      <Badge bg={job.type === 'Full-time' ? 'success' : 'info'}>
                        {job.type}
                      </Badge>
                    </div>
                  </div>
                  <ul>
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
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
                <ListGroup.Item className="px-0">
                  <Badge bg="primary" className="me-2">Frontend</Badge>
                  React, HTML5, CSS3, JavaScript
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Badge bg="success" className="me-2">Backend</Badge>
                  Node.js, Express, RESTful APIs
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Badge bg="info" className="me-2">Database</Badge>
                  MongoDB, MySQL, Firebase
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Badge bg="warning" className="me-2">Tools</Badge>
                  Git, VS Code, Postman
                </ListGroup.Item>
                <ListGroup.Item className="px-0">
                  <Badge bg="secondary" className="me-2">Soft Skills</Badge>
                  Team Collaboration, Problem Solving
                </ListGroup.Item>
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
                {projects.map((project, index) => (
                  <Col md={6} key={index}>
                    <Card className="h-100 border-0" style={{ backgroundColor: '#ffffff' }}>
                      <Card.Body>
                        <Card.Title className="h5 text-primary">{project.name}</Card.Title>
                        <Card.Text>{project.description}</Card.Text>
                        <div>
                          {project.tech.map((tech, idx) => (
                            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">
                              {tech}
                            </Badge>
                          ))}
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
