import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators';

// Validate environment variables
export default cleanEnv(process.env, {
    DATABASE_URL: str(),
    GOOGLE_CLIENT_ID: str(),
    SESSION_SECRET: str(),
    FRONTEND_URL: str(),
    PORT: port(),
    TEST_PORT: port(),
});