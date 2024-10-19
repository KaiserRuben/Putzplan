import { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import styled, { css } from 'styled-components';

const generateKeyframes = () => {
    let styles = '';
    for (let i = 0; i < 50; i++) {
        const rotate = Math.random() < 0.5 ? '' : 'rotate(720deg)';
        styles += `
      @keyframes fall-${i} {
        to {
          transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px) ${rotate};
        }
      }
    `;
    }
    return css`${styles}`;
};

const ConfettiContainer = styled(animated.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  ${generateKeyframes()}
`;

const ConfettiPiece = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${props => props.color};
  border-radius: 50%;
  left: ${props => props.left}%;
  top: -5%;
  animation: ${props => css`fall-${props.index} ${2 + Math.random() * 3}s linear infinite`};
`;

const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

const Confetti = ({ show }) => {
    const [pieces] = useState(() =>
        Array.from({ length: 50 }, (_, i) => ({
            left: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            index: i,
        }))
    );

    const springProps = useSpring({
        opacity: show ? 1 : 0,
        from: { opacity: 0 },
    });

    return (
        <ConfettiContainer style={springProps}>
            {pieces.map((piece, i) => (
                <ConfettiPiece key={i} {...piece} />
            ))}
        </ConfettiContainer>
    );
};

export default Confetti;