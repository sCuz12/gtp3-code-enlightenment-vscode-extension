import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptRegexCreator extends PromptCreatorGeneral {
   
    readonly languages = ["php","java","javascript","python","ts","go"];
    
    constructor() {
        super();
        this.name = "Regex Generator";
        this.stopWords = "'''";
    }

    generatePrompt(code:string): string {
        let found = "";
        for (let i = 0; i < this.languages.length; i++) {
            let regex = new RegExp(this.languages[i],"gi");
            let match = code.match(regex);
            if (match) {
              found = this.languages[i];
              break;
            }
        }
        console.log(found);
        return `${code} \n ${this.stopWords} \n  
        generate me regex expression in ${found} with implementation,
        return with test case
        and comment above 
        saying Generated Regex by Code Enlighenment `;
    }
}