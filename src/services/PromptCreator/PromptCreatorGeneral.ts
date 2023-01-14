import { PromptCreatorInterface } from "../interface/PromptCreatorInterface";

export abstract class PromptCreatorGeneral implements PromptCreatorInterface {
    generatePrompt(code:string) {
        throw new Error("Method not implemented.");
    }
    name = "";
    stopWords = "";

 
}