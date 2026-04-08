import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, LayoutDashboard, Menu, LogIn, X, Home, BookOpen, Briefcase, Info, Edit, ChevronRight, Building, Rocket, Loader2, Lock, FileText, UserPlus, Crown, Star, ArrowLeft, FolderOpen, Target, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useSystemSettings } from '@/contexts/SystemSettingsContext';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import { useTheme } from '@/hooks/useTheme';
import { useLocation, Link, NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getDisplayPlanName, PLAN_TYPES } from '@/lib/subscriptionUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import NotificationBell from '@/components/NotificationBell';
import './Header.css';

const Header = ({ onNavigate }) => {
  const { user, userProfile, signOut, subscriptionTier } = useAuth();
  const { settings } = useSystemSettings();
  const { navigateToAdmin, isAdmin } = useAdminNavigation();
  const { goBack, goHome } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const siteName = settings?.general?.siteName || 'CléAvenir';
  const logoUrl = settings?.general?.logo_url || 'https://storage.googleapis.com/hostinger-horizons-assets-prod/2a3aa4e1-f89b-4701-ac95-2a5df475caa5/d8ca901e80d017ffe3233aaf1581909b.png';
  const primaryColor = settings?.colors?.primary || '#4f46e5';

  const isHomePage = location.pathname === '/' || location.pathname === '/accueil';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const safeNavigate = (path) => {
    navigate(path);
  };

  const handleSignOut = async (e) => {
    if (e) e.preventDefault();
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await signOut(); 
      toast({
        title: "Déconnexion réussie",
        description: `À bientôt sur ${siteName} !`,
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error in header:", error);
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (userProfile?.first_name) return userProfile.first_name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const getSubscriptionBadge = () => {
    if (!user) return null;
    
    const displayName = getDisplayPlanName(subscriptionTier);

    switch (subscriptionTier) {
      case PLAN_TYPES.PREMIUM_PLUS:
        return (
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-none flex gap-1 items-center px-2 py-0.5 text-[10px] h-5">
            <Crown className="w-3 h-3" /> {displayName}
          </Badge>
        );
      case PLAN_TYPES.PREMIUM:
        return (
          <Badge className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white border-none flex gap-1 items-center px-2 py-0.5 text-[10px] h-5">
            <Star className="w-3 h-3" /> {displayName}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[var(--text-secondary)] border-[var(--border-color)] text-[10px] h-5 px-2">
            {displayName}
          </Badge>
        );
    }
  };

  const MobileNavLink = ({ icon: Icon, label, path, className, onClick }) => (
    <NavLink
      to={path}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
        setIsMobileMenuOpen(false);
      }}
      className={({ isActive }) => cn(
        "flex items-center justify-between w-full p-4 text-base md:text-lg font-medium rounded-xl transition-all text-[var(--text-primary)] min-h-[44px]",
        isActive && !onClick
          ? "bg-opacity-5" 
          : "hover:bg-[var(--bg-secondary)]",
        className
      )}
      style={({ isActive }) => (isActive && !onClick && !className ? { color: primaryColor, backgroundColor: `${primaryColor}10` } : {})}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon 
               className={cn("h-5 w-5", className && "text-current")} 
               style={(!className && (!isActive || onClick)) ? { color: 'var(--text-secondary)' } : (!className ? { color: primaryColor } : {})}
               aria-hidden="true" 
            />
            {label}
          </div>
          {isActive && !onClick && <ChevronRight className="h-4 w-4" />}
        </>
      )}
    </NavLink>
  );

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200 bg-[var(--bg-primary)] border-[var(--border-color)]",
        scrolled ? "backdrop-blur-md shadow-sm opacity-95" : ""
      )}
    >
      <div className="container-responsive flex h-14 md:h-16 lg:h-20 items-center justify-between">
        
        {/* Left: Logo & Brand Name */}
        <Link 
          to="/" 
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] rounded-lg p-1 cursor-pointer min-w-0"
          aria-label="Retour à l'accueil"
        >
           <img 
             src={logoUrl} 
             alt={`Logo ${siteName}`} 
             className="object-contain transition-transform group-hover:scale-105 shrink-0"
             width="32"
             height="32"
             style={{ width: '32px', height: '32px' }}
           />
           <span className="text-lg md:text-xl lg:text-2xl font-bold truncate" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, #818cf8)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {siteName}
           </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium" role="navigation">
           {[
             { path: '/test-orientation', label: '🎯 Test' },
             { path: '/offres-emploi', label: 'Offres' },
             { path: '/formations', label: 'Formations' },
             { path: '/metiers', label: 'Métiers' },
             { path: '/blog', label: '📚 Blog' },
             ...(user ? [{ path: '/personalized-plan', label: 'Mon Plan' }] : [])
           ].map((link) => (
             <NavLink 
               key={link.path}
               to={link.path} 
               className={({ isActive }) => cn(
                 "relative py-2 transition-colors focus:outline-none whitespace-nowrap flex items-center gap-2 min-h-[44px]",
                 isActive ? "font-semibold" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
               )}
               style={({ isActive }) => isActive ? { color: primaryColor } : {}}
             >
               {({ isActive }) => (
                 <>
                   {link.icon && <link.icon className="w-4 h-4" />}
                   {link.label}
                   {isActive && (
                     <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                   )}
                 </>
               )}
             </NavLink>
           ))}
           
           {/* Admin-only Docs Link */}
           {isAdmin && (
             <NavLink 
               to="/documentation" 
               className={({ isActive }) => cn(
                 "relative py-2 transition-colors focus:outline-none whitespace-nowrap flex items-center gap-2 min-h-[44px]",
                 isActive ? "font-semibold" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
               )}
               style={({ isActive }) => isActive ? { color: primaryColor } : {}}
             >
               {({ isActive }) => (
                 <>
                   <BookOpen className="w-4 h-4" />
                   Docs
                   {isActive && (
                     <span className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                   )}
                 </>
               )}
             </NavLink>
           )}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] w-10 h-10 shrink-0"
            title="Basculer le thème"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Navigation Buttons - Hidden on Homepage */}
          {!isHomePage && (
            <div className="hidden md:flex items-center gap-2 mr-2 border-r border-[var(--border-color)] pr-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goHome}
                className="text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] px-2 flex items-center gap-2 font-medium h-10"
                title="Accueil"
              >
                <Home className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">Accueil</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] px-2 flex items-center gap-2 font-medium h-10"
                title="Retour"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">Retour</span>
              </Button>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                 {getSubscriptionBadge()}
              </div>

              <div className="shrink-0">
                <NotificationBell />
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden lg:flex hover:bg-[var(--bg-secondary)] font-medium text-[var(--text-primary)] h-10" 
                onClick={() => safeNavigate('/dashboard')}
              >
                Mon Espace
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full ring-2 ring-transparent hover:ring-opacity-20 transition-all p-0 shrink-0" style={{ ':hover': { ringColor: primaryColor } }} aria-label="Menu utilisateur">
                    <Avatar className="h-9 w-9 md:h-10 md:w-10 border border-[var(--border-color)]">
                      <AvatarImage src={userProfile?.avatar_url} alt={`Avatar de ${userProfile?.first_name || 'utilisateur'}`} />
                      <AvatarFallback className="font-bold text-white text-sm md:text-base" style={{ backgroundColor: primaryColor }}>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-primary)]" align="end" forceMount>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                         <p className="text-sm font-semibold leading-none text-[var(--text-primary)]">{userProfile?.first_name || 'Utilisateur'}</p>
                         {isAdmin && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">ADMIN</span>}
                      </div>
                      <p className="text-xs leading-none text-[var(--text-secondary)] truncate">{user.email}</p>
                      <div className="md:hidden pt-1">
                        {getSubscriptionBadge()}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[var(--border-color)]" />
                  <DropdownMenuItem onClick={() => safeNavigate('/dashboard')} className="cursor-pointer hover:bg-[var(--bg-secondary)] min-h-[40px]">
                    <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden="true" /> Tableau de bord
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => safeNavigate('/personalized-plan')} className="cursor-pointer hover:bg-[var(--bg-secondary)] min-h-[40px]">
                    <Target className="mr-2 h-4 w-4" aria-hidden="true" /> Mon Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => safeNavigate('/profile/edit')} className="cursor-pointer hover:bg-[var(--bg-secondary)] min-h-[40px]">
                    <Edit className="mr-2 h-4 w-4" aria-hidden="true" /> Modifier profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => safeNavigate('/my-documents')} className="cursor-pointer hover:bg-[var(--bg-secondary)] min-h-[40px]">
                    <FolderOpen className="mr-2 h-4 w-4" aria-hidden="true" /> Mes documents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => safeNavigate('/manage-subscription')} className="cursor-pointer hover:bg-[var(--bg-secondary)] min-h-[40px]">
                    <Crown className="mr-2 h-4 w-4 text-amber-500" aria-hidden="true" /> Abonnement
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <div className="admin-menu-section mt-1 mb-1">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToAdmin();
                        }}
                        className="menu-item admin-item bg-purple-50 hover:bg-purple-100 text-purple-900 cursor-pointer border border-purple-100 rounded-md min-h-[40px]"
                      >
                         <div className="flex items-center w-full">
                            <Lock aria-hidden="true" className="mr-2 h-4 w-4 text-purple-700" />
                            <span className="font-medium">Espace Admin</span>
                         </div>
                      </DropdownMenuItem>
                    </div>
                  )}

                  <DropdownMenuSeparator className="bg-[var(--border-color)]" />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    disabled={isLoggingOut}
                    className="text-red-600 focus:text-red-600 hover:bg-red-50 cursor-pointer min-h-[40px]"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
             <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-3">
                   <Button variant="ghost" size="sm" onClick={() => safeNavigate('/establishment/login')} className="text-[var(--text-secondary)] hover:text-blue-600 hover:bg-blue-50 gap-2 font-medium h-10">
                      <Building className="h-4 w-4" />
                      <span>Établissement</span>
                   </Button>
                   <Link to="/signup" className="text-[var(--text-primary)] font-semibold px-3 transition-colors min-h-[40px] flex items-center" style={{ ':hover': { color: primaryColor } }}>Inscription</Link>
                   <Button variant="ghost" onClick={() => safeNavigate('/login')} className="text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] font-medium h-10" style={{ ':hover': { color: primaryColor } }}>Se connecter</Button>
                   <Button onClick={() => safeNavigate('/test-orientation')} className="shadow-lg transition-all text-white font-semibold h-10" style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}33` }}>Faire le test</Button>
                </div>
                
                <Button variant="ghost" size="icon" className="lg:hidden text-[var(--text-secondary)] w-10 h-10 shrink-0" onClick={() => safeNavigate('/login')} aria-label="Se connecter">
                  <LogIn className="h-5 w-5" />
                </Button>
             </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden shrink-0">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2 text-[var(--text-primary)] w-10 h-10 hover:bg-transparent" aria-label="Ouvrir le menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[350px] max-w-sm p-0 flex flex-col h-full bg-[var(--bg-primary)] border-l border-[var(--border-color)] z-[60]">
                 <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between h-14 md:h-16 shrink-0">
                    <span className="font-bold text-lg" style={{ color: primaryColor }}>{siteName}</span>
                    <SheetClose className="rounded-full p-2 hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)]" aria-label="Fermer le menu">
                      <X className="h-5 w-5" />
                    </SheetClose>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                    <MobileNavLink icon={Home} label="Accueil" path="/" />
                    <MobileNavLink icon={Rocket} label="Comment ça marche" path="/how-it-works" />
                    <MobileNavLink icon={BookOpen} label="Formations" path="/formations" />
                    <MobileNavLink icon={Briefcase} label="Offres d'emploi" path="/offres-emploi" />
                    {user && <MobileNavLink icon={Target} label="Mon Plan" path="/personalized-plan" className="text-indigo-600" />}
                    {isAdmin && <MobileNavLink icon={FileText} label="Documentation" path="/documentation" className="text-purple-600 bg-purple-50" />}
                    <MobileNavLink icon={Info} label="À propos" path="/about" />
                    <MobileNavLink icon={BookOpen} label="Blog" path="/blog" />
                    <MobileNavLink icon={Building} label="Espace Établissement" path="/establishment/login" className="text-blue-600" />
                    <MobileNavLink icon={UserPlus} label="S'inscrire" path="/signup" className="text-indigo-600" />
                    
                    {user && (
                        <>
                           <div className="my-2 border-t border-[var(--border-color)] mx-4" />
                           <MobileNavLink icon={LayoutDashboard} label="Tableau de bord" path="/dashboard" />
                           <MobileNavLink icon={FolderOpen} label="Mes documents" path="/my-documents" />
                           {isAdmin && (
                              <button
                                onClick={() => {
                                  navigateToAdmin();
                                  setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center p-4 text-base md:text-lg font-medium rounded-xl transition-all text-purple-700 bg-purple-50 hover:bg-purple-100 my-2 min-h-[44px]"
                              >
                                <Lock className="h-5 w-5 mr-3" />
                                🔐 Admin Dashboard
                              </button>
                           )}
                           <MobileNavLink icon={Edit} label="Mon Profil" path="/profile/edit" />
                           <MobileNavLink icon={Crown} label="Mon Abonnement" path="/manage-subscription" />
                        </>
                    )}

                    {!user && (
                       <div className="mt-8 px-4 space-y-3 pb-8">
                          <Button onClick={() => { safeNavigate('/login'); setIsMobileMenuOpen(false); }} className="w-full h-12 text-base shadow-lg text-white font-semibold" style={{ backgroundColor: primaryColor }}>
                             Se connecter
                          </Button>
                          <Button variant="outline" onClick={() => { safeNavigate('/signup'); setIsMobileMenuOpen(false); }} className="w-full h-12 text-base font-medium">
                             Créer un compte
                          </Button>
                       </div>
                    )}
                 </div>
                 
                 {user && (
                    <div className="p-4 border-t border-[var(--border-color)] shrink-0">
                      <Button 
                        variant="destructive" 
                        onClick={handleSignOut}
                        disabled={isLoggingOut} 
                        className="w-full justify-start font-medium h-12"
                      >
                         {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                         {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
                      </Button>
                    </div>
                 )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;