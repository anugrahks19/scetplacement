const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: 'mock-teacher-uuid', role: 'TEACHER', organizationId: 'mock-org-uuid' }, process.env.JWT_SECRET || 'dev-secret');

fetch('http://localhost:4000/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
        query: `mutation GeneratePool($topic: String!, $sourceContext: String!, $config: PoolGenerationConfig!) {
            generateFullQuestionPoolWithAi(topic: $topic, sourceContext: $sourceContext, config: $config)
        }`,
        variables: { topic: 'test', sourceContext: 'test', config: { mcqEasy: 1 } }
    })
}).then(r => r.json()).then(r => console.dir(r, {depth: null})).catch(console.error);
