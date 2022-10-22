import {Vega} from "react-vega";
import {Handler} from 'vega-tooltip';
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {fetchVega, MirrorData} from "../utils/datasource";

interface ChartProps {
  data: MirrorData
}

const Chart: React.FC<ChartProps> = ({data}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [spec, setSpec] = useState<any>({})

  useEffect(() => {
    console.log("data change", data)

    setIsLoaded(true)
    const fn = async () => {
      const config = await fetchVega(data)
      setSpec(config)
      setIsLoaded(false)
    }
    fn()
  }, [data.columns, data.rows])

  if (isLoaded) {
    return <p>waiting GPT3 create chart...</p>
  }

  return <Vega spec={spec} tooltip={new Handler().call}/>


}
const NoSSR = dynamic(() => Promise.resolve(Chart), {
  ssr: false
})

export default NoSSR