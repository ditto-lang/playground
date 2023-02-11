import { tags as t } from "@lezer/highlight";

export const dittoHighlighting = {
  "module exports type": t.keyword,
  Comment: t.lineComment,
  TypeDeclarationName: t.typeName,
  TypeConstructorProperName: t.typeName,
  ValueDeclarationName: t.name,
  ExpressionVariableName: t.variableName,
  PatternVariable: t.variableName,
  ExpressionRecordFieldLabel: t.labelName,
  Qualifier: t.namespace,
  ExpressionString: t.string,
  ExpressionInt: t.number,
  ExpressionFloat: t.number,
  ExpressionTrue: t.bool,
  ExpressionFalse: t.bool,
  unit: t.null,
};
