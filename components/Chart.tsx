import {Vega} from "react-vega";
import {Handler} from 'vega-tooltip';
import dynamic from "next/dynamic";
import React from "react";

interface ChartProps {
  config: any
}

const Chart: React.FC<ChartProps> = ({config}) => {
  return <Vega spec={config} tooltip={new Handler().call}/>
}
const NoSSR = dynamic(() => Promise.resolve(Chart), {
  ssr: false
})

export default NoSSR