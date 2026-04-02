/* global jest, describe, beforeEach, test, expect */
/* eslint-env jest */
/**
 * Tests unitaires pour le service educationApi.js
 * Requiert Jest configuré.
 */

import { educationApi } from '../services/educationApi';
import { supabase } from '../lib/customSupabaseClient';

// Mock Supabase invoke
jest.mock('../lib/customSupabaseClient', () => ({
  supabase: {
    functions: {
      invoke: jest.fn()
    }
  }
}));

describe('educationApi Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchEtablissements', () => {
    test('appelle la fonction Edge avec les bons paramètres', async () => {
      const params = { commune: 'Paris', limit: 10 };

      supabase.functions.invoke.mockResolvedValue({
        data: { success: true, results: [], meta: { count: 0 } },
        error: null
      });

      await educationApi.fetchEtablissements(params);

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
      expect(supabase.functions.invoke).toHaveBeenCalledWith('get-etablissements', {
        body: params
      });
    });

    test('retourne la data quand la fonction Edge répond en succès', async () => {
      const params = { commune: 'Paris', limit: 10 };
      const edgeResponse = {
        success: true,
        results: [{ uai: '0751234A', nom: 'Lycée X' }],
        meta: { count: 1, limit: 10, offset: 0 }
      };

      supabase.functions.invoke.mockResolvedValue({
        data: edgeResponse,
        error: null
      });

      const result = await educationApi.fetchEtablissements(params);

      expect(result).toEqual(edgeResponse);
      expect(result.success).toBe(true);
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.meta).toMatchObject({ count: 1 });
    });

    test('gère les erreurs renvoyées par Supabase (error non null)', async () => {
      supabase.functions.invoke.mockResolvedValue({
        data: null,
        error: { message: 'Network Error' }
      });

      const result = await educationApi.fetchEtablissements({ commune: 'Test' });

      expect(supabase.functions.invoke).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        success: false,
        error: 'Network Error'
      });
    });

    test('gère le cas où la fonction Edge répond avec success=false', async () => {
      supabase.functions.invoke.mockResolvedValue({
        data: { success: false, error: 'Accès refusé' },
        error: null
      });

      const result = await educationApi.fetchEtablissements({ commune: 'Paris' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Accès refusé');
    });

    test('gère une exception (invoke throw) proprement', async () => {
      supabase.functions.invoke.mockRejectedValue(new Error('Unexpected failure'));

      const result = await educationApi.fetchEtablissements({ commune: 'Paris' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unexpected failure');
    });

    test('envoie un body vide si params est undefined (robustesse)', async () => {
      supabase.functions.invoke.mockResolvedValue({
        data: { success: true, results: [] },
        error: null
      });

      await educationApi.fetchEtablissements();

      expect(supabase.functions.invoke).toHaveBeenCalledWith('get-etablissements', {
        body: {}
      });
    });
  });
});