import { useState, useEffect } from 'react'

const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '4px',
    width: '300px',
    height: '300px',
}
const tileStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
    background: '#eee',
    cursor: 'pointer',
    border: "2px solid gray",
}

const oStyle: React.CSSProperties = {
  color: "white",
  background: "black",
}
const xStyle: React.CSSProperties = {
  color: "black",
  background: "white",
}

type TileType = 'x' | 'o' | null
type TileProps = {
    index: number,
    type: TileType,
    onTileClick: (index: number) => void
}

function Tile({ index, type, onTileClick }: TileProps) {
  // 기본 타일 스타일과 함께 필요한 경우 o, x 스타일 적용
  return <button style={{
      ...tileStyle,
      ...(type === null ? {} : (type === 'o' ? oStyle : xStyle))
  }} onClick={() => onTileClick(index)}>{type ?? "-"}</button>
}

// 승자 체크 로직
function checkWinner(tiles: TileType[]): TileType | null {
  // 가로 3줄 확인
  for (let i = 0; i < 9; i += 3) {
      if (tiles[i] !== null && tiles[i] === tiles[i + 1] && tiles[i] === tiles[i + 2]) {
          return tiles[i]
      }
  }
  // 세로 3줄 확인
  for (let i = 0; i < 3; i++) {
      if (tiles[i] !== null && tiles[i] === tiles[i + 3] && tiles[i] === tiles[i + 6]) {
          return tiles[i]
      }
  }
  // 대각선 (좌상->우하)
  if (tiles[0] !== null && tiles[0] === tiles[4] && tiles[0] === tiles[8]) {
      return tiles[0]
  }
  // 대각선 (우상->좌하)
  if (tiles[2] !== null && tiles[2] === tiles[4] && tiles[2] === tiles[6]) {
      return tiles[2]
  }
  // 승자가 없음
  return null
}





function TicTacToeApp() {
    const [tiles, setTiles] = useState<TileType[]>(Array(9).fill(null))
     
    // (항상 o부터 시작한다고 가정)
    const [currentTurn, setCurrentTurn] = useState<TileType>('o')

    // 승자 상태
    const [winner, setWinner] = useState<(TileType|"draw")|null>(null); 
    
    // 타일 상태가 변경될 때마다 승자 확인
    useEffect(() => {
      const result = checkWinner(tiles)
      // 승자가 결정되었다면
      if (result) {
          // 상태 업데이트
          setWinner(result)
      } else {
          // 만약, 모든 타일이 채워졌다면
          //every : 전체가 다 true여야 됨 (null이x)
          if (tiles.every(tile => tile !== null)) {
              // 무승부로 설정
              setWinner('draw')
          }
      }
  }, [tiles])

    // 차례를 변경하는 함수 정의 (o -> x, x -> o)
    const changeTurn = () => {
        setCurrentTurn(currentTurn => currentTurn === 'o' ? 'x' : 'o')
    }
    // 타일 클릭 핸들러 정의
    const onTileClick = (index: number) => { 
        const playable = tiles[index] === null && winner=== null; // 타일이 비어있고 승자가 없을 때만 클릭 가능
        if (playable) {
            // 타일 상태 업데이트
            setTiles(tiles => {
                const newTiles = [...tiles] // 기존 타일 상태 복사
                newTiles[index] = currentTurn // 현재 차례의 타일로 변경
                return newTiles 
            })
            // 다음 차례로 변경
            changeTurn()
        }
    }
 

  
    const restart = ()=>{
      setTiles(Array(9).fill(null));// 타일 상태 초기화
      setWinner(null); // 승자 상태 초기화
      setCurrentTurn('o'); // o부터 시작하도록 차례 초기화
    }

    return <div> 
        <h1>현재 차례: {currentTurn}</h1>
        <div style={boardStyle}>
            {
                tiles.map((tile, index) => {
                    // 임시 함수 제거하고, 앞서 정의한 타일 클릭 핸들러 전달
                    return <Tile index={index} type={tile} onTileClick={onTileClick} />
                })
            }
        </div>

        {winner && <div>
          {winner === 'draw' ? <h1>비겼습니다.</h1> : <h1>{winner} 승리!</h1>}
          <button onClick={restart}>다시하기</button>
          </div>}
    </div>
}

export default TicTacToeApp