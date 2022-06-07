import { useState, useEffect } from "react";
import styled from "@emotion/styled";

interface ISNS {
  title: string;
  color: string;
  backgroundColor: string;
}

interface IGrab {
  target: HTMLElement | null;
  position: number | null;
  move_up: number[];
  move_down: number[];
  updateList: ISNS[];
}

const _SocialNetworks: ISNS[] = [
  { title: "Twitter", color: "white", backgroundColor: "Red" },
  { title: "Facebook", color: "black", backgroundColor: "Orange" },
  { title: "Line", color: "black", backgroundColor: "Yellow" },
  { title: "Instagram", color: "white", backgroundColor: "Green" },
  { title: "Telegram", color: "white", backgroundColor: "Blue" },
  { title: "KaKao", color: "white", backgroundColor: "DarkBlue" },
  { title: "LinkedIn", color: "white", backgroundColor: "Purple" },
];

const _initGrabData: IGrab = {
  target: null,
  position: null,
  move_up: [],
  move_down: [],
  updateList: [],
};

const App = () => {
  const [lists, setLists] = useState<ISNS[]>(_SocialNetworks); //현재 정렬된 리스트
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
      position: Number(e.currentTarget.dataset.position),
      updateList: [...lists],
    });

    e.currentTarget.classList.add("grabbing");
    e.dataTransfer.effectAllowed = "move";
  };

  const _onDragEnd = (e: React.DragEvent<HTMLElement>) => {
    setIsDrag(false);
    e.currentTarget.classList.remove("grabbing");
    e.dataTransfer.dropEffect = "move";

    setLists([...grab.updateList]);

    setGrab({
      target: null,
      position: null,
      move_up: [],
      move_down: [],
      updateList: [],
    });

    e.currentTarget.style.visibility = "visible";
  };

  const _onDragEnter = (e: React.DragEvent<HTMLElement>) => {
    let grabPosition = Number(grab.target?.dataset.position);
    let listPosition = grab.position;
    let targetPosition = Number(e.currentTarget.dataset.position);

    let move_up = [...grab.move_up];
    let move_down = [...grab.move_down];

    let data = [...grab.updateList];
    data[listPosition as number] = data.splice(
      targetPosition,
      1,
      data[listPosition as number]
    )[0];

    if (grabPosition > targetPosition) {
      move_down.includes(targetPosition)
        ? move_down.pop()
        : move_down.push(targetPosition);
    } else if (grabPosition < targetPosition) {
      move_up.includes(targetPosition)
        ? move_up.pop()
        : move_up.push(targetPosition);
    } else {
      move_down = [];
      move_up = [];
    }

    setGrab({
      ...grab,
      move_up,
      move_down,
      updateList: data,
      position: targetPosition,
    });
  };

  const _onDragLeave = (e: any) => {
    if (e.target === grab.target) {
      e.target.style.visibility = "hidden";
    }
  };

  return (
    <>
      <Container>
        <List onDragOver={_onDragOver}>
          {lists.map((sns, index) => {
            let classNames = "";
            grab.move_up.includes(index) && (classNames = "move_up");
            grab.move_down.includes(index) && (classNames = "move_down");

            return (
              <ListItem
                key={index}
                data-position={index}
                className={classNames}
                isDrag={isDrag}
                onDragStart={_onDragStart}
                onDragEnd={_onDragEnd}
                onDragEnter={_onDragEnter}
                onDragLeave={_onDragLeave}
                draggable
                style={{
                  backgroundColor: sns.backgroundColor,
                  color: sns.color,
                  fontSize: "bold",
                }}
              >
                {sns.title}
              </ListItem>
            );
          })}
        </List>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: relative;
`;

const List = styled.ul`
  list-style: none;
`;

const ListItem = styled.li<{
  isDrag?: boolean;
}>`
  cursor: grab;
  width: 150px;
  height: 40px;
  ${(props) => props.isDrag && "transition: transform 200ms ease 0s"};

  &.grabbing {
    cursor: grabbing;
  }

  &.move_up {
    transform: translate(0, -41px);
  }

  &.move_down {
    transform: translate(0, 41px);
  }
`;

export default App;
