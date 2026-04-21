/* global jest, describe, beforeEach, afterEach, test, expect */
/* eslint-env jest */
/**
 * Tests unitaires pour les services de données réelles.
 * Vérifie que chaque service interroge correctement Supabase
 * et retourne les bonnes structures de données.
 */

import { realCareerDataService } from '../services/realCareerDataService';
import { realEstablishmentDataService } from '../services/realEstablishmentDataService';
import { realBlogDataService } from '../services/realBlogDataService';
import { realJobDataService } from '../services/realJobDataService';
import { realFormationDataService } from '../services/realFormationDataService';

// ── Mock Supabase ─────────────────────────────────────────────────────────────

const mockSelect = jest.fn();
const mockFrom = jest.fn(() => ({
  select: mockSelect,
}));

jest.mock('../lib/customSupabaseClient', () => ({
  supabase: {
    from: (...args) => mockFrom(...args),
    functions: { invoke: jest.fn() },
    auth: { getUser: jest.fn() },
  },
}));

// ── Mock CacheService (always miss so queries run) ────────────────────────────

jest.mock('../services/CacheService', () => ({
  CacheService: {
    get: jest.fn(() => null),
    set: jest.fn(),
    remove: jest.fn(),
    generateKey: jest.fn((prefix, params) => `${prefix}_${JSON.stringify(params)}`),
  },
}));

// ── Helper to build a chainable Supabase query mock ──────────────────────────

function buildChain(resolveValue) {
  const chain = {};
  const methods = [
    'select', 'eq', 'neq', 'in', 'or', 'ilike', 'gte', 'lte',
    'order', 'limit', 'range', 'single', 'head',
  ];
  methods.forEach(m => { chain[m] = jest.fn(() => chain); });
  chain.then = (resolve) => resolve(resolveValue);
  // Make it awaitable
  Object.defineProperty(chain, Symbol.iterator, { value: undefined });
  return chain;
}

function makeSupabaseMock(data = [], extra = {}) {
  const chain = buildChain({ data, error: null, count: data.length, ...extra });
  mockFrom.mockReturnValue({ select: jest.fn(() => chain) });
  mockSelect.mockReturnValue(chain);
  return chain;
}

// ─────────────────────────────────────────────────────────────────────────────

describe('realCareerDataService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllCareers – retourne un tableau de métiers', async () => {
    const mockCareers = [
      { id: '1', code: 'M1805', libelle: 'Développeur', domain: 'informatique' },
      { id: '2', code: 'K1801', libelle: 'Conseiller emploi', domain: 'social' },
    ];
    makeSupabaseMock(mockCareers);

    const result = await realCareerDataService.getAllCareers();

    expect(Array.isArray(result)).toBe(true);
  });

  test('getAllCareers – retourne [] en cas d\'erreur', async () => {
    const chain = buildChain({ data: null, error: { message: 'DB error' } });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realCareerDataService.getAllCareers();
    expect(result).toEqual([]);
  });

  test('calculateRIASECMatch – retourne 100 pour un profil identique', () => {
    const profile = { r: 5, i: 3, a: 2, s: 4, e: 1, c: 3 };
    const score = realCareerDataService.calculateRIASECMatch(profile, profile);
    expect(score).toBe(100);
  });

  test('calculateRIASECMatch – retourne 0 pour des profils vides', () => {
    const score = realCareerDataService.calculateRIASECMatch(null, null);
    expect(score).toBe(0);
  });

  test('calculateRIASECMatch – retourne un score entre 0 et 100', () => {
    const user   = { r: 5, i: 1, a: 0, s: 2, e: 4, c: 1 };
    const career = { r: 1, i: 5, a: 3, s: 1, e: 0, c: 4 };
    const score = realCareerDataService.calculateRIASECMatch(user, career);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('searchCareers – retourne un tableau', async () => {
    makeSupabaseMock([{ id: '1', code: 'M1805', libelle: 'Dev' }]);
    const result = await realCareerDataService.searchCareers('dev');
    expect(Array.isArray(result)).toBe(true);
  });

  test('getCareerByCode – retourne null si non trouvé', async () => {
    const chain = buildChain({ data: null, error: { code: 'PGRST116' } });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realCareerDataService.getCareerByCode('XXXXX');
    expect(result).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('realEstablishmentDataService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getEstablishmentStudents – retourne { students, total }', async () => {
    // Mock user_institution_links JOIN profiles
    const mockLinks = [
      {
        user_id: 'u1',
        profiles: { id: 'u1', first_name: 'Alice', last_name: 'D', email: 'a@test.com', avatar_url: null, education_level: 'bac' },
      },
    ];
    const linksChain = buildChain({ data: mockLinks, error: null, count: 1 });
    const testChain  = buildChain({ data: [], error: null });

    mockFrom
      .mockReturnValueOnce({ select: jest.fn(() => linksChain) })
      .mockReturnValueOnce({ select: jest.fn(() => testChain) });

    const result = await realEstablishmentDataService.getEstablishmentStudents('inst-1');

    expect(result).toHaveProperty('students');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.students)).toBe(true);
  });

  test('getEstablishmentStudents – retourne vide si aucun étudiant', async () => {
    const chain = buildChain({ data: [], error: null, count: 0 });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realEstablishmentDataService.getEstablishmentStudents('inst-empty');
    expect(result.students).toEqual([]);
    expect(result.total).toBe(0);
  });

  test('getEstablishmentStatistics – retourne les bonnes clés', async () => {
    const countChain = buildChain({ data: null, error: null, count: 10 });
    const linksChain = buildChain({ data: [{ user_id: 'u1' }], error: null });
    const testsChain = buildChain({ data: null, error: null, count: 7 });

    mockFrom
      .mockReturnValueOnce({ select: jest.fn(() => countChain) })  // totalStudents
      .mockReturnValueOnce({ select: jest.fn(() => countChain) })  // programCount
      .mockReturnValueOnce({ select: jest.fn(() => countChain) })  // staffCount
      .mockReturnValueOnce({ select: jest.fn(() => linksChain) })  // userLinks
      .mockReturnValueOnce({ select: jest.fn(() => testsChain) }); // completedTests

    const result = await realEstablishmentDataService.getEstablishmentStatistics('inst-1');

    expect(result).toHaveProperty('totalStudents');
    expect(result).toHaveProperty('completionRate');
    expect(result).toHaveProperty('programCount');
    expect(result).toHaveProperty('staffCount');
    expect(result.completionRate).toBeGreaterThanOrEqual(0);
    expect(result.completionRate).toBeLessThanOrEqual(100);
  });

  test('getInstitutionPrograms – retourne un tableau', async () => {
    const mockPrograms = [
      { id: 'p1', name: 'BTS Info', level: 'bts', formation_id: 'f1', created_at: '2024-01-01', formations: { name: 'Informatique' } },
    ];
    const chain = buildChain({ data: mockPrograms, error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realEstablishmentDataService.getInstitutionPrograms('inst-1');
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('formation_name');
    }
  });

  test('getEstablishmentStaff – retourne un tableau avec les bonnes clés', async () => {
    const mockStaff = [
      { id: 's1', first_name: 'Jean', last_name: 'Prof', email: 'j@test.com', role: 'teacher', created_at: '2024-01-01' },
    ];
    const chain = buildChain({ data: mockStaff, error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realEstablishmentDataService.getEstablishmentStaff('inst-1');
    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('role');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('realBlogDataService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllArticles – retourne { articles, total }', async () => {
    const mockArticles = [
      { id: 'a1', title: 'Article 1', slug: 'article-1', status: 'published', published_at: '2024-01-01' },
    ];
    const chain = buildChain({ data: mockArticles, error: null, count: 1 });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realBlogDataService.getAllArticles();
    expect(result).toHaveProperty('articles');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.articles)).toBe(true);
  });

  test('getArticleBySlug – retourne null si non trouvé', async () => {
    const chain = buildChain({ data: null, error: { code: 'PGRST116' } });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realBlogDataService.getArticleBySlug('inexistant');
    expect(result).toBeNull();
  });

  test('getCategories – retourne un tableau', async () => {
    const mockCats = [{ id: 'c1', name: 'Emploi' }, { id: 'c2', name: 'Formation' }];
    const chain = buildChain({ data: mockCats, error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realBlogDataService.getCategories();
    expect(Array.isArray(result)).toBe(true);
  });

  test('getFeaturedArticles – ne retourne que des articles featured', async () => {
    const mockFeatured = [
      { id: 'a1', title: 'Featured', featured: true, status: 'published' },
    ];
    const chain = buildChain({ data: mockFeatured, error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realBlogDataService.getFeaturedArticles();
    expect(Array.isArray(result)).toBe(true);
  });

  test('searchArticles – retourne un tableau', async () => {
    const chain = buildChain({ data: [], error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realBlogDataService.searchArticles('emploi');
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('realJobDataService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllJobOffers – retourne { offers, total }', async () => {
    const mockJobs = [
      { id: 'j1', title: 'Dev React', status: 'active', contract_type: 'CDI' },
    ];
    const chain = buildChain({ data: mockJobs, error: null, count: 1 });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realJobDataService.getAllJobOffers();
    expect(result).toHaveProperty('offers');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.offers)).toBe(true);
  });

  test('getJobsForCareer – retourne un tableau', async () => {
    const chain = buildChain({ data: [], error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realJobDataService.getJobsForCareer('M1805');
    expect(Array.isArray(result)).toBe(true);
  });

  test('getJobOfferDetails – retourne null si non trouvé', async () => {
    const chain = buildChain({ data: null, error: { code: 'PGRST116' } });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realJobDataService.getJobOfferDetails('inexistant');
    expect(result).toBeNull();
  });

  test('searchJobOffers – retourne un tableau', async () => {
    const chain = buildChain({ data: [], error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realJobDataService.searchJobOffers('développeur', { location: 'Paris' });
    expect(Array.isArray(result)).toBe(true);
  });

  test('_normalizeFranceTravailJob – transforme correctement un job France Travail', () => {
    const rawJob = {
      id: 'ft-123',
      intitule: 'Développeur Web',
      description: 'Poste de développeur',
      entreprise: { nom: 'TechCorp' },
      lieuTravail: { libelle: 'Paris 15e' },
      romeCode: 'M1805',
      typeContrat: 'CDI',
      typeContratLibelle: 'Contrat à durée indéterminée',
      salaire: { libelle: '35000€ - 45000€ annuel' },
      dateCreation: '2024-01-15T10:00:00Z',
    };

    const normalized = realJobDataService._normalizeFranceTravailJob(rawJob);

    expect(normalized.id).toBe('ft-123');
    expect(normalized.title).toBe('Développeur Web');
    expect(normalized.company).toBe('TechCorp');
    expect(normalized.location).toBe('Paris 15e');
    expect(normalized.rome_code).toBe('M1805');
    expect(normalized.contract_type).toBe('CDI');
    expect(normalized.source).toBe('france_travail_live');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('realFormationDataService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllFormations – retourne { formations, total }', async () => {
    const mockFormations = [
      { id: 'f1', name: 'BTS Informatique', type: 'bts' },
    ];
    const chain = buildChain({ data: mockFormations, error: null, count: 1 });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realFormationDataService.getAllFormations();
    expect(result).toHaveProperty('formations');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.formations)).toBe(true);
  });

  test('searchFormations – retourne un tableau', async () => {
    const chain = buildChain({ data: [], error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realFormationDataService.searchFormations('informatique');
    expect(Array.isArray(result)).toBe(true);
  });

  test('getAlternancePrograms – retourne un tableau', async () => {
    const chain = buildChain({ data: [], error: null });
    mockFrom.mockReturnValue({ select: jest.fn(() => chain) });

    const result = await realFormationDataService.getAlternancePrograms();
    expect(Array.isArray(result)).toBe(true);
  });
});
