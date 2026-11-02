def create_resume():
    stream_content = """BT
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
ET"""

    stream_bytes = stream_content.encode('latin1')
    length = len(stream_bytes)

    header = b"%PDF-1.4\n"
    
    obj1 = b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    obj2 = b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    obj3 = b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
    obj4 = f"4 0 obj\n<< /Length {length} >>\nstream\n".encode('latin1') + stream_bytes + b"\nendstream\nendobj\n"
    obj5 = b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n"

    offset1 = len(header)
    offset2 = offset1 + len(obj1)
    offset3 = offset2 + len(obj2)
    offset4 = offset3 + len(obj3)
    offset5 = offset4 + len(obj4)
    xref_offset = offset5 + len(obj5)

    xref = f"""xref
0 6
0000000000 65535 f 
{offset1:010d} 00000 n 
{offset2:010d} 00000 n 
{offset3:010d} 00000 n 
{offset4:010d} 00000 n 
{offset5:010d} 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
{xref_offset}
%%EOF
""".encode('latin1')

    pdf_data = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref

    with open('public/resume.pdf', 'wb') as f:
        f.write(pdf_data)
    
    import os
    if os.path.exists('out'):
        with open('out/resume.pdf', 'wb') as f:
            f.write(pdf_data)

    print(f"Updated resume.pdf successfully ({len(pdf_data)} bytes)")

if __name__ == '__main__':
    create_resume()
