import { cleanEnv } from 'envalid';
import { port, str } from 'envalid/dist/validators';

// Validate environment variables
export default cleanEnv(process.env, {
    DATABASE_URL: str(),
    FRONTEND_URL: str(),
    PORT: port(),
    TEST_PORT: port(),
    SESSION_SECRET: str(),
});