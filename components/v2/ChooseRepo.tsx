import {List, LoadingOverlay, TextInput} from "@mantine/core"
import {useEffect, useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";

const Icon = ({src}: { src: string }) => {
  return <img src={src} className="w-4 h-4"/>
}


export default ({setRepo, onClose}: {setRepo: (id:string, name: string)=>void, onClose: ()=>void}) => {
  const [name, setName] = useState<string>("")
  const [debounced] = useDebouncedValue(name, 200);
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    const v = (debounced && debounced.length > 0) ? debounced : "recommend-repo-list-1-keyword"
    fetch(`/api/v1/repo?keyword=${v}`)
      .then(res => res.json())
      .then(res => {
        setIsLoading(false)
        setData(res?.data ?? [])
      })

  }, [debounced])


  return <>
    <TextInput value={name} onChange={e => setName(e.currentTarget.value)} placeholder="Search for a repo"/>

    <List className="mt-6 relative">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data.map((item: any) => {
        const name = item.fullName
        return <List.Item
          key={item.id}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setRepo(item.id, name)
            onClose()
          }}
          icon={<Icon src={`https://github.com/${name.split("/")[0]}.png`}/>}>
          {item?.fullName}
        </List.Item>
      })}
    </List>
  </>
}