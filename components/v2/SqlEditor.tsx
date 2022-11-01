import {Button, Modal, TextInput} from "@mantine/core";
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
  const handleImprove = () => {

  }

  const [instruction, setInstruction] = React.useState("");
  const [opened, setOpened] = React.useState(false);
  return <div className="relative h-full">
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
    >
      <TextInput value={instruction} onChange={(event) => setInstruction(event.currentTarget.value)}/>
      <Button onClick={handleImprove} >
        Submit
      </Button>
    </Modal>
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
    <div className="absolute right-0 top-0 bg-white flex gap-2">
      <Button variant="outline" size="xs"
              onClick={() => onChange(editorRef.current.editor.getModel().getValue())}>Manual Run</Button>
      {/*<Button variant="outline" size="xs" onClick={()=>setOpened(true)}>Edit</Button>*/}

    </div>

  </div>

}