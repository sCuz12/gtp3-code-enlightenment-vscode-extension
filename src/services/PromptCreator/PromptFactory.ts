import { Tasks } from "../../enums/Tasks";
import { PromptConfig } from "../../interface/PromptConfig";
import { PromptCreatorInterface } from "./interface/PromptCreatorInterface";
import { PromptExplanatorCreator } from "./PromptExplanatorCreator";
import { PromptRefactorCreator } from "./PromptRefactorCreator";
import { PromptRegexCreator } from "./PromptRegexCreator";
import { PromptUnitTestingCreator } from "./PromptUnitTestingCreator";

export class PromptFactory {


    static createObject(task: string): PromptCreatorInterface {

        if (task === Tasks.EXPLAIN) {
            return new PromptExplanatorCreator();
        }
        if(task === Tasks.REFACTOR) {
            return new PromptRefactorCreator();
        }

        if(task === Tasks.UNIT_TEST) {
            return new PromptUnitTestingCreator();
        }
        
        if(task === Tasks.REGEX_GENERATOR) {
            return new PromptRegexCreator();
        }

        return new PromptExplanatorCreator();


    }



}