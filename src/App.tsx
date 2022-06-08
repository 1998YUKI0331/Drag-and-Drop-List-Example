import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

interface IGrab {
  target: HTMLElement | null;
  index: number | null;
  position: { x: number; y: number };
  move_up: number[];
  move_down: number[];
  updateList: string[];
}

const _Item: string[] = [
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
  const [lists, setLists] = useState<string[]>(_Item); //현재 정렬된 리스트
  const [grab, setGrab] = useState<IGrab>(_initGrabData); //현재 선택된 요소
  const [isDrag, setIsDrag] = useState(false); //현재 드래그 중인지 아닌지

  useEffect(() => {}, [grab]);

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
    let grabIndex = Number(grab.target?.dataset.index);
    let listIndex = grab.index;
    let targetIndex = Number(e.currentTarget.dataset.index);

    let move_up = [...grab.move_up];
    let move_down = [...grab.move_down];

    let data = [...grab.updateList];
    data[listIndex as number] = data.splice(
      targetIndex,
      1,
      data[listIndex as number]
    )[0];

    if (grabIndex > targetIndex) {
      move_down.includes(targetIndex)
        ? move_down.pop()
        : move_down.push(targetIndex);
    } else if (grabIndex < targetIndex) {
      move_up.includes(targetIndex) ? move_up.pop() : move_up.push(targetIndex);
    } else {
      move_down = [];
      move_up = [];
    }

    setGrab({
      ...grab,
      move_up,
      move_down,
      updateList: data,
      index: targetIndex,
    });
  };

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
                id={String(index)}
                data-index={index}
                className={classNames}
                isDrag={isDrag}
                onDragStart={_onDragStart}
                onDragEnd={_onDragEnd}
                onDrag={_onDrag}
                onDragEnter={_onDragEnter}
                draggable
              >
                {item}
              </ListItem>
            );
          })}
        </List>
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
  cursor: grab;
  width: 500px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid rgba(187, 187, 187, 0.5);
  border-radius: 10px;
  margin: 10px;
  background: lightcoral;
  transform: translate(0, 0);
  ${(props) => props.isDrag && "transition: transform 200ms ease 0s"};

  &.move_up {
    transform: translate(0, -41px);
  }
  &.move_down {
    transform: translate(0, 41px);
  }
`;

export default App;
