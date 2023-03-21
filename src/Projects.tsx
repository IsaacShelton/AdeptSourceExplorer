
import { useCallback, useId, useLayoutEffect, useRef } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import './Projects.scss';

import wave1 from './assets/wave1.svg';
import wave2 from './assets/wave2.svg';
import wave3 from './assets/wave3.svg';
import wave4 from './assets/wave4.svg';
import wave5 from './assets/wave5.svg';

export default function Projects({ useProjectGlobalState }: any) {
    let [projectID, setProjectID] = useProjectGlobalState('projectID');

    return <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 48,
        marginBottom: 48,
        width: '100%',
        justifyContent: 'center',
    }}>
        <NewProject name="Project1" created={1235234} lastOpened={1231432} projectID={-1000} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={1} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={2} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={3} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={4} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={5} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={6} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={7} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={8} />
        <Project useProjectGlobalState={useProjectGlobalState} name="Project1" created={1235234} lastOpened={1231432} projectID={9} />
    </div >;
}

function choose(choices: any[]) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function Project({ name, created, lastOpened, projectID, useProjectGlobalState }: any) {
    let [activeProjectID, setActiveProjectID] = useProjectGlobalState('projectID');

    let active = activeProjectID == projectID;

    let backgrounds = [
        { icon: wave1, text: 'white' },
        { icon: wave2, text: 'white' },
        { icon: wave3, text: 'white' },
        { icon: wave4, text: 'white' },
        { icon: wave5, text: '#444444' },
    ]

    let bg = backgrounds[projectID % backgrounds.length]; //choose(backgrounds);

    let playStop = useCallback(() => {
        if (activeProjectID == projectID) {
            setActiveProjectID(-1);
        } else {
            setActiveProjectID(projectID);
        }
    }, [activeProjectID]);

    let ref: any = useRef(null);

    useLayoutEffect(() => {
        let length = ref.current.getTotalLength();
        let dasharray = length / 8;

        ref.current.setAttribute('stroke-dasharray', dasharray);
        ref.current.firstChild.setAttribute("values", `${length};0`);
    }, []);

    let icon = bg.icon;

    return <div style={{ position: 'relative', margin: 12, width: 512, height: 256, marginBottom: 64 }}>
        <div style={{ position: 'absolute', padding: 24, margin: 16, width: '100%', height: '100%' }}>
            <p>Name: {name}</p>
            <p>Created: {created}</p>
            <p>Last Opened: {lastOpened}</p>
            <p>GenericCardGame/main.adept</p>
            <div style={{ display: 'flex', paddingRight: 32, paddingTop: 16, alignItems: 'center', justifyContent: 'right' }}>
                {
                    (bg.text == 'white') &&
                    <>
                        <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                        <img src="settings-white.svg" width={32} height={32} />
                    </>
                }
                {
                    (bg.text != 'white') &&
                    <>
                        <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                        <img src="settings-black.svg" width={32} height={32} />
                    </>
                }
            </div>
        </div>
        <svg id="visual" viewBox="-10 -10 532 276" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" preserveAspectRatio='none' width={512} height={304}>
            <rect ref={ref} opacity={active ? 1 : 0} style={{ transition: 'opacity 0.3s ease-in-out' }} x="0" y="0" rx="50px" width="512" height="256" fill="transparent" strokeLinecap='square' stroke='white' strokeWidth={16} strokeDashoffset={0}>
                <animate attributeName="stroke-dashoffset"
                    dur="10s"
                    calcMode="linear"
                    repeatCount="indefinite" />
            </rect>
            <mask id="myMask">
                <rect x="0" y="0" width="512" height="256" rx="50" fill="white" />
            </mask>
            <g mask="url(#myMask)">
                <path fill="#6198ff" d="M0 121L13.7 122C27.3 123 54.7 125 82 147C109.3 169 136.7 211 163.8 218C191 225 218 197 245.2 191C272.3 185 299.7 201 327 194C354.3 187 381.7 157 409 145C436.3 133 463.7 139 491 140C518.3 141 545.7 137 573 135C600.3 133 627.7 133 654.8 155C682 177 709 221 736.2 233C763.3 245 790.7 225 818 205C845.3 185 872.7 165 886.3 155L900 145L900 0L886.3 0C872.7 0 845.3 0 818 0C790.7 0 763.3 0 736.2 0C709 0 682 0 654.8 0C627.7 0 600.3 0 573 0C545.7 0 518.3 0 491 0C463.7 0 436.3 0 409 0C381.7 0 354.3 0 327 0C299.7 0 272.3 0 245.2 0C218 0 191 0 163.8 0C136.7 0 109.3 0 82 0C54.7 0 27.3 0 13.7 0L0 0Z"></path> <path fill="#3c80ff" d="M0 313L13.7 312C27.3 311 54.7 309 82 315C109.3 321 136.7 335 163.8 335C191 335 218 321 245.2 320C272.3 319 299.7 331 327 334C354.3 337 381.7 331 409 334C436.3 337 463.7 349 491 365C518.3 381 545.7 401 573 402C600.3 403 627.7 385 654.8 380C682 375 709 383 736.2 391C763.3 399 790.7 407 818 403C845.3 399 872.7 383 886.3 375L900 367L900 143L886.3 153C872.7 163 845.3 183 818 203C790.7 223 763.3 243 736.2 231C709 219 682 175 654.8 153C627.7 131 600.3 131 573 133C545.7 135 518.3 139 491 138C463.7 137 436.3 131 409 143C381.7 155 354.3 185 327 192C299.7 199 272.3 183 245.2 189C218 195 191 223 163.8 216C136.7 209 109.3 167 82 145C54.7 123 27.3 121 13.7 120L0 119Z"></path> <path fill="#0066ff" d="M0 451L13.7 450C27.3 449 54.7 447 82 438C109.3 429 136.7 413 163.8 408C191 403 218 409 245.2 412C272.3 415 299.7 415 327 426C354.3 437 381.7 459 409 469C436.3 479 463.7 477 491 479C518.3 481 545.7 487 573 480C600.3 473 627.7 453 654.8 457C682 461 709 489 736.2 497C763.3 505 790.7 493 818 480C845.3 467 872.7 453 886.3 446L900 439L900 365L886.3 373C872.7 381 845.3 397 818 401C790.7 405 763.3 397 736.2 389C709 381 682 373 654.8 378C627.7 383 600.3 401 573 400C545.7 399 518.3 379 491 363C463.7 347 436.3 335 409 332C381.7 329 354.3 335 327 332C299.7 329 272.3 317 245.2 318C218 319 191 333 163.8 333C136.7 333 109.3 319 82 313C54.7 307 27.3 309 13.7 310L0 311Z"></path> <path fill="#0059dd" d="M0 493L13.7 492C27.3 491 54.7 489 82 490C109.3 491 136.7 495 163.8 498C191 501 218 503 245.2 505C272.3 507 299.7 509 327 518C354.3 527 381.7 543 409 548C436.3 553 463.7 547 491 544C518.3 541 545.7 541 573 540C600.3 539 627.7 537 654.8 540C682 543 709 551 736.2 551C763.3 551 790.7 543 818 533C845.3 523 872.7 511 886.3 505L900 499L900 437L886.3 444C872.7 451 845.3 465 818 478C790.7 491 763.3 503 736.2 495C709 487 682 459 654.8 455C627.7 451 600.3 471 573 478C545.7 485 518.3 479 491 477C463.7 475 436.3 477 409 467C381.7 457 354.3 435 327 424C299.7 413 272.3 413 245.2 410C218 407 191 401 163.8 406C136.7 411 109.3 427 82 436C54.7 445 27.3 447 13.7 448L0 449Z"></path> <path fill="#004cbb" d="M0 601L13.7 601C27.3 601 54.7 601 82 601C109.3 601 136.7 601 163.8 601C191 601 218 601 245.2 601C272.3 601 299.7 601 327 601C354.3 601 381.7 601 409 601C436.3 601 463.7 601 491 601C518.3 601 545.7 601 573 601C600.3 601 627.7 601 654.8 601C682 601 709 601 736.2 601C763.3 601 790.7 601 818 601C845.3 601 872.7 601 886.3 601L900 601L900 497L886.3 503C872.7 509 845.3 521 818 531C790.7 541 763.3 549 736.2 549C709 549 682 541 654.8 538C627.7 535 600.3 537 573 538C545.7 539 518.3 539 491 542C463.7 545 436.3 551 409 546C381.7 541 354.3 525 327 516C299.7 507 272.3 505 245.2 503C218 501 191 499 163.8 496C136.7 493 109.3 489 82 488C54.7 487 27.3 489 13.7 490L0 491Z"></path>
            </g>
        </svg>
    </div>
    //-----------

    // return <div style={{ margin: 16, padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: 'transparent', color: bg.text }}>
    //     <p>Name: {name}</p>
    //     <p>Created: {created}</p>
    //     <p>Last Opened: {lastOpened}</p>
    //     <p>GenericCardGame/main.adept</p>
    //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
    //         {
    //             (bg.text == 'white') &&
    //             <>
    //                 <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                 <img src="settings-white.svg" width={32} height={32} />
    //             </>
    //         }
    //         {
    //             (bg.text != 'white') &&
    //             <>
    //                 <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                 <img src="settings-black.svg" width={32} height={32} />
    //             </>
    //         }
    //     </div>
    // </div>

    /*
    return <div className={active ? 'animated-border animated-border-active' : 'animated-border'} style={{ margin: 16 }}>
        <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: 'transparent', color: bg.text }}>
            <p>Name: {name}</p>
            <p>Created: {created}</p>
            <p>Last Opened: {lastOpened}</p>
            <p>GenericCardGame/main.adept</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                {
                    (bg.text == 'white') &&
                    <>
                        <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                        <img src="settings-white.svg" width={32} height={32} />
                    </>
                }
                {
                    (bg.text != 'white') &&
                    <>
                        <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
                        <img src="settings-black.svg" width={32} height={32} />
                    </>
                }
            </div>
        </div>
    </div>;
    */

    // return <div className={active ? 'animated-border animated-border-active' : 'animated-border'} style={{ margin: 16 }}>
    //     //{/* <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', backgroundImage: `url(./${bg.name}.svg)`, color: bg.text }}> */}
    //     <div style={{ padding: 40, justifyContent: 'center', borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', backgroundImage: `url(${icon})`, color: bg.text }}>
    //         <p>Name: {name}</p>
    //         <p>Created: {created}</p>
    //         <p>Last Opened: {lastOpened}</p>
    //         <p>GenericCardGame/main.adept</p>
    //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
    //             {
    //                 (bg.text == 'white') &&
    //                 <>
    //                     <img src={active ? "stop-white.svg" : "play-white.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                     <img src="settings-white.svg" width={32} height={32} />
    //                 </>
    //             }
    //             {
    //                 (bg.text != 'white') &&
    //                 <>
    //                     <img src={active ? "stop-black.svg" : "play-black.svg"} width={40} height={40} style={{ marginRight: 20 }} onClick={playStop} />
    //                     <img src="settings-black.svg" width={32} height={32} />
    //                 </>
    //             }
    //         </div>
    //     </div>
    // </div>;
}

function NewProject({ name, created, lastOpened, projectID }: any) {
    let backgrounds = [
        { name: 'wave1', text: 'white' },
        { name: 'wave2', text: 'white' },
        { name: 'wave3', text: 'white' },
        { name: 'wave4', text: 'white' },
        { name: 'wave5', text: '#444444' },
    ]

    let bg = choose(backgrounds);

    return <div style={{ cursor: 'pointer', display: 'flex', height: 296, alignItems: 'center', justifyContent: 'center', margin: 16, borderRadius: 50, minWidth: 512, maxWidth: 640, backgroundColor: '#1C1C1C', color: bg.text }}>
        <p style={{ alignContent: 'center', justifyContent: 'center', fontSize: 60, color: '#333333' }}>+</p>
    </div>;
}
