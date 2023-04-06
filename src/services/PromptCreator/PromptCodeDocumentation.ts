import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptCodeDocumentation extends PromptCreatorGeneral {
    constructor() {
        super();
        this.name = "Code Documentor";
        this.stopWords = "'''";
    }

    generatePrompt(code:string): string {
        //default language vscode editor language
        return `${code} \n ${this.stopWords} \n 
        You are a software engineer tasked of document the following codebase . 
        Please Document the following code to write it in a readme file in a md format`;
    }
}