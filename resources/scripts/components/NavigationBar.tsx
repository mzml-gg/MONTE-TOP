import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Avatar from '@/components/Avatar';
import {
    LayoutDashboard,
    Shield,
    UserCheck,
    LogOut,
    Menu,
    X,
    Cpu,
    Terminal,
    Folder,
    Database,
    Calendar,
    HardDrive,
    Settings
} from 'lucide-react';
import { ServerContext } from '@/state/server';

const ServerNavigationSection = () => {
    const serverName = ServerContext.useStoreState((state) => state.server.data?.name);
    const serverId = ServerContext.useStoreState((state) => state.server.data?.id);
    const location = useLocation();

    if (!serverId) return null;

    const getItemClass = (path: string, exact = false) => {
        const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
        return `flex items-center px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
            isActive
                ? 'bg-[#210606] text-[#F2D675] border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                : 'text-[#A89F9F] border-transparent hover:bg-[#210606]/40 hover:text-[#FFFFFF] hover:border-[#D4AF37]/20'
        }`;
    };

    return (
        <div className={'pt-3 space-y-1.5'}>
            <div className={'text-[11px] font-semibold uppercase tracking-wider text-[#F2D675]/80 px-3 py-1 font-mono flex items-center justify-between'}>
                <span className={'truncate max-w-[140px]'}>{serverName || 'Active Server'}</span>
                <span className={'w-2 h-2 rounded-full bg-[#55d88a] shadow-[0_0_8px_#55d88a]'} />
            </div>

            <NavLink
                to={`/server/${serverId}`}
                exact
                className={getItemClass(`/server/${serverId}`, true)}
            >
                <Terminal className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>Console & Power</span>
            </NavLink>

            <NavLink
                to={`/server/${serverId}/files`}
                className={getItemClass(`/server/${serverId}/files`)}
            >
                <Folder className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>File Manager</span>
            </NavLink>

            <NavLink
                to={`/server/${serverId}/databases`}
                className={getItemClass(`/server/${serverId}/databases`)}
            >
                <Database className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>Databases</span>
            </NavLink>

            <NavLink
                to={`/server/${serverId}/schedules`}
                className={getItemClass(`/server/${serverId}/schedules`)}
            >
                <Calendar className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>Schedules</span>
            </NavLink>

            <NavLink
                to={`/server/${serverId}/users`}
                className={getItemClass(`/server/${serverId}/users`)}
            >
                <UserCheck className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>Users & Access</span>
            </NavLink>

            <NavLink
                to={`/server/${serverId}/backups`}
                className={getItemClass(`/server/${serverId}/backups`)}
            >
                <HardDrive className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>Backups</span>
            </NavLink>

            <NavLink
                to={`/server/${serverId}/settings`}
                className={getItemClass(`/server/${serverId}/settings`)}
            >
                <Settings className={'w-4 h-4 mr-3 text-[#D4AF37]'} />
                <span>Server Settings</span>
            </NavLink>
        </div>
    );
};

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error valid
            window.location = '/';
        });
    };

    const isServerRoute = location.pathname.startsWith('/server/');

    const getItemClass = (path: string, exact = false) => {
        const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
        return `flex items-center px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border ${
            isActive
                ? 'bg-[#210606] text-[#F2D675] border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                : 'text-[#A89F9F] border-transparent hover:bg-[#210606]/40 hover:text-[#FFFFFF] hover:border-[#D4AF37]/20'
        }`;
    };

    return (
        <>
            <SpinnerOverlay visible={isLoggingOut} />

            {/* Mobile Top bar header */}
            <div className={'md:hidden flex items-center justify-between px-4 py-3 bg-[#0D0505] border-b border-[#D4AF37]/20 z-40 relative'}>
                <Link to={'/'} className={'flex items-center space-x-2 no-underline'}>
                    <div className={'w-8 h-8 rounded-lg bg-gradient-to-br from-[#3A0A0A] to-[#210606] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.3)]'}>
                        <Cpu className={'w-4 h-4 text-[#D4AF37]'} />
                    </div>
                    <span className={'font-bold tracking-wider text-[#F2D675] text-lg font-mono'}>
                        MONTE TOP
                    </span>
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className={'p-2 text-[#A89F9F] hover:text-[#D4AF37] rounded-lg bg-[#210606]/40 border border-[#D4AF37]/20'}
                >
                    {mobileOpen ? <X className={'w-6 h-6'} /> : <Menu className={'w-6 h-6'} />}
                </button>
            </div>

            {/* Main Navigation Container (Sidebar + Topbar Overlay layout) */}
            <aside
                className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#0D0505]/95 backdrop-blur-xl border-r border-[#D4AF37]/20 flex flex-col justify-between transition-transform duration-300 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                <div>
                    {/* Brand Section */}
                    <div className={'p-6 border-b border-[#D4AF37]/15 flex items-center justify-between'}>
                        <Link to={'/'} className={'flex items-center space-x-3 no-underline group'}>
                            <div className={'w-10 h-10 rounded-xl bg-gradient-to-br from-[#3A0A0A] to-[#210606] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all'}>
                                <Cpu className={'w-5 h-5 text-[#D4AF37]'} />
                            </div>
                            <div className={'flex flex-col'}>
                                <span className={'font-extrabold tracking-widest text-[#F2D675] text-lg leading-tight font-mono'}>
                                    MONTE TOP
                                </span>
                                <span className={'text-[10px] tracking-wider uppercase text-[#A89F9F] font-medium'}>
                                    {name || 'Cloud Infra'}
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Items */}
                    <nav className={'p-4 space-y-1.5'}>
                        <div className={'text-[11px] font-semibold uppercase tracking-wider text-[#A89F9F]/70 px-3 py-1 font-mono'}>
                            Main Navigation
                        </div>

                        <NavLink
                            to={'/'}
                            exact
                            className={getItemClass('/', true)}
                        >
                            <LayoutDashboard className={'w-5 h-5 mr-3 text-[#D4AF37]'} />
                            <span>Servers Dashboard</span>
                        </NavLink>

                        {isServerRoute && <ServerNavigationSection />}

                        <div className={'pt-3 space-y-1.5'}>
                            <div className={'text-[11px] font-semibold uppercase tracking-wider text-[#A89F9F]/70 px-3 py-1 font-mono'}>
                                Management
                            </div>

                            <NavLink
                                to={'/account'}
                                className={getItemClass('/account')}
                            >
                                <UserCheck className={'w-5 h-5 mr-3 text-[#D4AF37]'} />
                                <span>Account Settings</span>
                            </NavLink>

                            {rootAdmin && (
                                <a
                                    href={'/admin'}
                                    rel={'noreferrer'}
                                    className={
                                        'flex items-center px-3.5 py-3 rounded-xl font-medium text-sm text-[#F2D675] hover:bg-[#3A0A0A]/40 transition-all border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                                    }
                                >
                                    <Shield className={'w-5 h-5 mr-3 text-[#D4AF37]'} />
                                    <span>Admin Area</span>
                                </a>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Footer / Account Logout */}
                <div className={'p-4 border-t border-[#D4AF37]/15 bg-[#070303]/60'}>
                    <button
                        onClick={onTriggerLogout}
                        className={
                            'w-full flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase text-[#F2D675] bg-[#210606] hover:bg-[#3A0A0A] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-200 shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                        }
                    >
                        <LogOut className={'w-4 h-4 mr-2'} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
