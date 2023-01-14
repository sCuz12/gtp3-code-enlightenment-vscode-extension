import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptRegexCreator extends PromptCreatorGeneral {
   

    constructor() {
        super();
        this.name = "Code Refactorer";
        this.stopWords = "'''";
    }

    generatePrompt(code:string): string {
        return `${code} \n ${this.stopWords} \n  generate me regex expression`;
    }
}