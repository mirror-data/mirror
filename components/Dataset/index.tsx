import {Group, Paper, Stepper, Text, useMantineTheme} from "@mantine/core";
import {Dropzone, FileWithPath, MIME_TYPES} from "@mantine/dropzone";
import {IconPhoto, IconUpload, IconX} from "@tabler/icons";
import * as React from "react";
import {useState} from "react";

export const DatasetContainer = () => {
  const [active, setActive] = useState(1);
  const theme = useMantineTheme();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  return <>
    <Paper shadow="xl" className="flex flex-col	 gap-2 mt-4 p-4 bg-white pb-6 rounded-lg ">
      <div className="h-full">
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
          <Stepper.Step label="Choose Datasets" description="demo datasets/upload csvs">

          </Stepper.Step>
          <Stepper.Step label="Verify schema" description="">
          </Stepper.Step>
          <Stepper.Step label="upload datasets" description="">
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>
      </div>
      <div className="min-h-[200px] flex flex-col">
        <Dropzone
          className="grow"
          onDrop={files => setFiles(files)}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={50 * 1024 ** 2}
          accept={[MIME_TYPES.csv]}
        >
          <Group position="center" spacing="xl" style={{minHeight: 220, pointerEvents: 'none'}}>
            <Dropzone.Accept>
              <IconUpload
                size={50}
                stroke={1.5}
                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5}/>
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Group>
        </Dropzone>


        {/*{files.map((file, index) => <SchemaView file={file}/>*/}
        {/*)}*/}
      </div>

    </Paper>
  </>
}