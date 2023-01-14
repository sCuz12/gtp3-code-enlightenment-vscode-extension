import { PromptConfig } from "../../interface/PromptConfig";
import { PromptCreatorInterface } from "./PromptCreatorInterface";
import { PromptExplanatorCreator } from "./PromptExplanatorCreator";
import { PromptRefactorCreator } from "./PromptRefactorCreator";
import { PromptUnitTestingCreator } from "./PromptUnitTestingCreator";

export class PromptFactory {


    static createObject(task: string): PromptCreatorInterface {

        if (task === 'explain') {
            return new PromptExplanatorCreator();
        }
        if(task === 'refactor') {
            return new PromptRefactorCreator();
        }

        if(task === 'unit_test') {
            return new PromptUnitTestingCreator();
        }

        return new PromptExplanatorCreator();


    }



}