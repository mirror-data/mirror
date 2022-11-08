import React, {useEffect} from "react";
import {FileWithPath} from "@mantine/dropzone";

const csvReader = (file: File) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => {
      const text = reader.result;
      if (text && typeof text === "string") {
        const firstLine = text.split('\n').shift();
        resolve(firstLine);
      }

      reject("Empty");
    };
    reader.onerror = reject;

  })

  reader.readAsText(file, 'UTF-8');
  return promise;
}


export const SchemaView: React.FC = ({file}: { file: FileWithPath }) => {
  const [schema, setSchema] = React.useState<string | null>(null);
  useEffect(() => {
    csvReader(file).then((schema) => {
      setSchema(schema as string);
    })
  }, [])
  return <div>
    <pre>{file.name}</pre>
    <pre>{schema}</pre>

  </div>

}