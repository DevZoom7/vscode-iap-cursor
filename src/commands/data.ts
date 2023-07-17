export type Direction =
   | "Left"
   | "Right"
   | "UpLeft"
   | "UpRight"
   | "DownLeft"
   | "DownRight"
   | "PrevMove";

export type Char =
   | "Comma"
   | "Semicolon"
   | "CommaAndLineAfter"
   | "CommaAndLineBefore"
   | "SemicolonAndLineAfter"
   | "SemicolonAndLineBefore";

export type DeleteDirection = "UpRight" | "DownRight" | "LineText";

const validDirections: Direction[] = [
   "Left",
   "Right",
   "UpLeft",
   "UpRight",
   "DownLeft",
   "DownRight",
   "PrevMove",
];

export const commandTypes: {
   move: Direction[];
   select: Direction[];
   insert: Char[];
   delete: DeleteDirection[];
} = {
   move: validDirections,
   select: validDirections,
   insert: [
      "Comma",
      "Semicolon",
      "CommaAndLineAfter",
      "SemicolonAndLineAfter",
      "CommaAndLineBefore",
      "SemicolonAndLineBefore",
   ],
   delete: ["DownRight", "UpRight", "LineText"],
};
