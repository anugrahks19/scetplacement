const GRAPHQL_URL = 'http://localhost:4000/';

/**
 * Reusable utility to make requests to our GraphQL backend.
 */
async function graphqlRequest(query, variables = {}) {
    try {
        const token = localStorage.getItem('authToken');
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
