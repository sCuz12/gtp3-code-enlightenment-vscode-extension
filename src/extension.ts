// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OpenAiManager } from './OpenAiManager';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const config = vscode.workspace.getConfiguration('gtp3');

	const apiKey = config.apiKey;
	console.log(apiKey);

	const activeEditor = vscode.window.activeTextEditor;
	
	const openaiManager = new OpenAiManager("text-davinci-003",160,apiKey);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('function-documentation-generator.generateFunctionDoc', async function () {
		
		if (!activeEditor) {
			return;
		}

		var selection = activeEditor.selection
		//get the selected text 
		var selectedText = activeEditor.document.getText(selection);
		
		var generatedPrompt = "# create explanation for the bellow code \n" + "" + selectedText + "\n ### Documentation";
		try {
			var result:any
			//remove the \n
		    openaiManager.sendRequest(generatedPrompt)
			.then((result)=>{
				console.log(result)
					//change line every 60 chars
				var formattedResult = result.replace(/(.{60})/g, "$1\n *");
				//init edit object of workspace
				const edit = new vscode.WorkspaceEdit();

				edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(selection.start, "/**" + formattedResult + "**/ \n")]);
				//apply edits 
				void vscode.workspace.applyEdit(edit);
				//show notification
				vscode.window.showInformationMessage('Documentation Generated from Chatgtp3');

		})
			
			
		
		} catch (e:any) {
			console.log(e)
			vscode.window.showErrorMessage("Error communicating with Chatgtp3 ")
			return;
		}

		
	});

	let refactor = vscode.commands.registerCommand('function-documentation-generator.refactorCode', async function () {
		// The code you place here will be executed every time your command is executed
		if (!activeEditor) {
			return false;
		}
		var selection = activeEditor.selection
		//get the selected text 
		var selectedText = activeEditor.document.getText(selection);

		var generatedRefactorPrompt = `${selectedText} ''' Refactor this code with different to more readable and efficient `
		console.log(generatedRefactorPrompt);
		try {
			openaiManager.sendRequest(generatedRefactorPrompt)
			.then((result)=>{
				try {
					//init edit object of workspace
					const edit = new vscode.WorkspaceEdit();
					edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(selection.start, "" + result + "\n")])
					//apply edits 
					void vscode.workspace.applyEdit(edit);
					//show notification
					vscode.window.showInformationMessage('Code has been refactor');
				} catch (e) {
					vscode.window.showErrorMessage("Error apply refactor results");
				}
			});

		} catch (e) {
			console.log(e);
			vscode.window.showErrorMessage("Error communicating with Chatgtp3 ")
			return;
		}


		

	});

	let unitTestGeneration = vscode.commands.registerCommand('function-documentation-generator.generateUnitTest',async function (){
		//todo
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(refactor);
}

// This method is called when your extension is deactivated
export function deactivate() {}
