import { choose } from '@/logic/random';

const map = {
    blue: {
        colors: ['#6198ff', '#3c80ff', '#0066ff', '#0059dd', '#004cbb'],
    },
    green: {
        colors: ['#36b796', '#21a584', '#009473', '#008064', '#006c55'],
    },
    purple: {
        colors: ['#9e90fa', '#8877f6', '#715df2', '#614dd5', '#513eb8'],
    },
    red: {
        defs: (
            <defs id="defs15">
                <filter
                    colorInterpolationFilters="sRGB"
                    id="filterRed"
                    x="0"
                    y="0"
                    width="1"
                    height="1"
                >
                    <feColorMatrix
                        type="hueRotate"
                        values="109"
                        result="color1"
                        id="feColorMatrix"
                    />
                    <feColorMatrix
                        type="saturate"
                        values="0.88785"
                        result="color2"
                        id="feColorMatrix"
                    />
                </filter>
            </defs>
        ),
        filter: 'url(#filterRed)',
        colors: ['#9e90fa', '#8877f6', '#715df2', '#614dd5', '#513eb8'],
    },
    yellow: {
        defs: (
            <defs>
                <filter
                    colorInterpolationFilters="sRGB"
                    id="filterYellow"
                    x="0"
                    y="0"
                    width="1"
                    height="1"
                >
                    <feColorMatrix
                        type="saturate"
                        values="0"
                        result="result3"
                        id="feColorMatrix16256"
                    />
                    <feColorMatrix
                        in="SourceGraphic"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 -0.5 -0.5 0 0 "
                        result="colormatrix"
                        id="feColorMatrix16258"
                    />
                    <feFlood
                        floodColor="rgb(68,0,134)"
                        result="result1"
                        floodOpacity="1"
                        id="feFlood16260"
                    />
                    <feComposite
                        in2="colormatrix"
                        operator="in"
                        result="result2"
                        id="feComposite16262"
                    />
                    <feComposite
                        in2="colormatrix"
                        result="result12"
                        operator="arithmetic"
                        k2="1"
                        k3="-0.5"
                        id="feComposite16264"
                    />
                    <feBlend
                        in2="result3"
                        mode="normal"
                        in="result12"
                        result="result6"
                        id="feBlend16266"
                    />
                    <feColorMatrix
                        result="colormatrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.5 1 -0.5 0 0 "
                        in="SourceGraphic"
                        id="feColorMatrix16268"
                    />
                    <feFlood
                        floodColor="rgb(254,63,0)"
                        result="result4"
                        floodOpacity="1"
                        id="feFlood16270"
                    />
                    <feComposite
                        in2="colormatrix"
                        operator="in"
                        result="result5"
                        id="feComposite16272"
                    />
                    <feComposite
                        in2="colormatrix"
                        result="result13"
                        operator="arithmetic"
                        k2="1"
                        k3="-0.5"
                        id="feComposite16274"
                    />
                    <feBlend
                        in2="result6"
                        in="result13"
                        mode="normal"
                        result="result9"
                        id="feBlend16276"
                    />
                    <feColorMatrix
                        in="SourceGraphic"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.5 -0.5 1 0 0 "
                        result="colormatrix"
                        id="feColorMatrix16278"
                    />
                    <feFlood
                        floodColor="rgb(255,204,0)"
                        result="result7"
                        floodOpacity="1"
                        id="feFlood16280"
                    />
                    <feComposite
                        in2="colormatrix"
                        operator="in"
                        result="result8"
                        id="feComposite16282"
                    />
                    <feComposite
                        in2="colormatrix"
                        result="result14"
                        operator="arithmetic"
                        k2="1"
                        k3="-0.5"
                        id="feComposite16284"
                    />
                    <feBlend
                        in2="result9"
                        mode="normal"
                        in="result14"
                        result="result10"
                        id="feBlend16286"
                    />
                    <feComposite
                        in2="SourceGraphic"
                        operator="in"
                        result="fbSourceGraphic"
                        in="result10"
                        id="feComposite16288"
                    />
                    <feColorMatrix
                        result="fbSourceGraphicAlpha"
                        in="fbSourceGraphic"
                        values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
                        id="feColorMatrix16859"
                    />
                    <feColorMatrix
                        id="feColorMatrix16861"
                        values="1.80906 0 0 0.113635 -0.404531 0 1.80906 0 0.113635 -0.404531 0 0 1.80906 0.113635 -0.404531 0 0 0 1 0"
                        in="fbSourceGraphic"
                    />
                </filter>
            </defs>
        ),
        colors: ['#6198ff', '#3c80ff', '#0066ff', '#0059dd', '#004cbb'],
        filter: 'url(#filterYellow)',
    },
};

export function randomVariation() {
    return choose(['blue', 'green', 'purple', 'red', 'yellow']);
}

export type WaveColor = 'blue' | 'green' | 'purple' | 'red' | 'yellow';

export function Wave(props: { color: WaveColor }) {
    let { colors, defs, filter }: any = map[props.color];

    let style = {
        filter,
    };

    return (
        <>
            {defs}
            <path
                style={style}
                fill={colors[0]}
                id="path9"
                d="m 0,0 v 121 l 13.699219,1 c 13.599986,1 41.000808,3.00002 68.300781,25 27.29997,21.99998 54.70081,64.00001 81.80078,71 27.19997,6.99999 54.19847,-21.00001 81.39844,-27 27.09997,-5.99999 54.50081,9.99999 81.80078,3 27.29997,-6.99999 54.70003,-37.00001 82,-49 27.29997,-11.99999 54.70003,-6 82,-5 27.29997,1 54.70003,-3 82,-5 10.74709,-0.78733 21.50999,-1.20311 32.26367,-0.15039 V 0 H 573 491 409 327 245.19922 163.80078 82 13.699219 Z"
            />
            <path
                style={style}
                fill={colors[1]}
                id="path11"
                d="m 0,119 v 194 l 13.699219,-1 C 27.299205,311 54.700027,309.00001 82,315 c 27.29997,5.99999 54.70081,20 81.80078,20 27.19997,0 54.19847,-14 81.39844,-15 27.09997,-1 54.50081,11 81.80078,14 27.29997,3 54.70003,-3 82,0 27.29997,3 54.70003,15.00002 82,31 27.29997,15.99998 54.70003,36 82,37 10.58759,0.38782 21.19082,-2.10536 31.78516,-5.56641 V 132.78711 C 594.19075,131.79447 583.58766,132.22435 573,133 c -27.29997,2 -54.70003,6 -82,5 -27.29997,-1 -54.70003,-6.99999 -82,5 -27.29997,11.99999 -54.70003,42.00001 -82,49 -27.29997,6.99999 -54.70081,-8.99999 -81.80078,-3 -27.19997,5.99999 -54.19847,33.99999 -81.39844,27 C 136.70081,209.00001 109.29997,166.99998 82,145 54.700027,123.00002 27.299205,121 13.699219,120 Z"
            />
        </>
    );
}
