import React from 'react';

interface ChartBlockProps {
    title: string;
    legend?: React.ReactNode;
    children: React.ReactNode;
}

export default ({ title, legend, children }: ChartBlockProps) => (
    <div className={'bg-[#0D0505]/90 border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-200 flex flex-col justify-between'}>
        <div className={'flex items-center justify-between pb-3 mb-2 border-b border-[#D4AF37]/15'}>
            <h3 className={'font-mono font-bold text-xs uppercase tracking-wider text-[#F2D675] flex items-center space-x-2'}>
                <span className={'w-1.5 h-1.5 rounded-full bg-[#D4AF37]'} />
                <span>{title}</span>
            </h3>
            {legend && <div className={'text-xs text-[#A89F9F] flex items-center space-x-2 font-mono'}>{legend}</div>}
        </div>
        <div className={'w-full pt-1'}>{children}</div>
    </div>
);
