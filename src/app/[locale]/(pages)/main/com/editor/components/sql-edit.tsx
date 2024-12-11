import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { sql } from "@codemirror/lang-sql";
import { CardContainer } from "@/components/card-container";
interface completeContext {
  matchBefore: (reg: RegExp) => {
    from: string;
    to: string;
  };
  explicit: boolean;
}
function SqlEditor() {
  const [sqlStr, setSqlStr] = useState("SELECT * FROM USER");
  const customAutoCompletions = (context: completeContext) => {
    const word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit) return null;
    return {
      from: word.from,
      options: [
        { label: "match", type: "keyword" },
        { label: "hello", type: "variable", info: "(World)" },
        { label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },
        {
          label: "sql.user",
          type: "variable",
          apply: "select.tsx * from user",
          info: "用户查询SQL",
        },
        {
          label: "sql.car",
          type: "variable",
          apply: "select.tsx * from car",
          info: "汽车查询SQL",
        },
      ],
    };
  };

  const onChangeSql = useCallback((val: string) => {
    setSqlStr(val);
  }, []);
  return (
    <CardContainer title="SQL" footer={<div>{sqlStr}</div>}>
      <CodeMirror
        theme={vscodeDark}
        value={sqlStr}
        height="400px"
        extensions={[
          sql(),
          sql().language.data.of({
            autocomplete: customAutoCompletions,
          }),
        ]}
        onChange={onChangeSql}
      />
    </CardContainer>
  );
}
export default SqlEditor;
