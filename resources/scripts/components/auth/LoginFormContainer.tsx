import React, { forwardRef } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import { Cpu } from 'lucide-react';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <div className={'min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#070303] bg-radial from-[#3A0A0A]/40 via-[#070303] to-[#070303]'}>
        <div className={'w-full max-w-md'}>
            <div className={'flex flex-col items-center mb-8 text-center'}>
                <div className={'w-14 h-14 rounded-2xl bg-[#3A0A0A] border border-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-3'}>
                    <Cpu className={'w-8 h-8 text-[#F2D675]'} />
                </div>
                <h1 className={'font-extrabold text-3xl text-[#F2D675] tracking-widest font-mono uppercase'}>
                    MONTE TOP
                </h1>
                <p className={'text-xs text-[#A89F9F] tracking-wider uppercase font-mono mt-1'}>
                    Cloud Infrastructure Panel
                </p>
            </div>

            <FlashMessageRender className={'mb-4'} />

            <Form {...props} ref={ref} className={'bg-[#0D0505]/90 border border-[#D4AF37]/30 rounded-2xl p-8 shadow-[0_16px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl'}>
                {title && (
                    <h2 className={'text-xl font-bold text-[#FFFFFF] text-center mb-6 font-mono tracking-tight'}>
                        {title}
                    </h2>
                )}
                {props.children}
            </Form>

            <p className={'text-center text-[#A89F9F]/60 text-xs mt-6 font-mono'}>
                &copy; {new Date().getFullYear()} MONTE TOP &bull; Powered by Pterodactyl
            </p>
        </div>
    </div>
));
