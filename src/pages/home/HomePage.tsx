import {useState, useRef, useEffect} from 'react'
export interface Todo {
  id: number
  message: string
}
export interface TodoListProps {
  list: Todo[]
  doneMap: Record<string | number, boolean>
  onToggleDone: (id: number | string) => void
  onRemoveItem: (id: number | string) => void
}
export const TodoList = (props: TodoListProps) => {
  const {list, doneMap, onToggleDone, onRemoveItem} = props
  return (
    <div className="flex flex-col gap-8px">
      {list.map((item) => {
        return (
          <TodoItem
            key={item.id}
            isDone={doneMap[item.id]}
            onToggleDone={onToggleDone}
            onRemoveItem={onRemoveItem}
            {...item}
          />
        )
      })}
      {/* {list.map((item) => {
        return (
          <DoneItem
            key={item.id}
            isDone={doneMap[item.id]}
            onToggleDone={onToggleDone}
            onRemoveItem={onRemoveItem}
            {...item}
          />
        )
      })} */}
    </div>
  )
}
export interface TodoItemProps extends Todo {
  isDone?: boolean
  onToggleDone: (id: number | string) => void
  onRemoveItem: (id: number | string) => void
}
export const TodoItem = (props: TodoItemProps) => {
  const {onToggleDone, isDone, message, onRemoveItem} = props
  return (
    <>
      <div className="flex gap-32px">
          <button onClick={() => onRemoveItem(props.id)}>remove</button>
        <div className="flex gap-8px ">
          <input checked={isDone} type="checkbox" onChange={() => onToggleDone(props.id)}/>
          <span className={isDone ? 'line-through' : ''}>{message}</span>
        </div>
      </div>
    </>
  )
}

export const DoneItem = (props: TodoItemProps) => {
  const {onToggleDone, isDone, message, onRemoveItem} = props
  return (
    <>
      {
        isDone &&
        <div className="flex gap-16px">
          <div className="flex gap-8px w-[180px] justify-between">
            <button onClick={() => onToggleDone(props.id)}>remove</button>
            {isDone && <span className="text-red">{message}</span>}
            <button onClick={() => onRemoveItem(props.id)}>remove</button>
          </div>
        </div>
      }
    </>
  )
}


export interface TodoAddItemProps {
  onAddItem: (message: string) => void
}
export const TodoAddItem = (props: TodoAddItemProps) => {
  const {onAddItem} = props
  let message = ''
  const refInput = useRef<HTMLInputElement>(null)
  const handleAddItem = () => {
    onAddItem(message)
    message = ''
    if (refInput.current) {
      refInput.current.value = message
    }
  }
  const onInput = (event: any) => {
    message = event.target.value.trim()
  }
  return (
    <div className="flex gap-8px">
      <input placeholder="add todo" onChange={onInput} ref={refInput} />
      <button onClick={handleAddItem}>add</button>
    </div>
  )
}
export interface LocalStorageProps {
  list: Todo[]
  doneMap: Record<string | number, boolean>
}
export const LocalStorage = (props: LocalStorageProps) => {
  const {list, doneMap} = props
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
    localStorage.setItem('doneMap', JSON.stringify(doneMap))
  }, [list, doneMap])
  return null
}
const getStorage = (key: string): any => {
  const value = localStorage.getItem(key)
  if (value) {
    try {
      const parsedValue = JSON.parse(value)
      if (typeof parsedValue === 'object') {
        return parsedValue as Todo[]
      }
      return
    } catch (error) {
      console.error('Failed to parse localStorage:', error)
    }
  }
  return
}
export const HomePage = () => {
  const [list, setList] = useState(
    getStorage('list') ?? [
      {id: 1, message: 'Apple'},
      {id: 2, message: 'Banana'},
      {id: 3, message: 'Cherry'},
    ],
  )
  let idCounter = useRef(list.length)
  const [doneMap, setDoneMap] = useState<Record<string | number, boolean>>(
    getStorage('doneMap') ?? {},
  )
  const onAddItem = (message: string) => {
    idCounter.current += 1
    setList((value:any) => [...value, {id: idCounter.current, message}])
  }
  const onToggleDone = (id: string | number) => {
    setDoneMap((value) => ({...value, [id]: !value[id]}))
  }
  const onRemoveItem = (id: number | string) => {
    const index = list.findIndex((item:any) => item.id === id)
    if (index !== -1) {
      const newList = [...list.slice(0, index), ...list.slice(index + 1)]
      setList(newList)
    }
  }
  return (
    <main className="flex flex-col gap-24px">
      <LocalStorage list={list} doneMap={doneMap} />
      <TodoAddItem onAddItem={onAddItem} />
      <TodoList
        list={list}
        doneMap={doneMap}
        onToggleDone={onToggleDone}
        onRemoveItem={onRemoveItem}
      />
    </main>
  )
}