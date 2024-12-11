import React, { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { html } from "@codemirror/lang-html";
import { CardContainer } from "@/components/card-container";
function CodeView() {
  const [htmlStr, setHtmlStr] = useState("<div>hello word</div>");
  const onChange = useCallback((val: string) => {
    setHtmlStr(val);
  }, []);

  return (
    <CardContainer
      title="HTML"
      footer={<div dangerouslySetInnerHTML={{ __html: htmlStr }}></div>}
    >
      <CodeMirror
        theme={vscodeDark}
        value={htmlStr}
        height="400px"
        extensions={[html()]}
        onChange={onChange}
      />
    </CardContainer>
  );
}
export default CodeView;
