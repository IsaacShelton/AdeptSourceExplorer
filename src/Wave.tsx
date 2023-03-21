import { choose } from "@/random";

let map: any = {
    "blue": {
        colors: ['#6198ff', '#3c80ff', '#0066ff', '#0059dd', '#004cbb']
    },
    "green": {
        colors: ['#36b796', '#21a584', '#009473', '#008064', '#006c55']
    },
    "purple": {
        colors: ['#9e90fa', '#8877f6', '#715df2', '#614dd5', '#513eb8']
    },
    "red": {
        defs: (<defs
            id="defs15">
            <filter
                colorInterpolationFilters='sRGB'
                id="filterRed"
                x="0"
                y="0"
                width="1"
                height="1">
                <feColorMatrix
                    type="hueRotate"
                    values="109"
                    result="color1"
                    id="feColorMatrix" />
                <feColorMatrix
                    type="saturate"
                    values="0.88785"
                    result="color2"
                    id="feColorMatrix" />
            </filter>
        </defs>),
        filter: 'url(#filterRed)',
        colors: ['#9e90fa', '#8877f6', '#715df2', '#614dd5', '#513eb8']
    },
    "yellow": {
        defs: (<defs>
            <filter
                colorInterpolationFilters="sRGB"
                id="filterYellow"
                x="0"
                y="0"
                width="1"
                height="1">
                <feColorMatrix
                    type="saturate"
                    values="0"
                    result="result3"
                    id="feColorMatrix16256" />
                <feColorMatrix
                    in="SourceGraphic"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 -0.5 -0.5 0 0 "
                    result="colormatrix"
                    id="feColorMatrix16258" />
                <feFlood
                    floodColor="rgb(68,0,134)"
                    result="result1"
                    floodOpacity="1"
                    id="feFlood16260" />
                <feComposite
                    in2="colormatrix"
                    operator="in"
                    result="result2"
                    id="feComposite16262" />
                <feComposite
                    in2="colormatrix"
                    result="result12"
                    operator="arithmetic"
                    k2="1"
                    k3="-0.5"
                    id="feComposite16264" />
                <feBlend
                    in2="result3"
                    mode="normal"
                    in="result12"
                    result="result6"
                    id="feBlend16266" />
                <feColorMatrix
                    result="colormatrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.5 1 -0.5 0 0 "
                    in="SourceGraphic"
                    id="feColorMatrix16268" />
                <feFlood
                    floodColor="rgb(254,63,0)"
                    result="result4"
                    floodOpacity="1"
                    id="feFlood16270" />
                <feComposite
                    in2="colormatrix"
                    operator="in"
                    result="result5"
                    id="feComposite16272" />
                <feComposite
                    in2="colormatrix"
                    result="result13"
                    operator="arithmetic"
                    k2="1"
                    k3="-0.5"
                    id="feComposite16274" />
                <feBlend
                    in2="result6"
                    in="result13"
                    mode="normal"
                    result="result9"
                    id="feBlend16276" />
                <feColorMatrix
                    in="SourceGraphic"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -0.5 -0.5 1 0 0 "
                    result="colormatrix"
                    id="feColorMatrix16278" />
                <feFlood
                    floodColor="rgb(255,204,0)"
                    result="result7"
                    floodOpacity="1"
                    id="feFlood16280" />
                <feComposite
                    in2="colormatrix"
                    operator="in"
                    result="result8"
                    id="feComposite16282" />
                <feComposite
                    in2="colormatrix"
                    result="result14"
                    operator="arithmetic"
                    k2="1"
                    k3="-0.5"
                    id="feComposite16284" />
                <feBlend
                    in2="result9"
                    mode="normal"
                    in="result14"
                    result="result10"
                    id="feBlend16286" />
                <feComposite
                    in2="SourceGraphic"
                    operator="in"
                    result="fbSourceGraphic"
                    in="result10"
                    id="feComposite16288" />
                <feColorMatrix
                    result="fbSourceGraphicAlpha"
                    in="fbSourceGraphic"
                    values="0 0 0 -1 0 0 0 0 -1 0 0 0 0 -1 0 0 0 0 1 0"
                    id="feColorMatrix16859" />
                <feColorMatrix
                    id="feColorMatrix16861"
                    values="1.80906 0 0 0.113635 -0.404531 0 1.80906 0 0.113635 -0.404531 0 0 1.80906 0.113635 -0.404531 0 0 0 1 0"
                    in="fbSourceGraphic" />
            </filter>
        </defs>),
        colors: ['#6198ff', '#3c80ff', '#0066ff', '#0059dd', '#004cbb'],
        filter: 'url(#filterYellow)',
    }
};

export function randomVariation() {
    return choose(['blue', 'green', 'purple', 'red', 'yellow']);
}

export function Wave({ color }: any) {
    let { colors, defs, filter }: any = map[color];

    let style = {
        filter,
    };

    return <>
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
        {/*
        <path style={style} fill={colors[0]}
            d="M0 121L13.7 122C27.3 123 54.7 125 82 147C109.3 169 136.7 211 163.8 218C191 225 218 197 245.2 191C272.3 185 299.7 201 327 194C354.3 187 381.7 157 409 145C436.3 133 463.7 139 491 140C518.3 141 545.7 137 573 135C600.3 133 627.7 133 654.8 155C682 177 709 221 736.2 233C763.3 245 790.7 225 818 205C845.3 185 872.7 165 886.3 155L900 145L900 0L886.3 0C872.7 0 845.3 0 818 0C790.7 0 763.3 0 736.2 0C709 0 682 0 654.8 0C627.7 0 600.3 0 573 0C545.7 0 518.3 0 491 0C463.7 0 436.3 0 409 0C381.7 0 354.3 0 327 0C299.7 0 272.3 0 245.2 0C218 0 191 0 163.8 0C136.7 0 109.3 0 82 0C54.7 0 27.3 0 13.7 0L0 0Z"></path>
        <path style={style} fill={colors[1]}
            d="M0 313L13.7 312C27.3 311 54.7 309 82 315C109.3 321 136.7 335 163.8 335C191 335 218 321 245.2 320C272.3 319 299.7 331 327 334C354.3 337 381.7 331 409 334C436.3 337 463.7 349 491 365C518.3 381 545.7 401 573 402C600.3 403 627.7 385 654.8 380C682 375 709 383 736.2 391C763.3 399 790.7 407 818 403C845.3 399 872.7 383 886.3 375L900 367L900 143L886.3 153C872.7 163 845.3 183 818 203C790.7 223 763.3 243 736.2 231C709 219 682 175 654.8 153C627.7 131 600.3 131 573 133C545.7 135 518.3 139 491 138C463.7 137 436.3 131 409 143C381.7 155 354.3 185 327 192C299.7 199 272.3 183 245.2 189C218 195 191 223 163.8 216C136.7 209 109.3 167 82 145C54.7 123 27.3 121 13.7 120L0 119Z"></path>
        <path style={style} fill={colors[2]}
            d="M0 451L13.7 450C27.3 449 54.7 447 82 438C109.3 429 136.7 413 163.8 408C191 403 218 409 245.2 412C272.3 415 299.7 415 327 426C354.3 437 381.7 459 409 469C436.3 479 463.7 477 491 479C518.3 481 545.7 487 573 480C600.3 473 627.7 453 654.8 457C682 461 709 489 736.2 497C763.3 505 790.7 493 818 480C845.3 467 872.7 453 886.3 446L900 439L900 365L886.3 373C872.7 381 845.3 397 818 401C790.7 405 763.3 397 736.2 389C709 381 682 373 654.8 378C627.7 383 600.3 401 573 400C545.7 399 518.3 379 491 363C463.7 347 436.3 335 409 332C381.7 329 354.3 335 327 332C299.7 329 272.3 317 245.2 318C218 319 191 333 163.8 333C136.7 333 109.3 319 82 313C54.7 307 27.3 309 13.7 310L0 311Z"></path>
        <path style={style} fill={colors[3]}
            d="M0 493L13.7 492C27.3 491 54.7 489 82 490C109.3 491 136.7 495 163.8 498C191 501 218 503 245.2 505C272.3 507 299.7 509 327 518C354.3 527 381.7 543 409 548C436.3 553 463.7 547 491 544C518.3 541 545.7 541 573 540C600.3 539 627.7 537 654.8 540C682 543 709 551 736.2 551C763.3 551 790.7 543 818 533C845.3 523 872.7 511 886.3 505L900 499L900 437L886.3 444C872.7 451 845.3 465 818 478C790.7 491 763.3 503 736.2 495C709 487 682 459 654.8 455C627.7 451 600.3 471 573 478C545.7 485 518.3 479 491 477C463.7 475 436.3 477 409 467C381.7 457 354.3 435 327 424C299.7 413 272.3 413 245.2 410C218 407 191 401 163.8 406C136.7 411 109.3 427 82 436C54.7 445 27.3 447 13.7 448L0 449Z"></path>
        <path style={style} fill={colors[4]}
            d="M0 601L13.7 601C27.3 601 54.7 601 82 601C109.3 601 136.7 601 163.8 601C191 601 218 601 245.2 601C272.3 601 299.7 601 327 601C354.3 601 381.7 601 409 601C436.3 601 463.7 601 491 601C518.3 601 545.7 601 573 601C600.3 601 627.7 601 654.8 601C682 601 709 601 736.2 601C763.3 601 790.7 601 818 601C845.3 601 872.7 601 886.3 601L900 601L900 497L886.3 503C872.7 509 845.3 521 818 531C790.7 541 763.3 549 736.2 549C709 549 682 541 654.8 538C627.7 535 600.3 537 573 538C545.7 539 518.3 539 491 542C463.7 545 436.3 551 409 546C381.7 541 354.3 525 327 516C299.7 507 272.3 505 245.2 503C218 501 191 499 163.8 496C136.7 493 109.3 489 82 488C54.7 487 27.3 489 13.7 490L0 491Z"></path>
*/}
    </>;
}