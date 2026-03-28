import axios from 'axios';

// Create an Axios instance with default configurations
const client = axios.create({
    baseURL: 'https://api.example.com', // Replace with your API endpoint
    timeout: 1000, // Set a timeout if needed
    headers: {'X-Custom-Header': 'foobar'} // Custom headers
});

export default client;