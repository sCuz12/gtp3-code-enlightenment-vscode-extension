export interface PromptCreatorInterface {
    name      : string;
    stopWords : string;
    generatePrompt(code:string,programmingLanguage?:string):any ;
}