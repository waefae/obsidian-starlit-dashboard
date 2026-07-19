import target from "./target.svg";
import search from "./search.svg";
import folder from "./folder.svg";
import listTodo from "./list-todo.svg";
import checkbox from "./checkbox.svg";
import checkboxChecked from "./checkbox-checked.svg";
import close from "./close.svg";

export const Icons = {
	target,
	search,
	folder,
	listTodo,
	checkbox,
	checkboxChecked,
	close,
} as const;

export type IconName = keyof typeof Icons;