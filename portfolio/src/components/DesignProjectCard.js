import React, { useState } from 'react';
import { Card, Badge, Button, Accordion } from 'react-bootstrap';

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

        <div className="mb-3">
          {project.technologies.map((tech, idx) => (
            <Badge key={idx} bg="outline-secondary" className="me-1 mb-1">{tech}</Badge>
          ))}
        </div>

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
                  {project.drawbacks.map((item, idx) => (
                    <div key={idx} className="mt-2 p-2 rounded small" style={{ backgroundColor: theme.lightBlue }}>
                      <div className="mb-1" style={{ color: theme.textColor }}><strong>Issue: </strong>{item.issue}</div>
                      <div style={{ color: theme.mutedText }}><strong>Mitigation: </strong>{item.mitigation}</div>
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

        {(project.githubUrl || project.liveUrl) && (
          <div className="d-flex gap-2 mt-3">
            {project.githubUrl && <Button variant="outline-primary" size="sm" href={project.githubUrl} target="_blank">GitHub</Button>}
            {project.liveUrl  && <Button variant="outline-success" size="sm" href={project.liveUrl}   target="_blank">Live</Button>}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default DesignProjectCard;
