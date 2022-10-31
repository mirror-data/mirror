import {MonacoWrap} from "./monacoWrap"
import {Button} from "@mantine/core";

export default ({code}: { code: string }) => {

  return <div className="relative h-full">
    <MonacoWrap code={code}/>
    {/*<div className="absolute left-0 bottom-1 flex gap-2">*/}
    {/*  <Button variant="outline" size="xs">Run</Button>*/}
    {/*  <Button variant="outline" size="xs">Edit</Button>*/}

    {/*</div>*/}

  </div>

}