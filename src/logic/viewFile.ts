
import { promises } from "fs";

const readFile = promises.readFile;

export function viewFile(filename: string, setCode: any, setFilename: any, setTab: any, setRange: any, startIndex?: number, endIndex?: number) {
    readFile(filename).then(content => {
        setCode(content.toString());
        setFilename(filename);
        setTab('Code');

        if (startIndex != null && endIndex != null) {
            setRange({ startIndex, endIndex });
        } else {
            setRange(null);
        }
    });
}
