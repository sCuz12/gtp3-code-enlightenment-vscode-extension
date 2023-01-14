import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptRefactorCreator extends PromptCreatorGeneral {
   

    constructor() {
        super();
        this.name = "Code Refactorer";
        this.stopWords = "'''";
    }

    generatePrompt(code:string): string {
        return `${code} \n ${this.stopWords} \n  Refactor this code with different to more readable and efficient`;
    }
}