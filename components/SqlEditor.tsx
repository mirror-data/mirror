// **** BEGIN original prompt to generate UI skeleton ****

// use NextJS, MUI, Tailwind, React

// SqlSnippet
// input: text with sql code
// show sql code with pre, with mono font, with background color #f6f8fa

// **** END original prompt to generate UI skeleton ****

import Editor, { OnMount } from '@monaco-editor/react'
import * as React from 'react'
import { useRef } from 'react'

export default ({ code }: { code: string }) => {
  const editorRef = useRef<any>(null)

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = {
      editor,
      monaco,
    }
  }

  return (
    <Editor
      height="300px"
      theme="vs-dark"
      options={{
        readOnly: true,
        domReadOnly: true,
        minimap: {
          enabled: false,
        },
      }}
      onMount={handleEditorDidMount}
      defaultLanguage="sql"
      value={code}
    />
  )
}
