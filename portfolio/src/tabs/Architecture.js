import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
import PageTemplate from '../components/PageTemplate';
import dataService from '../services/dataService';
import { useTheme } from '../contexts/ThemeContext';

function Architecture() {
  const { theme } = useTheme();
  const arch = dataService.getArchitecture();
  const highlights = dataService.getArchitectureHighlights();

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

  const pipelineSteps = [
    { icon: '🔔', label: 'Trigger',        detail: 'push to main · weekly schedule', color: '#6c757d'          },
    { icon: '🎵', label: 'Stats.fm',       detail: 'music stats · top artists',      color: theme.primaryColor  },
    { icon: '🎸', label: 'Enrich Events',  detail: 'Setlist.fm · Ticketmaster · Deezer', color: theme.secondaryColor },
    { icon: '🏗️', label: 'Gen Diagram',   detail: 'architecture.json → Kroki → SVG', color: '#6f42c1'          },
    { icon: '⚛️', label: 'Build',          detail: 'React → static bundle',           color: '#17a2b8'          },
    { icon: '🚀', label: 'Deploy',         detail: 'GitHub Pages CDN',                color: '#28a745'          },
  ];

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

      {/* CI/CD Pipeline */}
      <Row className="mb-4">
        <Col>
          <Card style={{
            backgroundColor: theme.cardBackground,
            border: `1px solid ${theme.borderColor}`,
            color: theme.textColor
          }}>
            <Card.Header style={{ backgroundColor: theme.lightBlue, border: 'none' }}>
              <h5 className="mb-0" style={{ color: theme.primaryColor }}>⚙️ CI/CD Pipeline</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto', padding: '8px 4px', gap: 0 }}>
                {pipelineSteps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div style={{
                      flex: '1',
                      minWidth: '110px',
                      border: `1.5px solid ${step.color}40`,
                      borderRadius: '10px',
                      padding: '14px 10px',
                      backgroundColor: `${step.color}0d`,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{step.icon}</span>
                      <span style={{ fontWeight: 700, color: step.color, fontSize: '0.82rem', lineHeight: 1.2 }}>
                        {step.label}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: theme.mutedText, lineHeight: 1.3 }}>
                        {step.detail}
                      </span>
                    </div>
                    {idx < pipelineSteps.length - 1 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 6px',
                        color: theme.mutedText,
                        fontSize: '1.1rem',
                        flexShrink: 0,
                        userSelect: 'none'
                      }}>→</div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </PageTemplate>
  );
}

export default Architecture;
