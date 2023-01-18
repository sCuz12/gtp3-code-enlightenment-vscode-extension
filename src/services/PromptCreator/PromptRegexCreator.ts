import { PromptCreatorGeneral } from "./PromptCreatorGeneral";

export class PromptRegexCreator extends PromptCreatorGeneral {
   
    readonly languages = ["php","java","javascript","python","typescript","go","c#","c++","dart"];
    
    constructor() {
        super();
        this.name = "Regex Generator";
        this.stopWords = "'''";
    }

    generatePrompt(code:string,programmingLanguage:string): string {
        //default language vscode editor language
        let languageRequested = programmingLanguage ;
        for (let i = 0; i < this.languages.length; i++) {
            let regex = new RegExp(this.languages[i],"gi");
            let match = code.match(regex);
            if (match) {
              languageRequested = this.languages[i];
              break;
            }
        }
        return `${code} \n ${this.stopWords} \n  
        generate me regex expression in ${languageRequested}
        along with test case`;
    }
}