import {Vega} from "react-vega";
import {Handler} from 'vega-tooltip';
import dynamic from "next/dynamic";
import React from "react";

interface ChartProps {
  config: any
}

const Chart: React.FC<ChartProps> = ({config}) => {

  return <div ><Vega spec={{
    ...config,
    width: 500
  }} tooltip={new Handler().call}/>
  </div>
}
const NoSSR = dynamic(() => Promise.resolve(Chart), {
  ssr: false
})

export default NoSSR