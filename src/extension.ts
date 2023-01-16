// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OpenAiManager } from './OpenAiManager';
import { PromptFactory } from './services/PromptCreator/PromptFactory';
import { Tasks } from './enums/Tasks';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('gtp3');

	const apiKey 	= config.apiKey;
	const gtp3Model = config.model;

	const activeEditor	   = vscode.window.activeTextEditor;
	const documentLanguage = activeEditor?.document.languageId;
	
	const openaiManager = new OpenAiManager(gtp3Model, 160, apiKey);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('code-enlightenment.generateFunctionDoc', async function () {

		if (!activeEditor) {
			return;
		}

		var selection 	 = activeEditor.selection;
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory = PromptFactory.createObject(Tasks.EXPLAIN);
		let generatedPrompt = promptFactory.generatePrompt(selectedText);

		openaiManager.sendRequest(generatedPrompt)
			.then((result) => {
				//remove the \n
				result = result.replace(/\n/g, '');

				//change line every 60 chars
				var formattedResult = result.replace(/(.{60})/g, "$1\n *");

				//init edit object of workspace
				const edit = new vscode.WorkspaceEdit();

				edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(selection.start, "/**" + formattedResult + "**/ \n")]);
				//apply edits 
				void vscode.workspace.applyEdit(edit);
				//show notification
				vscode.window.showInformationMessage('Documentation Generated from Chatgtp3');

			}).catch((e) => {
				vscode.window.showErrorMessage("Error communicating with Chatgtp3");
				return;
			});
	});

	let refactor = vscode.commands.registerCommand('code-enlightenment.refactorCode', async function () {
		// The code you place here will be executed every time your command is executed
		if (!activeEditor) {
			return false;
		}
		var selection 	 = activeEditor.selection;
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory 		= PromptFactory.createObject(Tasks.REFACTOR);
		let generatedRefactorPrompt = promptFactory.generatePrompt(selectedText);

		openaiManager.sendRequest(generatedRefactorPrompt)
			.then((result) => {
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
			})
			.catch((e) => {
				console.log(e);
				vscode.window.showErrorMessage("Error communicating with Chatgtp3 ")
				return;
			});
	});

	let unitTestGeneration = vscode.commands.registerCommand('code-enlightenment.generateUnitTest', async function () {
		//todo
		if (!activeEditor) {
			return false;
		}
		var selection 	 = activeEditor.selection
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory 	= PromptFactory.createObject(Tasks.UNIT_TEST);
		const unitTestingPrompt = promptFactory.generatePrompt(selectedText);


		openaiManager.sendRequest(unitTestingPrompt)
			.then((result) => {
				//init edit object of workspace
				const edit = new vscode.WorkspaceEdit();

				edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(selection.start, "" + result + "\n")])
				//apply edits 
				void vscode.workspace.applyEdit(edit);
				//show notification
				vscode.window.showInformationMessage('Unit testing generated');

			})

	});

	let regexGenerator = vscode.commands.registerCommand('code-enlightenment.regexGenerator',async function(){
		const requestedRegexInput = await vscode.window.showInputBox({
			placeHolder: "Ex : Check if email domain is ending with @gmail.com in php",
			prompt: "Explain your reger ",
		  }) ?? "";

		  if (!activeEditor) {
			return false;
		}

		const promptFactory 	 = PromptFactory.createObject(Tasks.REGEX_GENERATOR);
		let generatedRegexPrompt = promptFactory.generatePrompt(requestedRegexInput);

		openaiManager.sendRequest(generatedRegexPrompt)
		.then((result) => {
			try {
				//init edit object of workspace
				const edit = new vscode.WorkspaceEdit();

				edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(activeEditor.selection.active, "" + result + "\n")])
				//apply edits 
				vscode.workspace.openTextDocument({content:result,language:documentLanguage?.toUpperCase()}).then(doc=>{
					vscode.window.showTextDocument(doc);
				});
				//show notification
				vscode.window.showInformationMessage('Code enlighenment generated regex succesfully');
			} catch (e) {
				vscode.window.showErrorMessage("Error apply refactor results");
			}
		})
		.catch((e) => {
			console.log(e);
			vscode.window.showErrorMessage("Error communicating with Chatgtp3 ")
			return;
		});

	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(refactor);
	context.subscriptions.push(unitTestGeneration);
}

// This method is called when your extension is deactivated
export function deactivate() { }
