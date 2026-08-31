import React, { useEffect, useRef } from 'react';
import { ServerContext } from '@/state/server';
import { SocketEvent } from '@/components/server/events';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import { Line } from 'react-chartjs-2';
import { useChart, useChartTickLabel } from '@/components/server/console/chart';
import { bytesToString } from '@/lib/formatters';
import { ArrowDownRight, ArrowUpRight, Cpu, HardDrive, Network as NetworkIcon } from 'lucide-react';
import ChartBlock from '@/components/server/console/ChartBlock';
import Tooltip from '@/components/elements/tooltip/Tooltip';

export default () => {
    const status = ServerContext.useStoreState((state) => state.status.value);
    const limits = ServerContext.useStoreState((state) => state.server.data!.limits);
    const previous = useRef<Record<'tx' | 'rx', number>>({ tx: -1, rx: -1 });

    const cpu = useChartTickLabel('CPU', limits.cpu, '%', 2);
    const memory = useChartTickLabel('Memory', limits.memory, 'MiB');
    const network = useChart('Network', {
        sets: 2,
        options: {
            scales: {
                y: {
                    ticks: {
                        callback(value) {
                            return bytesToString(typeof value === 'string' ? parseInt(value, 10) : value);
                        },
                        color: '#A89F9F',
                    },
                    grid: {
                        color: 'rgba(212, 175, 55, 0.08)',
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
        callback(opts, index) {
            return {
                ...opts,
                label: !index ? 'Network In' : 'Network Out',
                borderColor: !index ? '#F2D675' : '#B88A20',
                backgroundColor: !index ? 'rgba(242, 214, 117, 0.15)' : 'rgba(184, 138, 32, 0.15)',
                tension: 0.4,
                fill: true,
            };
        },
    });

    // Custom dark crimson & gold line styling
    if (cpu.props.data && cpu.props.data.datasets && cpu.props.data.datasets[0]) {
        cpu.props.data.datasets[0].borderColor = '#D4AF37';
        cpu.props.data.datasets[0].backgroundColor = 'rgba(58, 10, 10, 0.4)';
        cpu.props.data.datasets[0].tension = 0.4;
        cpu.props.data.datasets[0].fill = true;
    }

    if (memory.props.data && memory.props.data.datasets && memory.props.data.datasets[0]) {
        memory.props.data.datasets[0].borderColor = '#F2D675';
        memory.props.data.datasets[0].backgroundColor = 'rgba(33, 6, 6, 0.5)';
        memory.props.data.datasets[0].tension = 0.4;
        memory.props.data.datasets[0].fill = true;
    }

    useEffect(() => {
        if (status === 'offline') {
            cpu.clear();
            memory.clear();
            network.clear();
        }
    }, [status]);

    useWebsocketEvent(SocketEvent.STATS, (data: string) => {
        let values: any = {};
        try {
            values = JSON.parse(data);
        } catch (e) {
            return;
        }
        cpu.push(values.cpu_absolute);
        memory.push(Math.floor(values.memory_bytes / 1024 / 1024));
        network.push([
            previous.current.tx < 0 ? 0 : Math.max(0, values.network.tx_bytes - previous.current.tx),
            previous.current.rx < 0 ? 0 : Math.max(0, values.network.rx_bytes - previous.current.rx),
        ]);

        previous.current = { tx: values.network.tx_bytes, rx: values.network.rx_bytes };
    });

    return (
        <>
            <ChartBlock
                title={'CPU Load'}
                legend={
                    <span className={'flex items-center space-x-1'}>
                        <Cpu className={'w-3.5 h-3.5 text-[#D4AF37]'} />
                        <span>Limit: {limits.cpu ? `${limits.cpu}%` : 'Unlimited'}</span>
                    </span>
                }
            >
                <Line {...cpu.props} />
            </ChartBlock>

            <ChartBlock
                title={'Memory Usage'}
                legend={
                    <span className={'flex items-center space-x-1'}>
                        <HardDrive className={'w-3.5 h-3.5 text-[#F2D675]'} />
                        <span>Limit: {limits.memory ? `${limits.memory} MiB` : 'Unlimited'}</span>
                    </span>
                }
            >
                <Line {...memory.props} />
            </ChartBlock>

            <ChartBlock
                title={'Network Bandwidth'}
                legend={
                    <div className={'flex items-center space-x-3'}>
                        <Tooltip arrow content={'Inbound (In)'}>
                            <span className={'flex items-center text-[#F2D675]'}>
                                <ArrowDownRight className={'w-3.5 h-3.5 mr-1'} /> In
                            </span>
                        </Tooltip>
                        <Tooltip arrow content={'Outbound (Out)'}>
                            <span className={'flex items-center text-[#B88A20]'}>
                                <ArrowUpRight className={'w-3.5 h-3.5 mr-1'} /> Out
                            </span>
                        </Tooltip>
                    </div>
                }
            >
                <Line {...network.props} />
            </ChartBlock>
        </>
    );
};
