import { loader } from '@monaco-editor/react';

import * as monacoEditor from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { useEffect, useRef, useState } from 'react';
import { keywords, builtinTypes, constants } from './adept';
import { useProjectGlobalState } from './hooks/useProjectGlobalState';
import './code-highlight.css';

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new jsonWorker();
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new cssWorker();
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new htmlWorker();
        }
        if (label === 'typescript' || label === 'javascript') {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

loader.config({ monaco: monacoEditor });

const monacoInstance = loader.init();

export function CodeViewer(props: {}) {
    let ref: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
    let [code] = useProjectGlobalState('code');
    let [instance, setInstance] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
    let [range] = useProjectGlobalState('range');

    useEffect(() => {
        monacoInstance.then(monaco => {
            if (ref.current != null && ref.current.firstChild == null) {
                const properties: monacoEditor.editor.IStandaloneEditorConstructionOptions = {
                    value: '',
                    language: 'adept',
                    theme: 'vs-dark',
                    automaticLayout: true,
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    readOnly: true,
                };

                setupLanguage(monaco);
                setInstance(monaco.editor.create(ref.current, properties));
            }
        });
    }, [ref]);

    useEffect(() => {
        if (instance) {
            let model = instance.getModel();

            model?.setValue(code);

            if (range != null && model != null) {
                let { startIndex, endIndex } = range;

                let start = model.getPositionAt(startIndex);
                let end = model.getPositionAt(endIndex);

                instance.setPosition(start);
                instance.revealLineInCenter(start.lineNumber);

                model.deltaDecorations(
                    [],
                    [
                        {
                            range: new monacoEditor.Range(
                                start.lineNumber,
                                start.column,
                                end.lineNumber,
                                end.column
                            ),
                            options: {
                                className: 'code-highlight',
                                zIndex: -100,
                                isWholeLine: true,
                                overviewRuler: {
                                    color: '#555555',
                                    position: monacoEditor.editor.OverviewRulerLane.Full,
                                },
                            },
                        },
                    ]
                );
            }
        }
    }, [code, instance]);

    return (
        <div className="m-0 p-0 pt-10 w-full h-full">
            <div className="w-full h-full" ref={ref} />
        </div>
    );
}

const setupLanguage = (monaco: typeof monacoEditor) => {
    monaco.languages.register({ id: 'adept' });

    monaco.languages.setMonarchTokensProvider('adept', {
        keywords,
        builtinTypes,
        constants,
        escapes: /\\./,
        tokenizer: {
            root: [
                ['POD ', 'keyword'],
                [/[A-Z_][A-Z0-9\\]+[A-Za-z0-9_]*/, 'variable'],
                [
                    '[a-zA-Z_\\\\][a-zA-Z0-9_]*',
                    {
                        cases: {
                            '@keywords': 'keyword',
                            '@builtinTypes': 'type',
                            '@constants': 'constant',
                            '@default': 'plaintext',
                        },
                    },
                ],
                ['\\$(\\~)?[a-zA-Z_0-9]+(~[a-zA-Z_0-9]+)?', 'number'],
                ['\\$#[a-zA-Z_0-9]+', 'number'],
                [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                [
                    /'/,
                    {
                        token: 'string.quote',
                        bracket: '@open',
                        next: '@stringSingleQuoted',
                    },
                ],
                ['//.*$', 'comment'],
                [/\d*\.\d+([eE][\-+]?\d+)?(d|f)?/, 'number.float'],
                [/0[xX][0-9a-fA-F]+(u|s|ub|sb|us|ss|ui|si|ul|sl|uz|f|d)?/, 'number.hex'],
                [/\d+(u|s|ub|sb|us|ss|ui|si|ul|sl|uz|f|d)?/, 'number'],
                ['\\#[a-zA-Z_]*', 'keyword.control'],
                [/\/\*/, 'comment', '@comment'],
                [/\/\/.*$/, 'comment'],
            ],
            string: [
                [/[^\\"]+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
            ],
            stringSingleQuoted: [
                [/[^\\']+/, 'string'],
                [/@escapes/, 'string.escape'],
                [/\\./, 'string.escape.invalid'],
                [/'(ub)?/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
            ],
            comment: [
                [/[^\/*]+/, 'comment'],
                // [/\/\*/, 'comment', '@push'], // nested comment
                ['\\*/', 'comment', '@pop'],
                [/[\/*]/, 'comment'],
            ],
        },
    });
};
