import { Button } from '_tosslib/components/Button';
import colors from '_tosslib/constants/colors';
import { Txt } from '_tosslib/components/Txt';

interface Coordinate {
  x: any;
  y: any;
}

interface PwdKeypadProps {
  svgGrid: string[][];
  onSvgClick: (value: Coordinate) => void;
  onReset: () => void;
  onErase: () => void;
  onConfrim: () => void;
  onRefresh: () => void;
}

export const PwdKeypad = ({ svgGrid, onSvgClick, onReset, onErase, onConfrim, onRefresh }: PwdKeypadProps) => {
  const extractNumberFromSvg = (svg: string): string => {
    const matches = svg.match(/data-testid="([^"]+)"/);
    const text = matches ? matches[1] : '';
    console.log(text);
    if (text === 'refresh') {
      onRefresh();
    }
    return text ? text : 'blank';
  };
  const svgClickHandler = (event: any, svg: any, rowIndex: number, columnIndex: number) => {
    event.preventDefault();
    console.log(svg);
    const text = extractNumberFromSvg(svg);
    console.log('ddd', text);
    if (text !== 'blank' && text !== 'shuffle') {
      onSvgClick({ x: rowIndex, y: columnIndex });
    }
  };

  const eraseHandler = (event: any) => {
    event.preventDefault();
    onErase();
  };

  const resetHandler = (event: any) => {
    event.preventDefault();
    onReset();
  };

  const confirmHandler = (event: any) => {
    event.preventDefault();
    onConfrim();
  };

  return (
    <div
      style={{
        padding: '20px',
        position: 'absolute',
        background: '#fff',
        zIndex: '1',
        borderRadius: '15px',
        border: '1px solid #020202',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: '10px',
        }}
      >
        {Array.from({ length: 3 }).map((_, rowIndex) => (
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '10px' }}
            key={`row-${rowIndex}`}
          >
            {Array.from({ length: 5 }).map((_, columnIndex) => {
              if (rowIndex === 0 && columnIndex === 4) {
                return (
                  <Button
                    variant="secondary"
                    onMouseDown={event => eraseHandler(event)}
                    key={`key-${rowIndex}-${columnIndex}`}
                  >
                    지우기
                  </Button>
                );
              } else if (rowIndex === 1 && columnIndex === 4) {
                return (
                  <Button
                    variant="secondary"
                    onMouseDown={event => resetHandler(event)}
                    key={`key-${rowIndex}-${columnIndex}`}
                  >
                    전체삭제
                  </Button>
                );
              } else if (rowIndex === 2 && columnIndex === 4) {
                return (
                  <Button
                    variant="primary"
                    onMouseDown={event => confirmHandler(event)}
                    key={`key-${rowIndex}-${columnIndex}`}
                  >
                    확인
                  </Button>
                );
              } else if (svgGrid[rowIndex] && svgGrid[rowIndex][columnIndex]) {
                return (
                  <Button
                    variant="secondary"
                    key={`key-${rowIndex}-${columnIndex}`}
                    onMouseDown={event => svgClickHandler(event, svgGrid[rowIndex][columnIndex], rowIndex, columnIndex)}
                  >
                    <div dangerouslySetInnerHTML={{ __html: svgGrid[rowIndex][columnIndex] }} />
                  </Button>
                );
              } else {
                return <Button variant="secondary" key={`key-${rowIndex}-${columnIndex}`} />;
              }
            })}
          </div>
        ))}
      </div>
      <div
        style={{
          paddingTop: '8px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Txt color={colors.grey700}>비밀번호를 입력해주세요</Txt>
        <Txt color={colors.grey700}>6자리로 입력해주세요</Txt>
      </div>
    </div>
  );
};
