import { window, commands, Position, workspace } from "vscode";
import { Char } from "./data";

export async function insert(char: Char) {
   const editor = window.activeTextEditor;
   if (!editor) {
      return;
   }
   const doc = editor.document;
   let character: "," | ";";
   let insertLine: "Before" | "After" | undefined = undefined;
   switch (char) {
      case "Comma": {
         character = ",";
         break;
      }
      case "Semicolon": {
         character = ";";
         break;
      }
      case "CommaAndLineAfter": {
         character = ",";
         insertLine = "After";
         break;
      }
      case "CommaAndLineBefore": {
         character = ",";
         insertLine = "Before";
         break;
      }
      case "SemicolonAndLineAfter": {
         character = ";";
         insertLine = "After";
         break;
      }
      case "SemicolonAndLineBefore": {
         character = ";";
         insertLine = "Before";
         break;
      }
   }
   console.clear();
   for (const selection of editor.selections) {
      const { line } = selection.active;
      const char = doc.lineAt(line).text.length;
      await editor.edit((e) => {
         e.insert(new Position(line, char), character);
      });
   }
   insertLine &&
      commands.executeCommand(`editor.action.insertLine${insertLine}`);
}
