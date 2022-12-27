import {List, LoadingOverlay, SegmentedControl, TextInput} from "@mantine/core"
import {useEffect, useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";

const Icon = ({src}: { src: string }) => {
  return <img src={src} className="w-4 h-4"/>
}


export default ({setRepo, onClose}: {setRepo: (type: string, id:string, name: string)=>void, onClose: ()=>void}) => {
  const [name, setName] = useState<string>("")
  const [debounced] = useDebouncedValue(name, 200);
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [type, setType] = useState('repo');

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/v1/${type}?keyword=${debounced}`)
      .then(res => res.json())
      .then(res => {
        setIsLoading(false)
        setData(res?.data ?? [])
      })

  }, [debounced, type])

  return <>
    <div className="flex">
      <SegmentedControl
        size="sm"
        className="mr-3"
        value={type}
        onChange={setType}
        data={[
          { label: 'Repo', value: 'repo' },
          { label: 'Hacker', value: 'hacker' },
        ]}
      />
      <TextInput value={name} onChange={e => setName(e.currentTarget.value)} placeholder={`Search for a ${type}`}/>

    </div>

    <List className="mt-6 relative">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data.map((item: any) => {
        const name = item.fullName || item.login
        return <List.Item
          key={item.id}
          className="p-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setRepo(type, item.id, name)
            onClose()
          }}
          icon={<Icon src={`https://github.com/${name.split("/")[0]}.png`}/>}>
          {name}
        </List.Item>
      })}
    </List>
  </>
}