import { DeleteDirection } from "./data";
import { Position, Range, Selection, commands, window, workspace } from "vscode";
import { move } from "./move";

export async function deleteLine(direction: DeleteDirection) {
   const editor = window.activeTextEditor;
   if (!editor) {
      return;
   }
   const doc = editor.document;
   const line = editor.selection.active.line;
   const lineCount = doc.lineCount;
   if (direction !== "LineText") {
      await commands.executeCommand("editor.action.deleteLines");
      await move(direction === "DownRight" ? "Right" : line < lineCount-1 ? direction : "Right");
   } else {
      editor.edit(e => {
         editor.selections.forEach(selection => {
            const startLine = selection.start.line;
            const endLine = selection.end.line;
            const start = new Position(startLine, doc.lineAt(startLine).firstNonWhitespaceCharacterIndex);
            const end = new Position(endLine, doc.lineAt(endLine).text.length);
            e.delete(new Range(start, end));
         });
      });
   }
}
