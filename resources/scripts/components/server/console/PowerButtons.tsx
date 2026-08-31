import React, { useEffect, useState } from 'react';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import { Play, RotateCw, Square, Zap } from 'lucide-react';

interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    return (
        <div className={className}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title={'Forcibly Stop Process'}
                confirm={'Continue'}
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                Forcibly stopping a server can lead to data corruption.
            </Dialog.Confirm>

            <Can action={'control.start'}>
                <button
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                    className={
                        'flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-200 bg-[#55d88a]/15 text-[#55d88a] border border-[#55d88a]/40 hover:bg-[#55d88a] hover:text-[#070303] hover:shadow-[0_0_20px_rgba(85,216,138,0.4)] disabled:opacity-40 disabled:cursor-not-allowed'
                    }
                >
                    <Play className={'w-4 h-4 mr-2 fill-current'} />
                    <span>Start</span>
                </button>
            </Can>

            <Can action={'control.restart'}>
                <button
                    disabled={!status || status === 'offline'}
                    onClick={onButtonClick.bind(this, 'restart')}
                    className={
                        'flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-200 bg-[#210606] text-[#F2D675] border border-[#D4AF37]/40 hover:bg-[#B88A20] hover:text-[#070303] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] disabled:opacity-40 disabled:cursor-not-allowed'
                    }
                >
                    <RotateCw className={'w-4 h-4 mr-2'} />
                    <span>Restart</span>
                </button>
            </Can>

            <Can action={'control.stop'}>
                <button
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                    className={
                        `flex-1 flex items-center justify-center px-4 py-2.5 rounded-xl font-medium text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
                            killable
                                ? 'bg-red-600/30 text-red-400 border border-red-500 hover:bg-red-600 hover:text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                                : 'bg-[#3A0A0A]/80 text-[#ff6b6b] border border-[#ff6b6b]/40 hover:bg-[#ff6b6b] hover:text-[#070303] hover:shadow-[0_0_20px_rgba(255,107,107,0.4)]'
                        }`
                    }
                >
                    {killable ? (
                        <>
                            <Zap className={'w-4 h-4 mr-2 fill-current'} />
                            <span>Kill</span>
                        </>
                    ) : (
                        <>
                            <Square className={'w-4 h-4 mr-2 fill-current'} />
                            <span>Stop</span>
                        </>
                    )}
                </button>
            </Can>
        </div>
    );
};
