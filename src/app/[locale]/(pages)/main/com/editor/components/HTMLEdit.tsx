import React from "react";
import { Card, Divider } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { html } from "@codemirror/lang-html";

export default function() {
  const [htmlStr, setHtmlStr] = React.useState("<div>hello word</div>");
  const onChange = React.useCallback((val: any, viewUpdate: any) => {
    setHtmlStr(val);
  }, []);

  return <div className="w-full h-full">
    <Card title="HTML">
      <CodeMirror theme={vscodeDark}
                  value={htmlStr}
                  height="400px"
                  extensions={[
                    html()
                  ]}
                  onChange={onChange} />
      <Divider></Divider>
      <div dangerouslySetInnerHTML={{ __html: htmlStr }}></div>
    </Card>
  </div>;
}
