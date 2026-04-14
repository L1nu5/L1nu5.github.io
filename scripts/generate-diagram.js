const fs = require('fs');
const path = require('path');
const https = require('https');

const ARCHITECTURE_JSON = path.join(__dirname, '..', 'portfolio', 'src', 'data', 'architecture.json');
const OUTPUT_SVG = path.join(__dirname, '..', 'portfolio', 'public', 'images', 'architecture.svg');
const OUTPUT_META = path.join(__dirname, '..', 'portfolio', 'public', 'data', 'diagram-meta.json');
const KROKI_URL = 'https://kroki.io/mermaid/svg';

// Build Mermaid flowchart source from architecture.json
function buildMermaidSource(arch) {
  const lines = [];

  // Theme configuration
  lines.push("%%{init: {'theme': 'base', 'themeVariables': {");
  lines.push("  'primaryColor': '#e3f2fd',");
  lines.push("  'primaryTextColor': '#1a1a1a',");
  lines.push("  'primaryBorderColor': '#007bff',");
  lines.push("  'lineColor': '#6c757d',");
  lines.push("  'secondaryColor': '#e8f5e8',");
  lines.push("  'tertiaryColor': '#f8f9fa',");
  lines.push("  'clusterBkg': '#f8f9fa',");
  lines.push("  'clusterBorder': '#dee2e6'");
  lines.push("}}}%%");
  lines.push('flowchart TB');

  // Build a lookup of node id → layer id for intra-layer edge detection
  const nodeLayer = {};
  arch.layers.forEach(layer => {
    layer.nodes.forEach(node => {
      nodeLayer[node.id] = layer.id;
    });
  });

  // Emit each layer as a subgraph
  arch.layers.forEach(layer => {
    lines.push(`    subgraph ${layer.id}["${layer.icon} ${layer.label} — ${layer.sublabel}"]`);
    lines.push('        direction TB');

    layer.nodes.forEach(node => {
      const label = buildNodeLabel(node);
      if (node.status === 'planned') {
        lines.push(`        ${node.id}(["${label}"])`);
      } else {
        lines.push(`        ${node.id}["${label}"]`);
      }
    });

    lines.push('    end');
    lines.push('');
  });

  // Emit all edges
  arch.edges.forEach(edge => {
    const fromLayer = nodeLayer[edge.from];
    const toLayer = nodeLayer[edge.to];
    const arrow = fromLayer !== toLayer ? ' ==>' : ' -->';
    lines.push(`    ${edge.from}${arrow}${edge.to}`);
  });

  lines.push('');

  // Style planned nodes with dashed border
  const plannedNodes = arch.layers
    .flatMap(l => l.nodes)
    .filter(n => n.status === 'planned')
    .map(n => n.id);

  if (plannedNodes.length > 0) {
    lines.push('    classDef planned fill:#fff9e6,stroke:#ffc107,stroke-dasharray:5 5,color:#856404');
    plannedNodes.forEach(id => lines.push(`    ${id}:::planned`));
  }

  return lines.join('\n');
}

function buildNodeLabel(node) {
  const parts = [node.label];
  if (node.sublabel) parts.push(node.sublabel);
  if (node.secret) parts.push(`🔒 ${node.secret}`);
  if (node.status === 'planned') parts.push('(planned)');
  // Escape any double quotes inside label text
  return parts.join('\\n').replace(/"/g, '#quot;');
}

// POST Mermaid source to Kroki and get back SVG
function fetchSvgFromKroki(mermaidSource) {
  return new Promise((resolve, reject) => {
    const bodyBuffer = Buffer.from(mermaidSource, 'utf8');
    const urlObj = new URL(KROKI_URL);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': bodyBuffer.length,
        'Accept': 'image/svg+xml',
        'User-Agent': 'GitHub-Actions-Portfolio-Diagram/1.0'
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`Kroki returned HTTP ${res.statusCode}:\n${body.slice(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request to Kroki timed out after 30s'));
    });

    req.write(bodyBuffer);
    req.end();
  });
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

async function main() {
  console.log('Architecture Diagram Generator');
  console.log('================================');

  // Read architecture.json
  if (!fs.existsSync(ARCHITECTURE_JSON)) {
    console.error(`Error: ${ARCHITECTURE_JSON} not found`);
    process.exit(1);
  }

  const arch = JSON.parse(fs.readFileSync(ARCHITECTURE_JSON, 'utf8'));
  console.log(`Loaded architecture: ${arch.layers.length} layers, ${arch.edges.length} edges`);

  // Build Mermaid source
  const mermaidSource = buildMermaidSource(arch);
  console.log('\nGenerated Mermaid source:');
  console.log('---');
  console.log(mermaidSource);
  console.log('---');

  // Call Kroki
  console.log('\nSending to Kroki.io...');
  const svg = await fetchSvgFromKroki(mermaidSource);
  console.log(`✓ Received SVG (${svg.length} bytes)`);

  // Write SVG output
  ensureDir(OUTPUT_SVG);
  fs.writeFileSync(OUTPUT_SVG, svg, 'utf8');
  console.log(`✓ Saved SVG to: ${OUTPUT_SVG}`);

  // Write metadata
  ensureDir(OUTPUT_META);
  const meta = {
    generatedAt: new Date().toISOString(),
    diagramType: 'mermaid',
    renderer: 'kroki.io',
    layers: arch.layers.length,
    nodes: arch.layers.reduce((sum, l) => sum + l.nodes.length, 0),
    edges: arch.edges.length
  };
  fs.writeFileSync(OUTPUT_META, JSON.stringify(meta, null, 2), 'utf8');
  console.log(`✓ Saved metadata to: ${OUTPUT_META}`);

  console.log('\n✓ Architecture diagram generated successfully');
}

if (require.main === module) {
  main().catch(err => {
    console.error(`\nFatal error: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { buildMermaidSource, buildNodeLabel };
