import React from "react";
import { Card, Divider } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { sql } from "@codemirror/lang-sql";

export default function() {
  const [sqlStr, setSqlStr] = React.useState("SELECT * FROM USER");
  const customAutoCompletions = (context: any) => {
    let word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit)
      return null;
    return {
      from: word.from,
      options: [
        { label: "match", type: "keyword" },
        { label: "hello", type: "variable", info: "(World)" },
        { label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },
        { label: "sql.user", type: "variable", apply: "select.tsx * from user", info: "用户查询SQL" },
        { label: "sql.car", type: "variable", apply: "select.tsx * from car", info: "汽车查询SQL" }
      ]
    };
  };

  const onChangeSql = React.useCallback((val: any, viewUpdate: any) => {
    setSqlStr(val);
  }, []);
  return <div className="w-full h-full">
    <Card title="SQL">
      <CodeMirror theme={vscodeDark} value={sqlStr} height="400px"
                  extensions={[
                    sql(),
                    sql().language.data.of({
                      autocomplete: customAutoCompletions
                    })
                  ]}
                  onChange={onChangeSql} />
      <Divider></Divider>
      <div>{sqlStr}</div>
    </Card>
  </div>;
}
