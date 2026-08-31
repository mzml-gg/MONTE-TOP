import React from 'react';
import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';

interface Props {
    isLoading?: boolean;
    size?: 'xsmall' | 'small' | 'large' | 'xlarge';
    color?: 'green' | 'red' | 'primary' | 'grey';
    isSecondary?: boolean;
}

const ButtonStyle = styled.button<Omit<Props, 'isLoading'>>`
    ${tw`relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none`};

    height: 40px;
    border-radius: 10px;

    /* Base Tactile FX */
    &:active:not(:disabled) {
        transform: scale(0.97);
    }

    /* Primary MONTE TOP Button (Dark Crimson + Gold Edge + Metallic Gold Hover) */
    ${(props) =>
        ((!props.isSecondary && !props.color) || props.color === 'primary') &&
        css<Props>`
            background-color: #210606;
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: #F2D675;
            box-shadow: 0 4px 15px rgba(33, 6, 6, 0.4), inset 0 1px 0 rgba(242, 214, 117, 0.15);

            &:hover:not(:disabled) {
                background-color: #B88A20;
                border-color: #F2D675;
                color: #070303;
                box-shadow: 0 0 20px rgba(212, 175, 55, 0.35);
            }
        `};

    /* Secondary Glass Button */
    ${(props) =>
        props.isSecondary &&
        css<Props>`
            background-color: rgba(13, 5, 5, 0.6);
            border: 1px solid rgba(212, 175, 55, 0.2);
            color: #FFFFFF;
            backdrop-filter: blur(8px);

            &:hover:not(:disabled) {
                background-color: rgba(58, 10, 10, 0.5);
                border-color: rgba(212, 175, 55, 0.5);
                color: #F2D675;
                box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
            }
        `};

    /* Grey / Neutral Button */
    ${(props) =>
        props.color === 'grey' &&
        css`
            background-color: #0D0505;
            border: 1px solid rgba(168, 159, 159, 0.2);
            color: #A89F9F;

            &:hover:not(:disabled) {
                background-color: #210606;
                border-color: rgba(212, 175, 55, 0.3);
                color: #FFFFFF;
            }
        `};

    /* Green / Success Button */
    ${(props) =>
        props.color === 'green' &&
        css<Props>`
            background-color: rgba(85, 216, 138, 0.15);
            border: 1px solid rgba(85, 216, 138, 0.5);
            color: #55d88a;

            &:hover:not(:disabled) {
                background-color: #55d88a;
                color: #070303;
                box-shadow: 0 0 20px rgba(85, 216, 138, 0.4);
            }
        `};

    /* Red / Danger Button */
    ${(props) =>
        props.color === 'red' &&
        css<Props>`
            background-color: rgba(58, 10, 10, 0.7);
            border: 1px solid rgba(255, 107, 107, 0.5);
            color: #ff6b6b;

            &:hover:not(:disabled) {
                background-color: #ff6b6b;
                color: #070303;
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
            }
        `};

    /* Sizes */
    ${(props) => props.size === 'xsmall' && css`
        height: 32px;
        padding: 0 12px;
        font-size: 0.75rem;
    `};

    ${(props) => (!props.size || props.size === 'small') && css`
        height: 40px;
        padding: 0 18px;
        font-size: 0.875rem;
    `};

    ${(props) => props.size === 'large' && css`
        height: 46px;
        padding: 0 24px;
        font-size: 0.95rem;
    `};

    ${(props) => props.size === 'xlarge' && css`
        height: 50px;
        width: 100%;
        font-size: 1rem;
    `};
`;

type ComponentProps = Omit<JSX.IntrinsicElements['button'], 'ref' | keyof Props> & Props;

const Button: React.FC<ComponentProps> = ({ children, isLoading, ...props }) => (
    <ButtonStyle {...props}>
        {isLoading && (
            <div css={tw`flex absolute justify-center items-center w-full h-full left-0 top-0`}>
                <Spinner size={'small'} />
            </div>
        )}
        <span css={isLoading ? tw`text-transparent` : undefined}>{children}</span>
    </ButtonStyle>
);

type LinkProps = Omit<JSX.IntrinsicElements['a'], 'ref' | keyof Props> & Props;

const LinkButton: React.FC<LinkProps> = (props) => <ButtonStyle as={'a'} {...props} />;

export { LinkButton, ButtonStyle };
export default Button;
