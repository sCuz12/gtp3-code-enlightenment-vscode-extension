const { Configuration, OpenAIApi } = require("openai");

export class OpenAiManager {

    model: string ;
    max_tokens: number;
	openai : any;

    constructor(model:string, max_tokens:number, gtpapiKey:string ){
        this.model = model;
        this.max_tokens = max_tokens;

        const configuration = new Configuration({
            apiKey: gtpapiKey
        });
        
        this.openai = new OpenAIApi(configuration); 
    }
    
     async sendRequest(prompt: string) {
        const completion =  await this.openai.createCompletion({
            model: this.model,
            prompt: prompt,
            "max_tokens": this.max_tokens,
            stop :["'''"]
          
        });
        console.log(completion.data);
        var result = completion.data.choices[0].text;
        return result;
    }


}