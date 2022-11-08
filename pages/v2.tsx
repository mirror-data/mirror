import {useEffect, useRef} from "react";
import dynamic from "next/dynamic";

const DB = () => {

  useEffect(() => {

    const fn = async () => {
      // @ts-ignore
      const promiser = window.sqlite3Worker1Promiser();

      try {
        console.log("start")
        const db = await promiser('open', {'filename': "/db.sql"})
        console.log(db)
        console.log("end")

      } catch (e) {
        console.log("error")
        console.log(e)
      }

    }
    fn()


  }, [])
  return <div>DB</div>
}

const NoSSR = dynamic(() => Promise.resolve(DB), {
  ssr: false
})

export default () => {

  return <div>
    <NoSSR/>
  </div>
}