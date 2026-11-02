const fs = require('fs');
const path = require('path');

const streamContent = `BT
/F1 22 Tf
50 740 Td
(BEZALEEL PAUL N) Tj
/F1 11 Tf
0 -22 Td
(Software Developer | Flutter | Full-Stack | AI/ML) Tj
0 -15 Td
(Bangalore, India | bezaleel321@gmail.com | Projects Archive: bezaleelpaul.github.io/projects) Tj
0 -14 Td
(GitHub: github.com/BezaleelPaul | LinkedIn: linkedin.com/in/bezaleel-pauln | X: x.com/BezaleelPaul1) Tj
0 -26 Td
/F1 13 Tf
(EDUCATION) Tj
/F1 10 Tf
0 -16 Td
(CMR University - B.Tech in Computer Science and Engineering (2025 - 2029)) Tj
0 -13 Td
(IIT Madras - BS in Data Science and Applications (2026 - Present)) Tj
0 -24 Td
/F1 13 Tf
(EXPERIENCE & LEADERSHIP) Tj
/F1 10 Tf
0 -16 Td
(IEEE Student Branch - IEEE EXCOM Member & Webmaster (2025 - 2026)) Tj
0 -13 Td
(Software Engineering & Open Source Contributor (2025 - Present)) Tj
0 -24 Td
/F1 13 Tf
(CORE PROJECTS (Full Catalog & Live Demos: bezaleelpaul.github.io/projects)) Tj
/F1 10 Tf
0 -16 Td
(1. NADICARE Twin Engine: AI Digital Twin for cardiac load and recovery (Python, XGBoost, Streamlit)) Tj
0 -13 Td
(2. Mise File Organizer: Disk intelligence workstation with selective undo (Flutter, Dart, Python)) Tj
0 -13 Td
(3. BESCOM Calculator: Official tariff slab electricity calculator (HTML, CSS, JavaScript)) Tj
0 -13 Td
(4. Maclaurin Visualizer: Interactive Taylor & Maclaurin series convergence engine (Canvas, JS)) Tj
0 -24 Td
/F1 13 Tf
(TECHNICAL SKILLS) Tj
/F1 10 Tf
0 -16 Td
(Languages: Python, Dart, JavaScript, TypeScript, C/C++, SQL, HTML5/CSS3) Tj
0 -13 Td
(Frameworks: Flutter, React, Next.js, FastAPI, TensorFlow, XGBoost, Streamlit) Tj
0 -13 Td
(Developer Tools: Git, GitHub Actions CI/CD, Docker, Linux, Firebase, WebGL/Three.js) Tj
0 -24 Td
/F1 13 Tf
(COMPETITIVE PROGRAMMING & METRICS) Tj
/F1 10 Tf
0 -16 Td
(LeetCode: 270+ Solved | Codeforces: Rating 959 | 34 Public Repositories | Active Streak) Tj
ET`;

const streamBytes = Buffer.from(streamContent, 'latin1');
const length = streamBytes.length;

const header = Buffer.from('%PDF-1.4\n', 'latin1');
const obj1 = Buffer.from('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n', 'latin1');
const obj2 = Buffer.from('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n', 'latin1');
const obj3 = Buffer.from('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n', 'latin1');
const obj4 = Buffer.concat([
  Buffer.from(`4 0 obj\n<< /Length ${length} >>\nstream\n`, 'latin1'),
  streamBytes,
  Buffer.from('\nendstream\nendobj\n', 'latin1')
]);
const obj5 = Buffer.from('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n', 'latin1');

const offset1 = header.length;
const offset2 = offset1 + obj1.length;
const offset3 = offset2 + obj2.length;
const offset4 = offset3 + obj3.length;
const offset5 = offset4 + obj4.length;
const xrefOffset = offset5 + obj5.length;

const pad = n => String(n).padStart(10, '0');

const xref = Buffer.from(`xref
0 6
0000000000 65535 f 
${pad(offset1)} 00000 n 
${pad(offset2)} 00000 n 
${pad(offset3)} 00000 n 
${pad(offset4)} 00000 n 
${pad(offset5)} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF
`, 'latin1');

const pdfData = Buffer.concat([header, obj1, obj2, obj3, obj4, obj5, xref]);

fs.writeFileSync(path.join(__dirname, '..', 'public', 'resume.pdf'), pdfData);
if (fs.existsSync(path.join(__dirname, '..', 'out'))) {
  fs.writeFileSync(path.join(__dirname, '..', 'out', 'resume.pdf'), pdfData);
}

console.log('Successfully regenerated resume.pdf with exact years:', pdfData.length);
