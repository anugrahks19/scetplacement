const GRAPHQL_URL = 'http://localhost:4000/';

/**
 * Reusable utility to make requests to our GraphQL backend.
 */
async function graphqlRequest(query, variables = {}) {
    try {
        let token = localStorage.getItem('authToken');
        
        // DEV OVERRIDE: Force dummy token if it's missing or invalid
        if (!token || !token.endsWith('dummy_signature')) {
            const devHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const devPayload = btoa(JSON.stringify({ id: "teacher_001", role: "TEACHER", organizationId: "org_1" }));
            const devSignature = "dummy_signature";
            token = `${devHeader}.${devPayload}.${devSignature}`;
            localStorage.setItem('authToken', token);
        }

        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables
            })
        });

        const result = await response.json();
        
        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error(result.errors[0].message);
        }

        return result.data;
    } catch (error) {
        console.error('GraphQL Request Failed:', error);
        throw error;
    }
}
