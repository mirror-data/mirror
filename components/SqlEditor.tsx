import {Button} from "@mantine/core";
import Editor, {OnMount} from "@monaco-editor/react";
import * as React from "react";
import {useRef} from "react";

export default ({code, onChange}: { code: string, onChange: (v: string) => void }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {

    editorRef.current = {
      editor,
      monaco,
    }
  }
  return <div className="relative h-full">
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
    <div className="absolute left-0 bottom-1 flex gap-2">
      <Button variant="outline" size="xs"
              onClick={() => onChange(editorRef.current.editor.getModel().getValue())}>Manual Run</Button>
      {/*<Button variant="outline" size="xs">Edit</Button>*/}

    </div>

  </div>

}