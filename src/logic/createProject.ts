import { promises } from 'fs';
import { invokeInsight } from '@/insight/insight';
import { now } from '@/logic/now';
import sqlite from './sqlite';

const readFile = promises.readFile;

export async function createProject(
    name: string,
    filename: string,
    infrastructure: string
): Promise<number> {
    let code = await readFile(filename, 'utf8');

    let result: any = await invokeInsight({
        query: 'ast',
        infrastructure: infrastructure,
        filename: filename,
        code: code,
        features: ['include-arg-info', 'include-calls'],
    });

    if (result == null || typeof result != 'object' || result.ast == null) {
        throw new Error("Encountered syntax error. Static analysis could not be performed.");
    }

    let time = now();

    let projectID = await sqlite.insert(`
            INSERT INTO Project VALUES (
                NULL,
                :ProjectName,
                :ProjectInfrastructure,
                :ProjectRootFilename,
                :ProjectCreated,
                :ProjectLastOpened,
                :ProjectLastUpdated
            )
        `,
        {
            ':ProjectName': name,
            ':ProjectInfrastructure': infrastructure,
            ':ProjectRootFilename': filename,
            ':ProjectCreated': time,
            ':ProjectLastOpened': time,
            ':ProjectLastUpdated': time,
        }
    );

    let funcs: any[] = result?.ast?.functions;
    let composites: any[] = result?.ast?.composites;
    let enums: any[] = result?.ast?.enums;
    let calls: any[] = result?.calls;
    let funcIndices: number[] = [];

    if (funcs) {
        for (let func of funcs) {
            funcIndices.push(
                await sqlite.insert(`
                    INSERT INTO Function VALUES (
                        NULL,
                        :FunctionName,
                        :FunctionDefinition,
                        :FunctionSourceObject,
                        :FunctionSourceIndex,
                        :FunctionSourceStride,
                        :FunctionEndIndex,
                        :FunctionEndStride,
                        :ProjectID
                    )`,
                    {
                        ':FunctionName': func.name,
                        ':FunctionDefinition': func.definition,
                        ':FunctionSourceObject': func.source.object,
                        ':FunctionSourceIndex': func.source.index,
                        ':FunctionSourceStride': func.source.stride,
                        ':FunctionEndIndex': func.end.index,
                        ':FunctionEndStride': func.end.stride,
                        ':ProjectID': projectID,
                    }
                ));
        }
    }

    if (composites) {
        for (let composite of composites) {
            await sqlite.run(`
                INSERT INTO Composite VALUES (
                    NULL,
                    :CompositeName,
                    :CompositeDefinition,
                    :CompositeSourceObject,
                    :CompositeSourceIndex,
                    :CompositeSourceStride,
                    :ProjectID
                )`,
                {
                    ':CompositeName': composite.name,
                    ':CompositeDefinition': composite.definition,
                    ':CompositeSourceObject': composite.source.object,
                    ':CompositeSourceIndex': composite.source.index,
                    ':CompositeSourceStride': composite.source.stride,
                    ':ProjectID': projectID,
                });
        }
    }

    if (enums) {
        for (let enumDefinition of enums) {
            await sqlite.run(`
                INSERT INTO Enum VALUES (
                    NULL,
                    :EnumName,
                    :EnumDefinition,
                    :EnumSourceObject,
                    :EnumSourceIndex,
                    :EnumSourceStride,
                    :ProjectID
                )`,
                {
                    ':EnumName': enumDefinition?.name,
                    ':EnumDefinition': enumDefinition?.definition,
                    ':EnumSourceObject': enumDefinition?.source?.object,
                    ':EnumSourceIndex': enumDefinition?.source?.index,
                    ':EnumSourceStride': enumDefinition?.source?.stride,
                    ':ProjectID': projectID,
                });
        }
    }

    if (calls) {
        for (let funcIndex = 0; funcIndex < calls.length; funcIndex++) {
            let callsTo = calls[funcIndex];

            for (let call of callsTo) {
                await sqlite.run(`
                    INSERT INTO Call VALUES (
                        :CallCallee,
                        :CallAmount,
                        :CallCallerFunctionID
                    )`,
                    {
                        ':CallCallee': call.name,
                        ':CallAmount': call.count,
                        ':CallCallerFunctionID': funcIndices[funcIndex],
                    }
                );
            }
        }
    }

    await sqlite.save();

    return projectID;
}
