import React, { useState } from 'react';
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import triviaData from '../data/trivia.json';
import { useTheme } from '../contexts/ThemeContext';

const GRADES = [
  { min: 18, label: 'S', desc: 'Legendary. You basically ARE the setlist.',  color: '#ffd700' },
  { min: 15, label: 'A', desc: 'Superfan tier. You clearly pay attention.',   color: '#28a745' },
  { min: 12, label: 'B', desc: 'Solid knowledge. Not bad at all.',            color: '#007bff' },
  { min:  8, label: 'C', desc: "You've heard some tracks. Keep listening.",   color: '#fd7e14' },
  { min:  0, label: 'D', desc: 'Time to revisit the discography.',            color: '#dc3545' },
];

function getGrade(score) {
  return GRADES.find(g => score >= g.min) ?? GRADES[GRADES.length - 1];
}

const CATEGORY_COLORS = {
  'Eric Prydz':              '#6f42c1',
  'Concerts Attended':       '#007bff',
  'Ultra Music Festival 2023': '#dc3545',
  'Artist Facts':            '#28a745',
  "Abhishek's Favorites":    '#fd7e14',
};

export default function MusicTrivia() {
  const { theme } = useTheme();
  const questions = triviaData.questions;

  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState(null);
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const [answers,  setAnswers]  = useState([]);

  const q = questions[idx];

  function choose(optIdx) {
    if (selected !== null) return;
    const correct = optIdx === q.answer;
    setSelected(optIdx);
    setAnswers(prev => [...prev, { correct, chosen: optIdx, answer: q.answer }]);
    if (correct) setScore(s => s + 1);
  }

  function next() {
    if (idx + 1 >= questions.length) {
      setDone(true);
    } else {
      setIdx(i => i + 1);
      setSelected(null);
    }
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswers([]);
  }

  if (done) {
    const grade = getGrade(score);
    const pct   = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center" style={{ maxWidth: 540, margin: '2rem auto' }}>
        <Card className="border-0 shadow" style={{ backgroundColor: theme.cardBackground, color: theme.textColor }}>
          <Card.Body className="py-5">
            <div style={{ fontSize: '4rem', fontWeight: 700, color: grade.color, lineHeight: 1 }}>
              {grade.label}
            </div>
            <h4 className="mt-3 mb-1" style={{ color: theme.textColor }}>{score} / {questions.length}</h4>
            <p className="text-muted mb-4">{grade.desc}</p>
            <ProgressBar
              now={pct}
              style={{ height: 8, borderRadius: 4, backgroundColor: theme.lightBlue }}
              className="mb-4"
            >
              <ProgressBar now={pct} style={{ backgroundColor: grade.color }} />
            </ProgressBar>
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {answers.map((a, i) => (
                <span
                  key={i}
                  style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: a.correct ? '#28a74522' : '#dc354522',
                    border: `2px solid ${a.correct ? '#28a745' : '#dc3545'}`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700,
                    color: a.correct ? '#28a745' : '#dc3545',
                  }}
                >
                  {i + 1}
                </span>
              ))}
            </div>
            <Button variant="outline-primary" onClick={restart}>Play Again</Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const progress = ((idx) / questions.length) * 100;
  const catColor = CATEGORY_COLORS[q.category] ?? '#888';

  return (
    <div style={{ maxWidth: 580, margin: '1.5rem auto' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span style={{ fontSize: '0.78rem', color: theme.textColor, opacity: 0.5, letterSpacing: '0.05em' }}>
          {triviaData.title.toUpperCase()}
        </span>
        <span style={{ fontSize: '0.78rem', color: theme.textColor, opacity: 0.5 }}>
          {idx + 1} / {questions.length}
        </span>
      </div>
      <ProgressBar
        now={progress}
        style={{ height: 4, borderRadius: 2, backgroundColor: theme.lightBlue, marginBottom: '1.5rem' }}
      >
        <ProgressBar now={progress} style={{ backgroundColor: theme.primaryColor }} />
      </ProgressBar>

      {/* Question card */}
      <Card className="border-0 shadow-sm mb-3" style={{ backgroundColor: theme.cardBackground, color: theme.textColor }}>
        <Card.Body className="p-4">
          <Badge
            className="mb-3"
            style={{ backgroundColor: catColor + '22', color: catColor, fontWeight: 500, fontSize: '0.7rem' }}
          >
            {q.category}
          </Badge>
          <h5 style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem', color: theme.textColor }}>
            {q.question}
          </h5>

          <div className="d-grid gap-2">
            {q.options.map((opt, i) => {
              let variant = 'outline-secondary';
              let style   = { textAlign: 'left', fontSize: '0.9rem', transition: 'all 0.15s' };

              if (selected !== null) {
                if (i === q.answer) {
                  variant = 'success';
                  style = { ...style, background: '#28a74522', borderColor: '#28a745', color: '#28a745' };
                } else if (i === selected && selected !== q.answer) {
                  style = { ...style, background: '#dc354522', borderColor: '#dc3545', color: '#dc3545' };
                }
              }

              return (
                <Button
                  key={i}
                  variant={variant}
                  style={style}
                  onClick={() => choose(i)}
                  disabled={selected !== null && i !== q.answer && i !== selected}
                >
                  <span style={{ opacity: 0.4, marginRight: '0.75rem', fontSize: '0.8rem' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </Button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="mt-4 d-flex justify-content-between align-items-center">
              <span style={{ fontSize: '0.82rem', color: selected === q.answer ? '#28a745' : '#dc3545' }}>
                {selected === q.answer ? '✓ Correct' : `✗ The answer was: ${q.options[q.answer]}`}
              </span>
              <Button size="sm" variant="primary" onClick={next}>
                {idx + 1 === questions.length ? 'See Results' : 'Next →'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <div className="text-center">
        <span style={{ fontSize: '0.75rem', color: theme.textColor, opacity: 0.35 }}>
          Score: {score} · {questions.length - idx - 1} questions remaining
        </span>
      </div>
    </div>
  );
}
