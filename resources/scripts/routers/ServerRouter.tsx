import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { NavLink, Route, Switch, useRouteMatch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import { CSSTransition } from 'react-transition-group';
import Can from '@/components/elements/Can';
import Spinner from '@/components/elements/Spinner';
import { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import SubNavigation from '@/components/elements/SubNavigation';
import InstallListener from '@/components/server/InstallListener';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { ExternalLink } from 'lucide-react';
import { useLocation } from 'react-router';
import ConflictStateRenderer from '@/components/server/ConflictStateRenderer';
import PermissionRoute from '@/components/elements/PermissionRoute';
import routes from '@/routers/routes';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import Avatar from '@/components/Avatar';

export default () => {
    const match = useRouteMatch<{ id: string }>();
    const location = useLocation();

    const rootAdmin = useStoreState((state) => state.user.data!.rootAdmin);
    const username = useStoreState((state) => state.user.data?.username);
    const email = useStoreState((state) => state.user.data?.email);
    const [error, setError] = useState('');

    const id = ServerContext.useStoreState((state) => state.server.data?.id);
    const uuid = ServerContext.useStoreState((state) => state.server.data?.uuid);
    const serverName = ServerContext.useStoreState((state) => state.server.data?.name);
    const inConflictState = ServerContext.useStoreState((state) => state.server.inConflictState);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.internalId);
    const getServer = ServerContext.useStoreActions((actions) => actions.server.getServer);
    const clearServerState = ServerContext.useStoreActions((actions) => actions.clearServerState);

    const to = (value: string, url = false) => {
        if (value === '/') {
            return url ? match.url : match.path;
        }
        return `${(url ? match.url : match.path).replace(/\/*$/, '')}/${value.replace(/^\/+/, '')}`;
    };

    useEffect(
        () => () => {
            clearServerState();
        },
        []
    );

    useEffect(() => {
        setError('');

        getServer(match.params.id).catch((error) => {
            console.error(error);
            setError(httpErrorToHuman(error));
        });

        return () => {
            clearServerState();
        };
    }, [match.params.id]);

    return (
        <div className={'min-h-screen bg-[#070303] text-[#FFFFFF] flex flex-col md:flex-row'}>
            <NavigationBar />

            <main className={'flex-1 md:ml-64 flex flex-col min-h-screen w-full overflow-x-hidden'}>
                {/* Topbar Header */}
                <header className={'h-16 bg-[#0D0505]/80 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 flex items-center justify-between sticky top-0 z-30'}>
                    <div className={'flex items-center space-x-3 text-xs uppercase tracking-widest text-[#A89F9F] font-mono'}>
                        <span className={'w-2 h-2 rounded-full bg-[#55d88a] shadow-[0_0_8px_#55d88a]'} />
                        <span className={'text-[#F2D675] font-semibold'}>{serverName || 'Server'}</span>
                        <span>/</span>
                        <span className={'truncate max-w-[200px]'}>{location.pathname}</span>
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

                {!uuid || !id ? (
                    error ? (
                        <div className={'p-6'}>
                            <ServerError message={error} />
                        </div>
                    ) : (
                        <div className={'flex-1 flex items-center justify-center'}>
                            <Spinner size={'large'} centered />
                        </div>
                    )
                ) : (
                    <>
                        <CSSTransition timeout={150} classNames={'fade'} appear in>
                            <SubNavigation>
                                <div>
                                    {routes.server
                                        .filter((route) => !!route.name)
                                        .map((route) =>
                                            route.permission ? (
                                                <Can key={route.path} action={route.permission} matchAny>
                                                    <NavLink to={to(route.path, true)} exact={route.exact}>
                                                        {route.name}
                                                    </NavLink>
                                                </Can>
                                            ) : (
                                                <NavLink key={route.path} to={to(route.path, true)} exact={route.exact}>
                                                    {route.name}
                                                </NavLink>
                                            )
                                        )}
                                    {rootAdmin && (
                                        // eslint-disable-next-line react/jsx-no-target-blank
                                        <a href={`/admin/servers/view/${serverId}`} target={'_blank'}>
                                            <ExternalLink className={'w-4 h-4 text-[#D4AF37] inline-block ml-1'} />
                                        </a>
                                    )}
                                </div>
                            </SubNavigation>
                        </CSSTransition>
                        <InstallListener />
                        <TransferListener />
                        <WebsocketHandler />
                        <div className={'flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-full'}>
                            {inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`))) ? (
                                <ConflictStateRenderer />
                            ) : (
                                <ErrorBoundary>
                                    <TransitionRouter>
                                        <Switch location={location}>
                                            {routes.server.map(({ path, permission, component: Component }) => (
                                                <PermissionRoute key={path} permission={permission} path={to(path)} exact>
                                                    <Spinner.Suspense>
                                                        <Component />
                                                    </Spinner.Suspense>
                                                </PermissionRoute>
                                            ))}
                                            <Route path={'*'} component={NotFound} />
                                        </Switch>
                                    </TransitionRouter>
                                </ErrorBoundary>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
