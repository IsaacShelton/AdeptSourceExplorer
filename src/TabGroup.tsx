import React, { useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import CallDistribution from './CallDistribution';
import OverviewFlow from './OverviewFlow';

const Tab = styled.button`
  font-size: 20px;
  padding: 10px 60px;
  margin-left: 4px;
  margin-right: 4px;
  border-style: none;
  cursor: pointer;
  opacity: 1.0;
  background: transparent;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  text-transform: lowercase;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
  color: white;
  padding-top: 6px;
  outline: 0;
  -webkit-transition: background-color 100ms ease-in;
  -ms-transition: background-color 100ms ease-in;
  transition: background-color 100ms ease-in;
  border-radius: 20px;
  ${({ active }: any) =>
        active &&
        `
  background-color: rgba(255,255,255,0.1);
  border-radius: 20px;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
  justify-content: left;
  height: 40px;
  width: 100vw;
  position: absolute;
  background-color: rgba(50, 50, 50);
//   background-color: rgba(255,255,255,0.2);
//   backdrop-filter: blur(2px);
`;

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);

    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', updateSize);
        updateSize();

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}

const types = ['Query', 'Function View', 'Call Distribution'];

function tabContent(kind: string): JSX.Element {
    switch (kind) {
        case 'Function View':
            return <OverviewFlow />;
        case 'Call Distribution':
            return <CallDistribution />;
        default:
            return <p></p>;
    }
}

export default function TabGroup() {
    const [active, setActive] = useState(types[0]);
    const [width, height] = useWindowSize();

    return (
        <div style={{
            position: "absolute", display: "flex", margin: 0, "padding": 0, width, height
        }} >
            <div style={{ position: "absolute", width: "100%", height: "100%" }}>
                {tabContent(active)}
            </div>
            <ButtonGroup>
                {types.map(type => (
                    <Tab
                        key={type}
                        // @ts-ignore
                        active={active === type}
                        onClick={() => setActive(type)}
                    >
                        {type}
                    </Tab>
                ))}
            </ButtonGroup>
        </div >
    );
}