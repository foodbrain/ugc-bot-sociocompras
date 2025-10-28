import { describe, it, expect, vi } from 'vitest';
import { geminiService } from './geminiService';

describe('geminiService', () => {
  it('should have correct API methods', () => {
    // Test que el servicio tiene los métodos correctos
    expect(geminiService).toHaveProperty('enhanceBrandResearch');
    expect(geminiService).toHaveProperty('generateIdeas');
    expect(geminiService).toHaveProperty('generateScript');

    expect(typeof geminiService.enhanceBrandResearch).toBe('function');
    expect(typeof geminiService.generateIdeas).toBe('function');
    expect(typeof geminiService.generateScript).toBe('function');
  });

  // Test de integración - comentado para evitar llamadas a API en CI/CD
  it.skip('should return ideas from Gemini API (integration test)', async () => {
    const brandData = {
      brand_name: 'Test Brand',
      brand_domain: 'https://test.com',
      uvp: 'A test brand for testing purposes',
      audience: 'Testers',
      pain_points: 'Testing is hard',
    };

    const ideas = await geminiService.generateIdeas(brandData, 1);

    expect(Array.isArray(ideas)).toBe(true);
    expect(ideas.length).toBeGreaterThan(0);
    expect(ideas[0]).toHaveProperty('title');
    expect(ideas[0]).toHaveProperty('description');
    expect(ideas[0]).toHaveProperty('hook');
    expect(ideas[0]).toHaveProperty('viralPotential');
  });
});