import * as React from "react";
import Head from "next/head";

import {Question} from "@/components/Question";

export default () => {


  return <div style={{
    backgroundColor: "rgb(237 242 255 / 60%)",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23e0eefb'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E\")",
  }} className="h-screen w-screen p-4 flex flex-col">
    <Head>
      <title>Mirror for OSSInsight</title>
      <link rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪞</text></svg>"/>
    </Head>


    <Question/>


  </div>
}