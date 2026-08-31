import React from 'react';
import { NavLink, Route, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import { useLocation } from 'react-router';
import Spinner from '@/components/elements/Spinner';
import routes from '@/routers/routes';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import Avatar from '@/components/Avatar';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

export default () => {
    const location = useLocation();
    const username = useStoreState((state: ApplicationStore) => state.user.data?.username);
    const email = useStoreState((state: ApplicationStore) => state.user.data?.email);

    return (
        <div className={'min-h-screen bg-[#070303] text-[#FFFFFF] flex flex-col md:flex-row'}>
            <NavigationBar />

            {/* Main Content Container filling remaining viewport space */}
            <main className={'flex-1 md:ml-64 flex flex-col min-h-screen w-full overflow-x-hidden'}>
                {/* Topbar Header */}
                <header className={'h-16 bg-[#0D0505]/80 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 flex items-center justify-between sticky top-0 z-30'}>
                    <div className={'flex items-center space-x-3 text-xs uppercase tracking-widest text-[#A89F9F] font-mono'}>
                        <span className={'w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]'} />
                        <span className={'text-[#F2D675] font-semibold'}>MONTE TOP</span>
                        <span>/</span>
                        <span>{location.pathname === '/' ? 'Dashboard' : location.pathname.replace('/', '')}</span>
                    </div>

                    <div className={'flex items-center space-x-4'}>
                        <SearchContainer />
                        <div className={'h-6 w-px bg-[#D4AF37]/20 hidden sm:block'} />
                        <div className={'flex items-center space-x-3'}>
                            <div className={'w-8 h-8 rounded-full border border-[#D4AF37]/40 overflow-hidden flex items-center justify-center bg-[#210606]'}>
                                <Avatar.User />
                            </div>
                            <div className={'hidden sm:flex flex-col text-left'}>
                                <span className={'text-xs font-semibold text-[#FFFFFF] font-mono leading-none'}>{username || 'User'}</span>
                                <span className={'text-[10px] text-[#A89F9F] leading-tight'}>{email || 'Cloud Admin'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {location.pathname.startsWith('/account') && (
                    <SubNavigation>
                        <div>
                            {routes.account
                                .filter((route) => !!route.name)
                                .map(({ path, name, exact = false }) => (
                                    <NavLink key={path} to={`/account/${path}`.replace('//', '/')} exact={exact}>
                                        {name}
                                    </NavLink>
                                ))}
                        </div>
                    </SubNavigation>
                )}

                <div className={'flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full'}>
                    <TransitionRouter>
                        <React.Suspense fallback={<Spinner centered />}>
                            <Switch location={location}>
                                <Route path={'/'} exact>
                                    <DashboardContainer />
                                </Route>
                                {routes.account.map(({ path, component: Component }) => (
                                    <Route key={path} path={`/account/${path}`.replace('//', '/')} exact>
                                        <Component />
                                    </Route>
                                ))}
                                <Route path={'*'}>
                                    <NotFound />
                                </Route>
                            </Switch>
                        </React.Suspense>
                    </TransitionRouter>
                </div>
            </main>
        </div>
    );
};
