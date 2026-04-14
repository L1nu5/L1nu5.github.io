import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function Architecture() {
  const { theme } = useTheme();
  const arch = dataService.getArchitecture();
  const highlights = dataService.getArchitectureHighlights();
  const secrets = dataService.getArchitectureSecrets();

  const [diagramMeta, setDiagramMeta] = useState(null);
  const [diagramError, setDiagramError] = useState(false);

  useEffect(() => {
    fetch('/data/diagram-meta.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setDiagramMeta)
      .catch(() => setDiagramError(true));
  }, []);

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
  };

  const statusBadge = (status) => {
    if (status === 'active') return <Badge bg="success">Active</Badge>;
    if (status === 'planned') return <Badge bg="warning" text="dark">Planned</Badge>;
    return <Badge bg="secondary">{status}</Badge>;
  };

  return (
    <PageTemplate
      title="Portfolio Architecture"
      headerContent={arch.description}
      footerContent="Architecture diagram auto-generated from architecture.json on every deploy"
    >

      {/* Feature highlights */}
      <Row className="g-3 mb-4">
        {highlights.map((h, idx) => (
          <Col md={6} lg={4} key={idx}>
            <Card className="h-100 border-0 shadow-sm" style={{
              backgroundColor: theme.cardBackground,
              borderLeft: `4px solid ${theme.primaryColor} !important`,
              color: theme.textColor
            }}>
              <Card.Body>
                <div className="d-flex align-items-start gap-2">
                  <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{h.icon}</span>
                  <div>
                    <h6 className="mb-1" style={{ color: theme.primaryColor }}>{h.title}</h6>
                    <p className="mb-0 small" style={{ color: theme.mutedText }}>{h.description}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Architecture diagram */}
      <Row className="mb-4">
        <Col>
          <Card style={{
            backgroundColor: theme.cardBackground,
            border: `1px solid ${theme.primaryColor}`,
            color: theme.textColor
          }}>
            <Card.Header style={{ backgroundColor: theme.lightBlue, border: 'none' }}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0" style={{ color: theme.primaryColor }}>System Diagram</h5>
                <div className="d-flex align-items-center gap-2">
                  {diagramMeta && (
                    <small style={{ color: theme.mutedText }}>
                      Generated {formatDate(diagramMeta.generatedAt)}
                    </small>
                  )}
                  <Badge bg="secondary">Kroki.io · Mermaid</Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="text-center p-3" style={{ backgroundColor: theme.backgroundColor }}>
              {diagramError ? (
                <div className="py-5" style={{ color: theme.mutedText }}>
                  <div style={{ fontSize: '2rem' }}>🏗️</div>
                  <p className="mt-2 mb-0 small">
                    Diagram generates on first deploy. Push to main to trigger the GitHub Actions workflow.
                  </p>
                </div>
              ) : (
                <img
                  src="/images/architecture.svg"
                  alt="Portfolio architecture diagram"
                  style={{ maxWidth: '100%', height: 'auto' }}
                  onError={() => setDiagramError(true)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Security model */}
      <Row className="mb-4">
        <Col lg={7}>
          <Card style={{
            backgroundColor: theme.cardBackground,
            border: `1px solid ${theme.secondaryColor}`,
            color: theme.textColor
          }}>
            <Card.Header style={{ backgroundColor: theme.lightGreen, border: 'none' }}>
              <h5 className="mb-0" style={{ color: theme.secondaryColor }}>🔒 Secret Management</h5>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <p className="small mb-3" style={{ color: theme.mutedText }}>
                Every external API key is stored as a GitHub Actions secret and consumed server-side during CI.
                None are bundled into the React build or reachable via the browser network tab.
              </p>
              <ListGroup variant="flush">
                {secrets.map((s, idx) => (
                  <ListGroup.Item key={idx} className="px-0" style={{
                    backgroundColor: 'transparent',
                    borderColor: theme.borderColor,
                    color: theme.textColor
                  }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <code style={{ color: theme.primaryColor }}>{s.id}</code>
                        <p className="mb-1 small mt-1" style={{ color: theme.textColor }}>{s.description}</p>
                        <small style={{ color: theme.mutedText }}>{s.scope}</small>
                      </div>
                      <div className="ms-2 flex-shrink-0">
                        {statusBadge(s.status)}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Pipeline summary */}
        <Col lg={5}>
          <Card style={{
            backgroundColor: theme.cardBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor
          }}>
            <Card.Header style={{ backgroundColor: theme.lightBlue, border: 'none' }}>
              <h5 className="mb-0" style={{ color: theme.primaryColor }}>⚙️ CI/CD Pipeline</h5>
            </Card.Header>
            <Card.Body style={{ color: theme.textColor }}>
              <ListGroup variant="flush">
                {[
                  { step: '1', label: 'Trigger', detail: 'git push to main or weekly Sunday midnight UTC' },
                  { step: '2', label: 'Fetch Stats.fm', detail: 'Music stats via API — key from GitHub secrets' },
                  { step: '3', label: 'Generate Diagram', detail: 'architecture.json → Mermaid → Kroki → SVG' },
                  { step: '4', label: 'npm run build', detail: 'React compiles all JSON + SVG into static bundle' },
                  { step: '5', label: 'Deploy', detail: 'GitHub Pages serves the static bundle globally' },
                ].map((item) => (
                  <ListGroup.Item key={item.step} className="px-0 d-flex gap-3" style={{
                    backgroundColor: 'transparent',
                    borderColor: theme.borderColor,
                    color: theme.textColor
                  }}>
                    <Badge bg="primary" style={{ minWidth: '24px', height: '24px', lineHeight: '16px' }}>
                      {item.step}
                    </Badge>
                    <div>
                      <div style={{ color: theme.textColor, fontWeight: 600 }}>{item.label}</div>
                      <small style={{ color: theme.mutedText }}>{item.detail}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </PageTemplate>
  );
}

export default Architecture;
