fetch('http://localhost:4000/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'user_123', 'X-Organization-Id': 'org_123' },
    body: JSON.stringify({
        query: `mutation GeneratePool($topic: String!, $sourceContext: String!, $config: PoolGenerationConfig!) {
            generateFullQuestionPoolWithAi(topic: $topic, sourceContext: $sourceContext, config: $config)
        }`,
        variables: { topic: 'test', sourceContext: 'test', config: { mcqEasy: 1 } }
    })
}).then(r => r.json()).then(r => console.dir(r, {depth: null})).catch(console.error);
