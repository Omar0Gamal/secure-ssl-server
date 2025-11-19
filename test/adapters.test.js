import { describe, it, expect } from '@jest/globals';

describe('Multi-Framework Adapters', () => {
  describe('Module Exports', () => {
    it('should export createHttpsFastifyServer function', async () => {
      const { createHttpsFastifyServer } = await import('../src/adapters/fastify.js');
      expect(typeof createHttpsFastifyServer).toBe('function');
    });

    it('should export createHttpsKoaServer function', async () => {
      const { createHttpsKoaServer } = await import('../src/adapters/koa.js');
      expect(typeof createHttpsKoaServer).toBe('function');
    });

    it('should export createHttpsHapiServer function', async () => {
      const { createHttpsHapiServer } = await import('../src/adapters/hapi.js');
      expect(typeof createHttpsHapiServer).toBe('function');
    });
  });

  describe('Function Signatures', () => {
    it('fastify adapter should accept options and app', async () => {
      const { createHttpsFastifyServer } = await import('../src/adapters/fastify.js');
      expect(createHttpsFastifyServer.length).toBe(2);
    });

    it('koa adapter should accept options and app', async () => {
      const { createHttpsKoaServer } = await import('../src/adapters/koa.js');
      expect(createHttpsKoaServer.length).toBe(2);
    });

    it('hapi adapter should accept options and server', async () => {
      const { createHttpsHapiServer } = await import('../src/adapters/hapi.js');
      expect(createHttpsHapiServer.length).toBe(2);
    });
  });
});
