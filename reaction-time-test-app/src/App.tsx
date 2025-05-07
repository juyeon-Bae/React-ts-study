import { useState, type ReactNode } from "react"

type TestState = "ready" | "start" | "test" | "end"

type TestRecord = {
  start: number | null,
  end: number | null,
}

const DEACTIVE_COLOR = "red"
const ACTIVE_COLOR = "green"

type TypeColor = typeof DEACTIVE_COLOR | typeof ACTIVE_COLOR;

// 상태에 따른 색상을 매핑하는 객체 추가
const colorByState: Record<TestState, TypeColor> = {
    ready: DEACTIVE_COLOR,
    start: DEACTIVE_COLOR,
    test: ACTIVE_COLOR,
    end: DEACTIVE_COLOR,
}

const defaultButtonStyle : React.CSSProperties = {
  width: 150,
  height: 50,
  fontSize: 20,
  borderRadius: 10,
}


function App() {
  const [state, setState] = useState<TestState>("ready")
  const [record, setRecord] = useState<TestRecord>({start: null, end: null})

  let instruction: ReactNode = null
  let actionButton: ReactNode = null
  const color = colorByState[state]

  if (state === "ready") {
    instruction = <h1>누르면 시작합니다.</h1>
    actionButton = (
      <button style={{...defaultButtonStyle,color:"white", background:color}} onClick={() => {
        setState("start");
        const timeout = 2000;
        setTimeout(() => {
          setState("test");
          setRecord(r =>({...r,start:Date.now()})) //함수를 주면 이전 상태값을 받아 새 상태값을 반환하는 함수 직접 작성 가능
        }, timeout);
      }}>시작</button>
    );
  } else if (state === "start") {
    instruction = <h1>버튼이 녹색이 되면 클릭하세요!</h1>
    actionButton = <button style={{...defaultButtonStyle,color:"white", background:color}} >클릭</button>
  } else if (state === "test") {
    instruction = <h1>클릭하세요</h1>
    actionButton = <button style={{background:"green"}} onClick={()=>{
      setState("end")
      setRecord(r=>({...r, end:Date.now()}))
    }}>클릭</button>
  }else if (state === "end") {
    instruction = <h1>반응 속도:{record.end! - record.start!}ms</h1>
    actionButton = <button  style={{...defaultButtonStyle,color:"white", background:color}}  onClick={()=> setState("ready")}>재시도</button>
  }

  return (
    <div>
      {instruction}
      {actionButton}
    </div>
  )
}

export default App
