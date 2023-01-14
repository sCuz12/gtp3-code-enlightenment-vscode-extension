import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptExplanatorCreator extends PromptCreatorGeneral {
   

    constructor() {
        super();
        this.name = "Code Explanator";
        this.stopWords = "'''";
    }

    generatePrompt(code:string): string {
        return `${code} \n ${this.stopWords} \n  Write me explanation for this code`;
    }
}