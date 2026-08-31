import React, { memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import Spinner from '@/components/elements/Spinner';
import Features from '@feature/Features';
import Console from '@/components/server/console/Console';
import StatGraphs from '@/components/server/console/StatGraphs';
import PowerButtons from '@/components/server/console/PowerButtons';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import { Alert } from '@/components/elements/alert';
import { Cpu, Server as ServerIcon, ShieldCheck } from 'lucide-react';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ServerConsoleContainer = () => {
    const name = ServerContext.useStoreState((state) => state.server.data!.name);
    const description = ServerContext.useStoreState((state) => state.server.data!.description);
    const id = ServerContext.useStoreState((state) => state.server.data!.id);
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const isInstalling = ServerContext.useStoreState((state) => state.server.isInstalling);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const eggFeatures = ServerContext.useStoreState((state) => state.server.data!.eggFeatures, isEqual);
    const isNodeUnderMaintenance = ServerContext.useStoreState((state) => state.server.data!.isNodeUnderMaintenance);

    return (
        <ServerContentBlock title={'Console'}>
            {(isNodeUnderMaintenance || isInstalling || isTransferring) && (
                <Alert type={'warning'} className={'mb-4'}>
                    {isNodeUnderMaintenance
                        ? 'The node of this server is currently under maintenance and all actions are unavailable.'
                        : isInstalling
                        ? 'This server is currently running its installation process and most actions are unavailable.'
                        : 'This server is currently being transferred to another node and all actions are unavailable.'}
                </Alert>
            )}

            {/* MONTE TOP Luxury Server Header */}
            <div className={'bg-gradient-to-r from-[#210606] via-[#0D0505] to-[#070303] border border-[#D4AF37]/30 rounded-2xl p-5 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden'}>
                <div className={'absolute top-0 right-0 w-96 h-96 bg-radial from-[#D4AF37]/10 to-transparent pointer-events-none -mr-20 -mt-20'} />

                <div className={'flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10'}>
                    <div className={'flex items-start space-x-4'}>
                        <div className={'w-12 h-12 rounded-xl bg-[#3A0A0A] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] shrink-0'}>
                            <ServerIcon className={'w-6 h-6 text-[#F2D675]'} />
                        </div>
                        <div>
                            <div className={'flex items-center space-x-2'}>
                                <span className={'text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#F2D675] border border-[#D4AF37]/30'}>
                                    MONTE TOP CLOUD
                                </span>
                                <span className={'text-[10px] font-mono text-[#A89F9F]'}>ID: {id}</span>
                            </div>
                            <h1 className={'font-bold text-2xl text-[#FFFFFF] tracking-tight mt-1'}>{name}</h1>
                            {description && <p className={'text-xs text-[#A89F9F] mt-0.5 line-clamp-1'}>{description}</p>}
                        </div>
                    </div>

                    <div className={'flex items-center gap-3 w-full lg:w-auto'}>
                        <Can action={['control.start', 'control.stop', 'control.restart']} matchAny>
                            <PowerButtons className={'flex items-center space-x-2 w-full lg:w-auto'} />
                        </Can>
                    </div>
                </div>
            </div>

            <div className={'grid grid-cols-4 gap-2 sm:gap-4 mb-4'}>
                <div className={'flex col-span-4 lg:col-span-3'}>
                    <Spinner.Suspense>
                        <Console />
                    </Spinner.Suspense>
                </div>
                <ServerDetailsBlock className={'col-span-4 lg:col-span-1 order-last lg:order-none'} />
            </div>

            <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>

            <Features enabled={eggFeatures} />
        </ServerContentBlock>
    );
};

export default memo(ServerConsoleContainer, isEqual);
