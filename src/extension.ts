import { ExtensionContext } from "vscode";
import { getCursorCommands, getDeleteCommands, getInsertCommands } from "./commands/commands";

export function activate(context: ExtensionContext) {
   const cursorCommands = getCursorCommands();
   const insertCommands = getInsertCommands();
   const deleteCommands = getDeleteCommands();
   context.subscriptions.push(...cursorCommands, ...insertCommands, ...deleteCommands);
}

export function deactivate() {}