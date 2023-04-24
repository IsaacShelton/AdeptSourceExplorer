import sqlite from "./sqlite";
import { viewFile } from "./viewFile";

export function viewFunction(projectID: number, functionName: string | null | undefined, setCode: any, setFilename: any, setTab: any, setRange: any) {
    if (functionName == null) return;

    sqlite
        .query(
            `SELECT FunctionDefinition, FunctionSourceObject, FunctionSourceIndex, FunctionEndIndex, FunctionEndStride
                FROM Function
                WHERE ProjectID = :ProjectID AND FunctionName = :FunctionName
                ORDER BY FunctionID ASC`,
            {
                ':ProjectID': projectID,
                ':FunctionName': functionName,
            }
        )
        .then(rows => {
            if (rows.length > 0) {
                let beginning = rows[0]['FunctionSourceIndex'];
                let end = rows[0]['FunctionEndIndex'] + rows[0]['FunctionEndStride'];

                viewFile(
                    rows[0]['FunctionSourceObject'],
                    setCode,
                    setFilename,
                    setTab,
                    setRange,
                    beginning,
                    end
                );
            }
        });
}