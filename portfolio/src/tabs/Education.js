import React from 'react';
import { Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';

function Education() {
  const educationData = [
    {
      institution: 'University of Example',
      degree: 'Bachelor of Science in Computer Science',
      period: '2020 - 2024',
      gpa: '3.8/4.0',
      status: 'Completed',
      highlights: ['Data Structures & Algorithms', 'Software Engineering', 'Database Systems', 'Web Development']
    },
    {
      institution: 'Online Learning Platform',
      degree: 'Full Stack Development Certification',
      period: '2023 - 2024',
      gpa: 'Certificate',
      status: 'Completed',
      highlights: ['React.js', 'Node.js', 'MongoDB', 'RESTful APIs']
    }
  ];

  const skills = [
    { name: 'JavaScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'SQL', level: 75 },
    { name: 'Git/GitHub', level: 85 }
  ];

  return (
    <PageTemplate 
      title="Educational Background" 
      headerContent="My academic journey and continuous learning path"
      footerContent="Education is a lifelong journey of growth and discovery"
    >
      <Row>
        <Col>
          <Card className="mb-4" style={{ backgroundColor: '#e3f2fd', border: '1px solid #007bff' }}>
            <Card.Body>
              <Card.Title className="text-primary">Academic Philosophy</Card.Title>
              <Card.Text>
                I believe in combining theoretical knowledge with practical application. 
                My educational journey reflects a commitment to both formal learning and 
                continuous skill development in the ever-evolving tech landscape.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h4 className="text-success mb-3">Educational Timeline</h4>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {educationData.map((edu, index) => (
          <Col lg={6} key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Header style={{ backgroundColor: '#e8f5e8', border: 'none' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <strong className="text-success">{edu.institution}</strong>
                  <Badge bg={edu.status === 'Completed' ? 'success' : 'primary'}>
                    {edu.status}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title className="h5">{edu.degree}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{edu.period}</Card.Subtitle>
                <Card.Text>
                  <strong>GPA/Achievement:</strong> {edu.gpa}
                </Card.Text>
                <div>
                  <strong>Key Highlights:</strong>
                  <ul className="mt-2">
                    {edu.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col>
          <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #28a745' }}>
            <Card.Body>
              <Card.Title className="text-success">Technical Skills Progress</Card.Title>
              <Card.Text className="mb-3">
                Skills developed through education and practical experience:
              </Card.Text>
              {skills.map((skill, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span><strong>{skill.name}</strong></span>
                    <span>{skill.level}%</span>
                  </div>
                  <ProgressBar 
                    now={skill.level} 
                    variant={skill.level >= 85 ? 'success' : skill.level >= 75 ? 'info' : 'warning'}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageTemplate>
  );
}

export default Education;
