import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, AlertCircle, Plus, Key, Building2, Briefcase, GraduationCap, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import JobCard from '@/components/job-explorer/JobCard';
import JobCardSkeleton from '@/components/job-explorer/JobCardSkeleton';
import CompanyCard from '@/components/job-explorer/CompanyCard';
import CompanySectorFilter, { SECTORS } from '@/components/job-explorer/CompanySectorFilter';
import EnhancedJobFilters from '@/components/job-explorer/EnhancedJobFilters';
import ResultsSummary from '@/components/job-explorer/ResultsSummary';
import Pagination from '@/components/job-explorer/Pagination';
import useJobFilters from '@/hooks/useJobFilters';
import useCompanySearch from '@/hooks/useCompanySearch';
import useAlternanceSearch from '@/hooks/useAlternanceSearch';
import { useDebounce } from '@/hooks/useDebounce';

const LBB_CONTRACT_OPTIONS = [
  { value: 'all',        label: 'Tous types' },
  { value: 'dpae',       label: 'CDI / CDD' },
  { value: 'alternance', label: 'Alternance uniquement' },
];

const JobExplorer = ({ onNavigate }) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('offers');

  // Company-search-specific filters (La Bonne Boîte)
  const [sectorId, setSectorId] = useState('all');
  const [lbbContract, setLbbContract] = useState('all');
  const selectedSector = SECTORS.find((s) => s.id === sectorId) ?? SECTORS[0];

  // Alternance sector filter (reuses the same SECTORS list)
  const [altSectorId, setAltSectorId] = useState('all');
  const selectedAltSector = SECTORS.find((s) => s.id === altSectorId) ?? SECTORS[0];

  const {
    filters, searchQuery, setSearchQuery, updateFilter, handleFilterChange,
    resetFilters, jobs, loading, error, fetchJobs,
    totalCount, filteredCount, totalPages, setPage,
  } = useJobFilters();

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Company search — La Bonne Boîte (only active when companies tab is open)
  const {
    companies, loading: companiesLoading, error: companiesError,
    total: companiesTotal, page: companiesPage, totalPages: companiesTotalPages, goToPage,
  } = useCompanySearch({
    location: activeTab === 'companies' ? filters.location : null,
    romeCodes: selectedSector.romes,
    contract: lbbContract,
    distance: filters.radius ?? 30,
  });

  // Alternance search — La Bonne Alternance (only active when alternance tab is open)
  const {
    jobs: altJobs, recruiters: altRecruiters,
    loading: altLoading, error: altError,
    total: altTotal, page: altPage, totalPages: altTotalPages, goToPage: altGoToPage,
  } = useAlternanceSearch({
    location: activeTab === 'alternance' ? filters.location : null,
    romeCodes: selectedAltSector.romes,
    distance: filters.radius ?? 30,
  });

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'offers') {
      fetchJobs();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // fetchJobs is a useCallback([filters]) — it changes whenever filters change,
    // which is exactly when we want to re-run the search.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchJobs, activeTab]);

  const isGeoActive = filters.location && filters.radius !== null;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      {/* ── Sticky header: search bar + tabs ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-5 max-w-7xl">
          {/* Search row */}
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
              <Input
                placeholder="Rechercher un métier, une compétence..."
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              size="lg"
              className="h-11 w-full md:w-auto px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-200 transition-all"
              onClick={() => fetchJobs()}
            >
              Rechercher
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-3 -mb-px">
            <TabButton
              active={activeTab === 'offers'}
              onClick={() => setActiveTab('offers')}
              icon={<Briefcase className="w-4 h-4" />}
              label="Offres publiées"
              count={activeTab === 'offers' && totalCount > 0 ? totalCount : null}
              countColor="rose"
            />
            <TabButton
              active={activeTab === 'companies'}
              onClick={() => setActiveTab('companies')}
              icon={<Building2 className="w-4 h-4" />}
              label="Candidatures spontanées"
              count={activeTab === 'companies' && companiesTotal > 0 ? companiesTotal : null}
              countColor="indigo"
            />
            <TabButton
              active={activeTab === 'alternance'}
              onClick={() => setActiveTab('alternance')}
              icon={<GraduationCap className="w-4 h-4" />}
              label="Alternance"
              count={activeTab === 'alternance' && altTotal > 0 ? altTotal : null}
              countColor="violet"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar: shared location/radius filters ── */}
          <EnhancedJobFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            resetFilters={resetFilters}
            onSearch={() => activeTab === 'offers' ? fetchJobs() : null}
          />

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* ─── OFFERS TAB ─── */}
            {activeTab === 'offers' && (
              <>
                {!loading && totalCount > 0 && (
                  <ResultsSummary
                    totalResults={totalCount}
                    filteredResults={filteredCount}
                    filters={filters}
                    onClearRadius={() => updateFilter('radius', null)}
                  />
                )}
                {loading && jobs.length === 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3, 4].map((i) => <JobCardSkeleton key={i} />)}
                  </div>
                ) : error === 'credentials_missing' ? (
                  <WarningCard icon={<Key className="h-8 w-8 text-amber-500" />} title="Service en cours de configuration" color="amber">
                    Les offres sont fournies par <strong>France Travail</strong>. Configurez{' '}
                    <code className="bg-slate-100 px-1 rounded text-xs">FRANCE_TRAVAIL_CLIENT_ID</code> et{' '}
                    <code className="bg-slate-100 px-1 rounded text-xs">FRANCE_TRAVAIL_SECRET</code> dans les secrets Supabase.
                  </WarningCard>
                ) : error === 'auth_failed' || error === 'api_error_401' || error === 'api_error_403' ? (
                  <WarningCard icon={<Key className="h-8 w-8 text-amber-500" />} title="Identifiants invalides ou API non souscrite" color="amber">
                    Vérifiez vos identifiants et l'abonnement à l'<strong>API Offres d'emploi v2</strong> sur francetravail.io.
                  </WarningCard>
                ) : error ? (
                  <WarningCard icon={<AlertCircle className="h-8 w-8 text-red-400" />} title="Erreur" color="red">
                    {error}
                    <Button onClick={() => fetchJobs()} variant="outline" size="sm" className="mt-3 border-red-200 text-red-700">Réessayer</Button>
                  </WarningCard>
                ) : jobs.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      {jobs.map((job) => (
                        <JobCard
                          key={job.id} job={job}
                          onViewOffer={() => onNavigate(`/job/${job.id}`, { job })}
                          onClick={() => onNavigate(`/job/${job.id}`, { job })}
                          onToggleSave={() => toast({ title: 'Fonctionnalité à venir', description: 'La sauvegarde sera bientôt disponible.' })}
                        />
                      ))}
                    </div>
                    <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                ) : (
                  <EmptyOffers
                    isGeo={isGeoActive} radius={filters.radius}
                    onExpand={() => {
                      const cur = Number(filters.radius ?? 0);
                      updateFilter('radius', cur < 5 ? 10 : cur < 10 ? 25 : cur < 25 ? 50 : cur < 50 ? 100 : null);
                    }}
                    onReset={resetFilters}
                  />
                )}
              </>
            )}

            {/* ─── ALTERNANCE TAB (La Bonne Alternance) ─── */}
            {activeTab === 'alternance' && (
              <AlternanceTab
                location={filters.location}
                jobs={altJobs}
                recruiters={altRecruiters}
                loading={altLoading}
                error={altError}
                total={altTotal}
                page={altPage}
                totalPages={altTotalPages}
                onPageChange={altGoToPage}
                sectorId={altSectorId}
                onSectorChange={setAltSectorId}
              />
            )}

            {/* ─── COMPANIES TAB (La Bonne Boîte) ─── */}
            {activeTab === 'companies' && (
              <CompaniesTab
                location={filters.location}
                radius={filters.radius}
                companies={companies}
                loading={companiesLoading}
                error={companiesError}
                total={companiesTotal}
                page={companiesPage}
                totalPages={companiesTotalPages}
                onPageChange={goToPage}
                sectorId={sectorId}
                onSectorChange={setSectorId}
                lbbContract={lbbContract}
                onContractChange={setLbbContract}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Tab button ────────────────────────────────────────────────────────────────
const TabButton = ({ active, onClick, icon, label, count, countColor }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
      active
        ? `border-${countColor}-500 text-${countColor}-600`
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
    }`}
  >
    {icon}
    {label}
    {count != null && (
      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-${countColor}-100 text-${countColor}-700`}>
        {count.toLocaleString('fr-FR')}
      </span>
    )}
  </button>
);

// ── Reusable warning card ─────────────────────────────────────────────────────
const WarningCard = ({ icon, title, color, children }) => (
  <div className={`text-center py-16 bg-white rounded-2xl border border-${color}-100 p-8 shadow-sm`}>
    <div className={`w-16 h-16 bg-${color}-50 rounded-full flex items-center justify-center mx-auto mb-4`}>{icon}</div>
    <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
    <div className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">{children}</div>
  </div>
);

// ── Empty state for offers ────────────────────────────────────────────────────
const EmptyOffers = ({ isGeo, radius, onExpand, onReset }) => (
  <div className={`text-center py-24 rounded-2xl border border-dashed shadow-sm ${isGeo ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isGeo ? 'bg-red-100' : 'bg-slate-50'}`}>
      {isGeo ? <MapPin className="h-10 w-10 text-red-400" /> : <Search className="h-10 w-10 text-slate-300" />}
    </div>
    <h3 className={`text-xl font-bold mb-3 ${isGeo ? 'text-red-900' : 'text-slate-900'}`}>
      {isGeo ? 'Aucune offre dans ce secteur' : 'Aucune offre trouvée'}
    </h3>
    <p className={`${isGeo ? 'text-red-700' : 'text-slate-500'} mb-8 max-w-md mx-auto leading-relaxed`}>
      {isGeo ? `Aucune offre dans un rayon de ${radius} km.` : "Modifiez vos filtres pour élargir la recherche."}
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {isGeo && (
        <Button onClick={onExpand} size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Plus className="w-4 h-4" /> Élargir la recherche
        </Button>
      )}
      <Button onClick={onReset} size="lg" variant={isGeo ? 'outline' : 'default'}
        className={isGeo ? 'bg-white text-red-700 border-red-200 hover:bg-red-50' : 'bg-slate-900 hover:bg-slate-800 text-white'}>
        Réinitialiser les filtres
      </Button>
    </div>
  </div>
);

// ── La Bonne Boîte companies tab ──────────────────────────────────────────────
const CompaniesTab = ({
  location, companies, loading, error, total, page, totalPages, onPageChange,
  sectorId, onSectorChange, lbbContract, onContractChange,
}) => {
  const FiltersBar = () => (
    <div className="flex flex-col sm:flex-row gap-3 mb-5 bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex-1">
        <CompanySectorFilter selectedSector={sectorId} onChange={onSectorChange} />
      </div>
      <div className="flex flex-col justify-end gap-1 shrink-0">
        <span className="text-sm font-medium text-slate-700 mb-1">Type de contrat</span>
        <div className="flex gap-2 flex-wrap">
          {LBB_CONTRACT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onContractChange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                lbbContract === opt.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (!location) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="h-10 w-10 text-indigo-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">Saisissez une localisation</h3>
        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm">
          La Bonne Boîte identifie les entreprises susceptibles de recruter autour de vous,
          même sans offre publiée. Indiquez une ville dans le filtre à gauche.
        </p>
      </div>
    );
  }

  if (error === 'credentials_missing' || error === 'auth_failed') {
    return (
      <>
        <FiltersBar />
        <WarningCard icon={<Key className="h-8 w-8 text-amber-500" />} title="Identifiants France Travail requis" color="amber">
          La Bonne Boîte utilise les mêmes identifiants que l'API Offres d'emploi.
        </WarningCard>
      </>
    );
  }

  if (error === 'not_subscribed') {
    return (
      <>
        <FiltersBar />
        <WarningCard icon={<Key className="h-8 w-8 text-amber-500" />} title="API La Bonne Boîte non souscrite" color="amber">
          Abonnez votre application France Travail à l'<strong>API La Bonne Boîte v1</strong>.{' '}
          <a href="https://francetravail.io/produits-partages/catalogue/bonne-boite-v2/documentation#/"
            target="_blank" rel="noopener noreferrer" className="text-amber-600 underline">
            Voir le catalogue →
          </a>
        </WarningCard>
      </>
    );
  }

  if (error) {
    return (
      <>
        <FiltersBar />
        <WarningCard icon={<AlertCircle className="h-8 w-8 text-red-400" />} title="Erreur de chargement" color="red">
          {String(error)}
        </WarningCard>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <FiltersBar />
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (companies.length === 0) {
    return (
      <>
        <FiltersBar />
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <Building2 className="h-10 w-10 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune entreprise trouvée</h3>
          <p className="text-slate-500 text-sm">Essayez un autre secteur ou élargissez le rayon dans les filtres.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FiltersBar />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{total.toLocaleString('fr-FR')}</span> entreprises
          identifiées autour de <span className="font-medium text-slate-700">{location.name}</span>
        </p>
        <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          Source&nbsp;: La Bonne Boîte
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {companies.map((company) => (
          <CompanyCard key={`${company.siret}-${company.name}`} company={company} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </>
  );
};

// ── La Bonne Alternance tab ───────────────────────────────────────────────────
const AlternanceTab = ({
  location, jobs, recruiters, loading, error, total, page, totalPages, onPageChange,
  sectorId, onSectorChange,
}) => {
  if (!location) {
    return (
      <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-10 w-10 text-violet-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">Saisissez une localisation</h3>
        <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm">
          Indiquez une ville dans le filtre à gauche pour découvrir les offres d'alternance
          et d'apprentissage à proximité.
        </p>
      </div>
    );
  }

  if (error === 'api_key_missing') {
    return (
      <WarningCard icon={<Key className="h-8 w-8 text-amber-500" />} title="Clé API La Bonne Alternance manquante" color="amber">
        Ajoutez le secret <code className="bg-slate-100 px-1 rounded text-xs">LBA_API_KEY</code> dans les secrets Supabase
        pour activer les offres d'alternance.
      </WarningCard>
    );
  }

  if (error === 'auth_failed') {
    return (
      <WarningCard icon={<Key className="h-8 w-8 text-amber-500" />} title="Clé API La Bonne Alternance invalide" color="amber">
        Vérifiez la valeur du secret <code className="bg-slate-100 px-1 rounded text-xs">LBA_API_KEY</code> dans Supabase.
      </WarningCard>
    );
  }

  if (error && !jobs.length) {
    return (
      <WarningCard icon={<AlertCircle className="h-8 w-8 text-red-400" />} title="Erreur de chargement" color="red">
        {String(error)}
      </WarningCard>
    );
  }

  return (
    <>
      {/* Sector filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <CompanySectorFilter selectedSector={sectorId} onChange={onSectorChange} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 && recruiters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <GraduationCap className="h-10 w-10 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Aucune offre trouvée</h3>
          <p className="text-slate-500 text-sm">Essayez un autre secteur ou élargissez le rayon dans les filtres.</p>
        </div>
      ) : (
        <>
          {/* Job offers section */}
          {jobs.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{total.toLocaleString('fr-FR')}</span> offre{total !== 1 ? 's' : ''}{' '}
                  autour de <span className="font-medium text-slate-700">{location.name}</span>
                </p>
                <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Source&nbsp;: La Bonne Alternance
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                {jobs.map((job) => (
                  <AlternanceJobCard key={job.id} job={job} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
              )}
            </div>
          )}

          {/* Recruiters section */}
          {recruiters.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Entreprises qui recrutent en alternance ({recruiters.length})
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {recruiters.map((rec) => (
                  <CompanyCard key={rec.id} company={rec} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

// ── Single alternance job card ─────────────────────────────────────────────────
const AlternanceJobCard = ({ job }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
        <GraduationCap className="w-5 h-5 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight">{job.title}</h3>
        {job.company?.name && (
          <p className="text-xs text-slate-500 mt-0.5">{job.company.name}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
          {job.location?.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />{job.location.city}
            </span>
          )}
          {job.contractType && (
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full font-medium">
              {job.contractType}
            </span>
          )}
          {job.diplomaLevel && (
            <span className="text-slate-400">{job.diplomaLevel}</span>
          )}
        </div>
        {job.description && (
          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{job.description}</p>
        )}
      </div>
    </div>
    {job.url && (
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-7 px-3 border-slate-200 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 gap-1.5 transition-colors"
          onClick={() => window.open(job.url, '_blank', 'noopener,noreferrer')}
        >
          Voir l'offre <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    )}
  </div>
);

export default JobExplorer;
