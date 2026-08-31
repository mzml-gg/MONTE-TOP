import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';
// @ts-expect-error untyped font file
import font from '@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2';

export default createGlobalStyle`
    @font-face {
        font-family: 'IBM Plex Sans';
        font-style: normal;
        font-display: swap;
        font-weight: 100 700;
        src: url(${font}) format('woff2-variations');
        unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
    }

    :root {
        --mt-bg: #070303;
        --mt-secondary: #0D0505;
        --mt-deep-crimson: #210606;
        --mt-crimson: #3A0A0A;
        --mt-gold: #D4AF37;
        --mt-bright-gold: #F2D675;
        --mt-metallic-gold: #B88A20;
        --mt-white: #FFFFFF;
        --mt-muted: #A89F9F;
    }

    body {
        ${tw`font-sans text-neutral-100`};
        background-color: var(--mt-bg) !important;
        letter-spacing: 0.015em;
        margin: 0;
        padding: 0;
        min-height: 100vh;
        width: 100vw;
        overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
        color: var(--mt-white);
    }

    p {
        ${tw`leading-snug font-sans`};
        color: var(--mt-muted);
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: var(--mt-bg);
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background: var(--mt-metallic-gold);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: var(--mt-bright-gold);
    }

    ::-webkit-scrollbar-track {
        background: var(--mt-secondary);
    }
`;
