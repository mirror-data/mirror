import Editor, {OnMount, useMonaco} from "@monaco-editor/react";
import * as React from "react";
import {useEffect, useRef} from "react";
import {Button} from "@mantine/core";

export const MonacoWrap =  ({code}: { code: string }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {

    editorRef.current = {
      editor,
      monaco,
    }
  }

  return <>
    <Editor
      width="800px"
      options={{
        minimap: {
          enabled: false
        }
      }}
      onMount={handleEditorDidMount}
      defaultLanguage="sql"
      value={code}
    />


  </>
}