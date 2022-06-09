import { useState, useEffect } from "react";
import styled from "@emotion/styled";

interface IGrab {
  target: HTMLElement | null;
  index: number | null;
  position: { x: number; y: number };
  move_up: number[];
  move_down: number[];
  updateList: string[];
}

const _Items: string[] = [
  "하이하이",
  "안녕안녕",
  "바이바이",
  "어쩔어쩔",
  "유키유키",
];

const _initGrabData: IGrab = {
  target: null,
  index: null,
  position: { x: 0, y: 0 },
  move_up: [],
  move_down: [],
  updateList: [],
};

const App = () => {
  const [lists, setLists] = useState<string[]>(_Items); //현재 정렬된 리스트
  const [grab, setGrab] = useState<IGrab>(_initGrabData); //현재 선택된 요소
  const [isDrag, setIsDrag] = useState(false); //현재 드래그 중인지 아닌지

  useEffect(() => {
    grab.move_down.length + grab.move_up.length === 0 &&
      setGrab((prev) => {
        return { ...prev, updateList: [...lists] };
      });
  }, [grab.move_down, grab.move_up]);

  const _onDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault(); //onDrop 이벤트 활성화
  };

  const _onDragStart = (e: React.DragEvent<HTMLElement>) => {
    setIsDrag(true);
    setGrab({
      ...grab,
      target: e.currentTarget,
      index: Number(e.currentTarget.dataset.index),
      position: {
        x: e.currentTarget.offsetLeft,
        y: e.currentTarget.offsetTop,
      },
      updateList: [...lists],
    });

    const img = new Image();
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = "move";
  };

  const _onDrag = (e: React.DragEvent<HTMLElement>) => {
    if (grab.target) {
      grab.target.style.opacity = "0.5";
      grab.target.style.zIndex = "999";
      grab.target.style.left = `${
        e.pageX - grab.position.x - grab.target.offsetWidth / 2
      }px`;
      grab.target.style.top = `${e.pageY - grab.position.y}px`;
    }
  };

  const _onDragEnd = (e: React.DragEvent<HTMLElement>) => {
    setIsDrag(false);
    e.dataTransfer.dropEffect = "move";

    if (grab.target) {
      grab.target.style.opacity = "1";
      grab.target.style.zIndex = "0";
      grab.target.style.left = `0px`;
      grab.target.style.top = `0px`;
    }

    setLists([...grab.updateList]);
    setGrab({
      ..._initGrabData,
    });
  };

  const _onDragEnter = (e: React.DragEvent<HTMLElement>) => {
    let _grabbed = Number(grab.target?.dataset.index); //선택된 요소의 index
    let _index = grab.index; //상하관계를 갖는 타겟 요소의 index
    let _target = Number(e.currentTarget.dataset.index); //updateList에서 선택된 요소의 index

    let move_up = [...grab.move_up];
    let move_down = [...grab.move_down];

    console.log(_grabbed, _index, _target);

    let data = [...grab.updateList];
    data[_index as number] = data.splice(_target, 1, data[_index as number])[0];

    if (_grabbed > _target) {
      move_down.includes(_target) ? move_down.pop() : move_down.push(_target);
    } else if (_grabbed < _target) {
      move_up.includes(_target) ? move_up.pop() : move_up.push(_target);
    } else {
      move_down = [];
      move_up = [];
    }

    setGrab({
      ...grab,
      move_up: move_up,
      move_down: move_down,
      updateList: data,
      index: _target,
    });
  };

  const _onDragLeave = (e: React.DragEvent<HTMLElement>) => {};

  return (
    <>
      <Container>
        <List onDragOver={_onDragOver}>
          {lists.map((item, index) => {
            let classNames = "";
            grab.move_up.includes(index) && (classNames = "move_up");
            grab.move_down.includes(index) && (classNames = "move_down");

            return (
              <ListItem
                key={index}
                data-index={index}
                className={classNames}
                isDrag={isDrag}
                onDragStart={_onDragStart}
                onDrag={_onDrag}
                onDragEnter={_onDragEnter}
                onDragLeave={_onDragLeave}
                onDragEnd={_onDragEnd}
                draggable
              >
                <div>
                  <span>...</span>
                  <div>{item}</div>
                </div>
              </ListItem>
            );
          })}
        </List>
        <div>MoveUp : {grab.move_up}</div>
        <div>MoveDown : {grab.move_down}</div>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  position: relative;
`;

const ListItem = styled.li<{
  isDrag?: boolean;
}>`
  position: relative;
  cursor: move;
  width: 500px;
  height: 60px;
  margin: 10px;
  background: lightcoral;
  border-radius: 10px;
  transform: translate(0, 0);
  user-select: none;
  touch-action: none;
  cursor: grab;
  ${(props) => props.isDrag && "transition: transform 200ms ease 0s"};

  &.move_up {
    transform: translate(0, -65px);
  }
  &.move_down {
    transform: translate(0, 65px);
  }
  & > * {
    pointer-events: none;
  }
`;

export default App;
