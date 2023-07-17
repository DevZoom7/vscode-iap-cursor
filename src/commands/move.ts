import {
   workspace,
   window,
   TextEditor,
   ConfigurationTarget,
   Range,
   Selection,
   Position,
} from "vscode";

import { Direction } from "./data";

function getSelection(
   editor: TextEditor,
   selection: Selection,
   direction: Direction,
   select: boolean,
   shouldUpdate: boolean
) {
   const doc = editor.document;
   const config = workspace.getConfiguration();
   const [prevDirection, useSelect] = config
      .get("iap.prevMove", "Right")
      .split("-") as [Direction, string];
   if (direction === "PrevMove") {
      direction = prevDirection;
      select = Boolean(useSelect);
   } else {
      const useSelectCommandsAsPrevMove = config.get(
         "iap.useSelectCommandsAsPrevMove"
      );
      shouldUpdate &&
         config.update(
            "iap.prevMove",
            select && useSelectCommandsAsPrevMove
               ? `${direction}-Select`
               : !select
               ? direction
               : prevDirection,
            ConfigurationTarget.Global
         );
   }
   const getSafeLine = (line: number) =>
      Math.max(0, Math.min(line, doc.lineCount - 1));
   let { anchor, active } = selection;
   const { line } = active;
   switch (direction) {
      case "Left": {
         active = new Position(
            line,
            doc.lineAt(line).firstNonWhitespaceCharacterIndex
         );
         break;
      }
      case "Right": {
         active = new Position(line, doc.lineAt(line).text.length);
         break;
      }
      case "UpLeft": {
         const safeLine = getSafeLine(line - 1);
         active = new Position(
            safeLine,
            doc.lineAt(safeLine).firstNonWhitespaceCharacterIndex
         );
         break;
      }
      case "UpRight": {
         const safeLine = getSafeLine(line - 1);
         active = new Position(safeLine, doc.lineAt(safeLine).text.length);
         break;
      }
      case "DownLeft": {
         const safeLine = getSafeLine(line + 1);
         active = new Position(
            safeLine,
            doc.lineAt(safeLine).firstNonWhitespaceCharacterIndex
         );
         break;
      }
      case "DownRight": {
         const safeLine = getSafeLine(line + 1);
         active = new Position(safeLine, doc.lineAt(safeLine).text.length);
         break;
      }
   }
   editor.revealRange(new Range(active, active));
   return new Selection(select ? anchor : active, active);
}

export async function move(
   direction: Direction,
   select = false,
   shouldUpdate = false
) {
   const editor = window.activeTextEditor;
   if (!editor) {
      return;
   }
   let selections: Selection[] = [];
   for (const selection of editor.selections) {
      const newSelection = getSelection(
         editor,
         selection,
         direction,
         select,
         shouldUpdate
      );
      selections.push(newSelection);
   }
   editor.selections = selections;
}
