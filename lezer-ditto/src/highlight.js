import { tags as t } from "@lezer/highlight";

// wip
export const dittoHighlighting = {
  Comment: t.lineComment,
  ValueDeclarationName: t.name,
  "ExpressionVariableName PatternVariable": t.variableName,
  "TypeDeclarationName TypeConstructorProperName": t.typeName,
  ExpressionRecordFieldLabel: t.propertyName,
  "ModuleName ModuleImportAlias Qualifier": t.namespace,
  "TypeDeclarationConstructorName PatternConstructorProperName ExpressionConstructorProperName":
    t.className,
  ExpressionString: t.string,
  ExpressionInt: t.number,
  ExpressionFloat: t.number,
  true: t.bool,
  false: t.bool,
  unit: t.null,
  "module exports import as type alias": t.moduleKeyword,
  "if then else match with end": t.controlKeyword,
  "let in do fn": t.keyword,
  "|>": t.operator,
};
