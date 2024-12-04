import React, { useCallback, useState } from "react";
import { Card, Divider } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { html } from "@codemirror/lang-html";
function CodeView() {
  const [htmlStr, setHtmlStr] = useState("<div>hello word</div>");
  const onChange = useCallback((val: string) => {
    setHtmlStr(val);
  }, []);

  return (
    <div className="h-full w-full">
      <Card title="HTML">
        <CodeMirror
          theme={vscodeDark}
          value={htmlStr}
          height="400px"
          extensions={[html()]}
          onChange={onChange}
        />
        <Divider></Divider>
        <div dangerouslySetInnerHTML={{ __html: htmlStr }}></div>
      </Card>
    </div>
  );
}
export default CodeView;
