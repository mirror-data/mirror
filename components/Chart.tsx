import {Vega} from "react-vega";
import {Handler} from 'vega-tooltip';
import dynamic from "next/dynamic";
import React, {useEffect, useState} from "react";
import {fetchVega, MirrorData} from "../utils/datasource";
import {CircularProgress} from "@mui/material";

interface ChartProps {
  data: MirrorData
}

const Chart: React.FC<ChartProps> = ({data}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [spec, setSpec] = useState<any>({})

  useEffect(() => {
    console.log("data change", data)

    setIsLoading(true)
    const fn = async () => {
      const config = await fetchVega(data)
      setSpec(config)
      setIsLoading(false)
    }
    fn()
  }, [data.columns, data.rows])

  if (isLoading) {
    return <CircularProgress/>
  }

  return <Vega spec={spec} tooltip={new Handler().call}/>


}
const NoSSR = dynamic(() => Promise.resolve(Chart), {
  ssr: false
})

export default NoSSR