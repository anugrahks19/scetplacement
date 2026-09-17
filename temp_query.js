const query = `query {
  me { cgpa placementReadiness eligibilityStatus attempts { id status mcqScore codingScore totalScore completedAt assessmentId } }
  studentAnalytics(studentId: "student_001") { readinessScore componentScores { mcq coding overall } }
}`;
const token = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64') + '.' + Buffer.from(JSON.stringify({id: 'student_001', role: 'STUDENT', organizationId: 'org_scet_001'})).toString('base64') + '.dummy_signature';
fetch('http://localhost:4000/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ query })
}).then(res => res.json()).then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.error(err));
