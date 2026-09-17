const GRAPHQL_URL = 'http://localhost:4000/';

/**
 * Reusable utility to make requests to our GraphQL backend.
 * Hardcodes auth headers for the prototype.
 */
async function graphqlRequest(query, variables = {}) {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Hardcoded auth for the prototype backend
                'Authorization': 'user_123',
                'X-Organization-Id': 'org_123'
            },
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
