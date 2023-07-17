import { commands as vCommands, Disposable } from "vscode";
import { Char, DeleteDirection, Direction, commandTypes } from "./data";
import { move } from "./move";
import { insert } from "./insert";
import { deleteLine } from "./delete";

type CommandDetail =
   | {
        type: "move";
        direction: Direction;
     }
   | {
        type: "select";
        direction: Direction;
     }
   | {
        type: "insert";
        char: Char;
     }
   | {
        type: "delete";
        direction: DeleteDirection;
     };

function getCommandName(commandDetail: CommandDetail) {
   switch (commandDetail.type) {
      case "move": {
         return `iap.cursor${commandDetail.direction}`;
      }
      case "select": {
         return `iap.cursor${commandDetail.direction}Select`;
      }
      case "insert": {
         return `iap.insert${commandDetail.char}`;
      }
      case "delete": {
         return `iap.deleteLineAndGo${commandDetail.direction}`;
      }
   }
}

function pushCommand(
   direction: Direction,
   commands: Disposable[],
   select = false,
   shouldUpdate = false
) {
   const name = getCommandName({ type: select ? "select" : "move", direction });
   const command = vCommands.registerCommand(name, async () => {
      await move(direction, select, shouldUpdate);
   });
   commands.push(command);
}

export function getCursorCommands() {
   let commands: Disposable[] = [];
   commandTypes.move.forEach((direction) =>
      pushCommand(direction, commands, false, true)
   );
   commandTypes.select.forEach((direction) =>
      pushCommand(direction, commands, true, true)
   );
   commands.push(
      vCommands.registerCommand("iap.cursorLineSelect", async () => {
         await move("Left");
         await move("Right", true);
      })
   );
   return commands;
}

export function getInsertCommands() {
   let commands: Disposable[] = [];
   commandTypes.insert.forEach((char) => {
      const name = getCommandName({ type: "insert", char });
      const command = vCommands.registerCommand(name, async () => {
         await insert(char);
      });
      commands.push(command);
   });
   return commands;
}

export function getDeleteCommands() {
   let commands: Disposable[] = [];
   commandTypes.delete.forEach((direction) => {
      let name;
      if (direction === "LineText") {name = "iap.deleteLineText";}
      else {name = getCommandName({ type: "delete", direction });}
      const command = vCommands.registerCommand(name, async () => {
         await deleteLine(direction);
      });
      commands.push(command);
   });
   return commands;
}
