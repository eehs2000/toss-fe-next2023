import '@testing-library/jest-dom';
import { server } from './src/_tosslib/server/node';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterAll(() => {
  server.close();
});
