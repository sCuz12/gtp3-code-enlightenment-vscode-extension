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

	const apiKey = config.apiKey;
	const gtp3Model = config.model;



	const openaiManager = new OpenAiManager(gtp3Model, 160, apiKey);


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	/** Code explain */
	let disposable = vscode.commands.registerCommand('code-enlightenment.generateFunctionDoc', async function () {
		const activeEditor = vscode.window.activeTextEditor;

		if (!activeEditor) {
			return;
		}

		var selection = activeEditor.selection;
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory = PromptFactory.createObject(Tasks.EXPLAIN);
		let generatedPrompt = promptFactory.generatePrompt(selectedText);

		openaiManager.sendRequest(generatedPrompt)
			.then((result) => {
				//init edit object of workspace
				const edit = new vscode.WorkspaceEdit();

				edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(selection.start, result + "\n")]);
				//apply edits 
				void vscode.workspace.applyEdit(edit);
				//show notification
				vscode.window.showInformationMessage('Documentation Generated from Chatgtp3');

			}).catch((e) => {
				let errorMessage = getErrorMessage(e);
				vscode.window.showErrorMessage(errorMessage);
				return;
			});
	});

	/** Code refactor */
	let refactor = vscode.commands.registerCommand('code-enlightenment.refactorCode', async function () {
		// The code you place here will be executed every time your command is executed
		const activeEditor = vscode.window.activeTextEditor;

		if (!activeEditor) {
			return false;
		}
		var selection = activeEditor.selection;
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory = PromptFactory.createObject(Tasks.REFACTOR);
		let generatedRefactorPrompt = promptFactory.generatePrompt(selectedText);

		openaiManager.sendRequest(generatedRefactorPrompt)
			.then((result) => {
				try {
					let panel = vscode.window.createWebviewPanel(
						'refactorPanel',
						'GTP Refactor',
						vscode.ViewColumn.Two,
						{
							enableScripts: true
						}
					);
					// Inject the C++ code into the webview
					panel.webview.html = `
						<!DOCTYPE html>
						<html lang="en">
						<head>
							<meta charset="UTF-8">
							<meta name="viewport" content="width=device-width, initial-scale=1.0">
							<title>Test Webview</title>
						</head>
						<body>
							<pre><code class="language-cpp">${result}</code></pre>
						</body>
						</html>
						`;

					//show notification
					vscode.window.showInformationMessage('Code has been refactor');
				} catch (e) {
					vscode.window.showErrorMessage("Error apply refactor results");
				}
			})
			.catch((e) => {
				let errorMessage = getErrorMessage(e);
				vscode.window.showErrorMessage(errorMessage)
				return;
			});


	});

	/** Unit test generation */
	let unitTestGeneration = vscode.commands.registerCommand('code-enlightenment.generateUnitTest', async function () {
		const activeEditor = vscode.window.activeTextEditor;

		//todo
		if (!activeEditor) {
			return false;
		}
		var selection = activeEditor.selection
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory = PromptFactory.createObject(Tasks.UNIT_TEST);
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

			}).catch((e) => {
				let errorMessage = getErrorMessage(e);
				vscode.window.showErrorMessage(errorMessage);
				return;
			})

	});
	/** Regex Generator */
	let regexGenerator = vscode.commands.registerCommand('code-enlightenment.regexGenerator', async function () {
		const activeEditor = vscode.window.activeTextEditor;
		const documentLanguage = activeEditor?.document.languageId;

		const requestedRegexInput = await vscode.window.showInputBox({
			placeHolder: "Ex : Check if email domain is ending with @gmail.com in php",
			prompt: "Explain your reger ",
			value: "check if mobile starts with 99 and ends with 3 in c#"
		}) ?? "";

		if (!activeEditor) {
			return false;
		}

		const promptFactory = PromptFactory.createObject(Tasks.REGEX_GENERATOR);
		let generatedRegexPrompt = promptFactory.generatePrompt(requestedRegexInput, documentLanguage);
		
		openaiManager.sendRequest(generatedRegexPrompt)
			.then((result) => {
				try {
					//init edit object of workspace
					const edit = new vscode.WorkspaceEdit();

					edit.set(activeEditor.document.uri, [vscode.TextEdit.insert(activeEditor.selection.active, "" + result + "\n")])
					//apply edits 
					vscode.workspace.openTextDocument({ content: result, language: documentLanguage?.toUpperCase() }).then(doc => {
						vscode.window.showTextDocument(doc);
					});
					//show notification
					vscode.window.showInformationMessage('Code enlighenment generated regex succesfully');
				} catch (e) {
					vscode.window.showErrorMessage("Error apply refactor results");
				}
			})
			.catch((e) => {
				let errorMessage = getErrorMessage(e);
				vscode.window.showErrorMessage(errorMessage);
				return;
			});

	});

	/** Bug Finder */
	let bugFinder = vscode.commands.registerCommand('code-enlightenment.codeDocumentation', async function () {
		let activeEditor = vscode.window.activeTextEditor;

		if (!activeEditor) {
			vscode.window.showErrorMessage("No active editor found");
			return;
		}

		var selection = activeEditor.selection;
		//get the selected text 
		let selectedText = activeEditor.document.getText(selection);

		const promptFactory = PromptFactory.createObject(Tasks.CODE_DOCUMENT);
		let generatedRefactorPrompt = promptFactory.generatePrompt(selectedText);
		const FILE_URL = "/CODE_DOCUMENTATION.md";

		openaiManager.sendRequest(generatedRefactorPrompt)
			.then((result) => {
				try {
					const fileUri = vscode.Uri.parse(vscode.workspace.rootPath + FILE_URL);
					//check if exist 
					let existingDoc = vscode.workspace.textDocuments.find(doc => doc.fileName === vscode.workspace.rootPath + FILE_URL);

					if (!existingDoc) {
						console.log("not founded")
						vscode.workspace.fs.writeFile(fileUri, Buffer.from('')).then(() => {
							vscode.workspace.openTextDocument(fileUri).then((doc) => {
								vscode.window.showTextDocument(doc, vscode.ViewColumn.One, true).then((editor) => {
									if (editor.document === doc) {
										editor.edit((editBuilder) => {
											editBuilder.insert(new vscode.Position(0, 0), result);
										});
									}
								});
							});
						});						
					} else {
						console.log("founded")
						// If the document is already open, show its editor and insert text
						vscode.window.showTextDocument(existingDoc, vscode.ViewColumn.One, true).then((editor) => {
							editor.edit((editBuilder) => {
								editBuilder.insert(new vscode.Position(0, 0), result);
							});
						});
					}

					vscode.window.showInformationMessage('Code has been added to Documentation');
				} catch (e) {
					vscode.window.showErrorMessage("Error apply refactor results");
				}

			})
			.catch((e) => {
				let errorMessage = getErrorMessage(e);
				vscode.window.showErrorMessage(errorMessage);
				return;
			});

	});


	context.subscriptions.push(disposable);
	context.subscriptions.push(refactor);
	context.subscriptions.push(unitTestGeneration);
	context.subscriptions.push(bugFinder);
	context.subscriptions.push(regexGenerator);
}

//General method for prepare error message 
function getErrorMessage(error: Error) {
	if (error.message.includes('status code 429')) {
		return 'API key rate limit exceeded. Please try again later.';
	} else {
		console.log('Error communicating with Chatgtp3:');
		console.log(error);
		return 'Error communicating with Chatgtp3';
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
