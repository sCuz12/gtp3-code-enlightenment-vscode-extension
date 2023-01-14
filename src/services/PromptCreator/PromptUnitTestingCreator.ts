import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptUnitTestingCreator extends PromptCreatorGeneral {
   

    constructor() {
        super();
        this.name = "Code Refactorer";
        this.stopWords = "'''";
    }

    generatePrompt(code:string): string {
        return `${code} \n ${this.stopWords} \n  Write me a unit test case for this code`;
    }
}