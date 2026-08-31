import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ITerminalOptions, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { SearchAddon } from 'xterm-addon-search';
import { SearchBarAddon } from 'xterm-addon-search-bar';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { ScrollDownHelperAddon } from '@/plugins/XtermScrollDownHelperAddon';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ServerContext } from '@/state/server';
import { usePermissions } from '@/plugins/usePermissions';
import useEventListener from '@/plugins/useEventListener';
import { debounce } from 'debounce';
import { usePersistedState } from '@/plugins/usePersistedState';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import classNames from 'classnames';
import useFlash from '@/plugins/useFlash';
import { Copy, Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

import 'xterm/css/xterm.css';
import styles from './style.module.css';

const theme = {
    background: '#070303',
    cursor: '#D4AF37',
    black: '#070303',
    red: '#ff6b6b',
    green: '#55d88a',
    yellow: '#F2D675',
    blue: '#82AAFF',
    magenta: '#C792EA',
    cyan: '#89DDFF',
    white: '#FFFFFF',
    brightBlack: 'rgba(255, 255, 255, 0.3)',
    brightRed: '#FF5370',
    brightGreen: '#C3E88D',
    brightYellow: '#F2D675',
    brightBlue: '#82AAFF',
    brightMagenta: '#C792EA',
    brightCyan: '#89DDFF',
    brightWhite: '#ffffff',
    selection: 'rgba(212, 175, 55, 0.3)',
};

const terminalProps: ITerminalOptions = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    rows: 30,
    theme: theme,
};

export default () => {
    const TERMINAL_PRELUDE = '\u001b[1m\u001b[33mcontainer@pterodactyl~ \u001b[0m';
    const ref = useRef<HTMLDivElement>(null);
    const terminal = useMemo(() => new Terminal({ ...terminalProps }), []);
    const fitAddon = new FitAddon();
    const searchAddon = new SearchAddon();
    const searchBar = new SearchBarAddon({ searchAddon });
    const webLinksAddon = new WebLinksAddon();
    const unicode11Addon = new Unicode11Addon();
    const scrollDownHelperAddon = new ScrollDownHelperAddon();
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [canSendCommands] = usePermissions(['control.console']);
    const serverId = ServerContext.useStoreState((state) => state.server.data!.id);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data!.isTransferring);
    const [history, setHistory] = usePersistedState<string[]>(`${serverId}:command_history`, []);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [outputLines, setOutputLines] = useState<string[]>([]);
    const { addFlash } = useFlash();

    const zIndex = `
    .xterm-search-bar__addon {
        z-index: 10;
    }`;

    const appendOutput = (line: string) => setOutputLines((lines) => [...lines, line].slice(-1000));
    const handleConsoleOutput = (line: string, prelude = false) => {
        const cleanLine = line.replace(/(?:\r\n|\r|\n)$/im, '');
        appendOutput(cleanLine);
        terminal.writeln((prelude ? TERMINAL_PRELUDE : '') + cleanLine + '\u001b[0m');
    };

    const handleTransferStatus = (status: string) => {
        switch (status) {
            case 'failure':
                terminal.writeln(TERMINAL_PRELUDE + 'Transfer has failed.\u001b[0m');
                return;
        }
    };

    const handleDaemonErrorOutput = (line: string) =>
        terminal.writeln(
            TERMINAL_PRELUDE + '\u001b[1m\u001b[41m' + line.replace(/(?:\r\n|\r|\n)$/im, '') + '\u001b[0m'
        );

    const handlePowerChangeEvent = (state: string) => {
        const line = 'Server marked as ' + state + '...';
        appendOutput(line);
        terminal.writeln(TERMINAL_PRELUDE + line + '\u001b[0m');
    };

    const copyLastLines = async () => {
        const lines = outputLines.slice(-100);
        if (!lines.length) return;
        try {
            await navigator.clipboard.writeText(lines.join('\n'));
            addFlash({ type: 'success', title: 'Console', message: `${lines.length} console lines copied` });
        } catch {
            addFlash({ type: 'error', title: 'Console', message: 'Clipboard access was denied by the browser.' });
        }
    };

    const handleCommandKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            const newIndex = Math.min(historyIndex + 1, history!.length - 1);
            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
            e.preventDefault();
        }

        if (e.key === 'ArrowDown') {
            const newIndex = Math.max(historyIndex - 1, -1);
            setHistoryIndex(newIndex);
            e.currentTarget.value = history![newIndex] || '';
        }

        const command = e.currentTarget.value;
        if (e.key === 'Enter' && command.length > 0) {
            setHistory((prevHistory) => [command, ...prevHistory!].slice(0, 32));
            setHistoryIndex(-1);
            instance && instance.send('send command', command);
            e.currentTarget.value = '';
        }
    };

    useEffect(() => {
        if (connected && ref.current && !terminal.element) {
            terminal.loadAddon(fitAddon);
            terminal.loadAddon(searchAddon);
            terminal.loadAddon(searchBar);
            terminal.loadAddon(webLinksAddon);
            terminal.loadAddon(unicode11Addon);
            terminal.loadAddon(scrollDownHelperAddon);

            terminal.open(ref.current);
            terminal.unicode.activeVersion = '11';
            fitAddon.fit();
            searchBar.addNewStyle(zIndex);

            terminal.attachCustomKeyEventHandler((e: KeyboardEvent) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
                    document.execCommand('copy');
                    return false;
                } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchBar.show();
                    return false;
                } else if (e.key === 'Escape') {
                    searchBar.hidden();
                }
                return true;
            });
        }
    }, [terminal, connected]);

    useEventListener(
        'resize',
        debounce(() => {
            if (terminal.element) {
                fitAddon.fit();
            }
        }, 100)
    );

    useEffect(() => {
        const listeners: Record<string, (s: string) => void> = {
            [SocketEvent.STATUS]: handlePowerChangeEvent,
            [SocketEvent.CONSOLE_OUTPUT]: handleConsoleOutput,
            [SocketEvent.INSTALL_OUTPUT]: handleConsoleOutput,
            [SocketEvent.TRANSFER_LOGS]: handleConsoleOutput,
            [SocketEvent.TRANSFER_STATUS]: handleTransferStatus,
            [SocketEvent.DAEMON_MESSAGE]: (line) => handleConsoleOutput(line, true),
            [SocketEvent.DAEMON_ERROR]: handleDaemonErrorOutput,
        };

        if (connected && instance) {
            if (!isTransferring) {
                terminal.clear();
            }

            Object.keys(listeners).forEach((key: string) => {
                instance.addListener(key, listeners[key]);
            });
            instance.send(SocketRequest.SEND_LOGS);
        }

        return () => {
            if (instance) {
                Object.keys(listeners).forEach((key: string) => {
                    instance.removeListener(key, listeners[key]);
                });
            }
        };
    }, [connected, instance]);

    return (
        <div className={'w-full rounded-2xl bg-[#070303] border border-[#D4AF37]/30 shadow-[0_8px_30px_rgba(0,0,0,0.7)] overflow-hidden relative'}>
            <SpinnerOverlay visible={!connected} size={'large'} />

            {/* Header Toolbar */}
            <div className={'flex items-center justify-between px-5 py-3.5 bg-[#0D0505] border-b border-[#D4AF37]/20'}>
                <div className={'flex items-center space-x-2.5 font-mono text-xs uppercase tracking-wider text-[#F2D675]'}>
                    <TerminalIcon className={'w-4 h-4 text-[#D4AF37]'} />
                    <span className={'font-bold'}>MONTE TOP CONSOLE</span>
                    <span className={'w-2 h-2 rounded-full bg-[#55d88a] shadow-[0_0_8px_#55d88a]'} />
                </div>

                <button
                    type={'button'}
                    onClick={copyLastLines}
                    disabled={!outputLines.length}
                    className={
                        'flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg border border-[#D4AF37]/40 text-[#F2D675] bg-[#210606] hover:bg-[#B88A20] hover:text-[#070303] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium'
                    }
                >
                    <Copy className={'w-3.5 h-3.5'} />
                    <span>Copy Last 100 Lines</span>
                </button>
            </div>

            <div className={classNames(styles.container, styles.overflows_container, 'p-3 bg-[#070303]')}>
                <div className={'h-full'}>
                    <div id={styles.terminal} ref={ref} />
                </div>
            </div>

            {canSendCommands && (
                <div className={'relative border-t border-[#D4AF37]/20 bg-[#0D0505]'}>
                    <div className={'absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]'}>
                        <ChevronRight className={'w-5 h-5'} />
                    </div>
                    <input
                        className={
                            'w-full pl-11 pr-4 py-3 bg-transparent text-[#FFFFFF] placeholder-[#A89F9F]/60 text-sm font-mono outline-none border-none focus:ring-0'
                        }
                        type={'text'}
                        placeholder={'Type a command...'}
                        aria-label={'Console command input.'}
                        disabled={!instance || !connected}
                        onKeyDown={handleCommandKeyDown}
                        autoCorrect={'off'}
                        autoCapitalize={'none'}
                    />
                </div>
            )}
        </div>
    );
};
