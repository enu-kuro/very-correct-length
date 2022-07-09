import { FC, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import useInterval from "../hooks/useInterval";
import { PAGE, usePage } from "../hooks/usePage";
import { vla_rgb } from "../utils/vla_rgb";
import { KonvaImage } from "../utils/utils";

export enum GRADE {
  BAD,
  GOOD,
  GREAT,
  EXCELENT,
}

const originalHeight = 800;
const originalWidth = 800;
const CANVAS_WIDTH = 375;

const ANIMAL_NUM = 30;
// const CANVAS_HEIGHT = 548;
function generateRandomScale(canvasHeight: number) {
  const initialScaleX = Math.random() * 0.4 + 1.0;
  return [
    initialScaleX,
    (Math.random() * 0.3 + 0.08) * (CANVAS_WIDTH / canvasHeight),
  ];
  // return [1.4, 0.05 * (CANVAS_WIDTH / canvasHeight)];
}

const INTERVAL = 2000;

const culculateGrade = (lengthDiff: number) => {
  if (lengthDiff > 0.2) {
    return GRADE.BAD;
  } else if (lengthDiff > 0.1) {
    return GRADE.GOOD;
  } else if (lengthDiff > 0.03) {
    return GRADE.GREAT;
  } else {
    return GRADE.EXCELENT;
  }
};

export const Game: FC<{
  windowHeight: number;
  setGradeHistory: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ windowHeight, setGradeHistory }) => {
  const canvasHeight = windowHeight;
  const [grade, setGrade] = useState<GRADE>();
  // const [isCorrect, setIsCorrect] = useState(false);
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const { setPage } = usePage();
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const [isPlaying2, setPlaying2] = useState<boolean>(false);
  // 1からにしておく(#0のanimalはNFT化されていない)
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      const [initialScaleX, initialScaleY] = generateRandomScale(canvasHeight);
      // we need to attach transformer manually
      rectRef.current!.scaleY(initialScaleY);
      rectRef.current!.scaleX(initialScaleX);
      rectRef.current!.x(CANVAS_WIDTH / 2 - (CANVAS_WIDTH * initialScaleX) / 2);
      rectRef.current!.y(canvasHeight - canvasHeight * initialScaleY);
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()!.batchDraw();
      setGradeHistory([]);
      console.log("setup!");
      setPlaying(true);

      setTimeout(() => {
        setPlaying2(true);
      }, INTERVAL / 2);
    } else {
      console.assert("Error");
    }
  }, []);

  useInterval(
    () => {
      if (count === ANIMAL_NUM) {
        // 画面遷移しても以下のコードは最後まで実行される。
        setPlaying(false);
        setTimeout(() => {
          setPage(PAGE.RESULT);
        }, INTERVAL);
      } else {
        setCount((prev) => prev + 1);
      }
      const stretchedlength = trRef.current!.getHeight();
      const correctLength = trRef.current!.getWidth();
      console.log("長さ: ", trRef.current!.getHeight());
      console.log("正解: ", trRef.current!.getWidth());
      const lengthDiff =
        Math.abs(correctLength - stretchedlength) / correctLength;
      const grade = culculateGrade(lengthDiff);
      setGrade(grade);
      console.log("成績: ", grade);
      setGradeHistory((prev) => [...prev, grade]);

      trRef.current!.stopTransform();
      const [newScaleX, newScaleY] = generateRandomScale(canvasHeight);
      rectRef.current!.scaleX(newScaleX);
      rectRef.current!.scaleY(newScaleY);
      rectRef.current!.x(CANVAS_WIDTH / 2 - (CANVAS_WIDTH * newScaleX) / 2);
      rectRef.current!.y(canvasHeight - canvasHeight * newScaleY);
    },
    isPlaying ? INTERVAL : null
  );

  useInterval(
    () => {
      // 表示が残ってしまうので...
      setGrade(undefined);
    },
    isPlaying2 ? INTERVAL : null
  );

  // const onClick = () => {
  //   trRef.current!.stopTransform();
  //   const [newScaleX, newScaleY] = generateRandomScale();
  //   rectRef.current!.scaleX(newScaleX);
  //   rectRef.current!.scaleY(newScaleY);
  //   rectRef.current!.x(CANVAS_WIDTH / 2 - (CANVAS_WIDTH * newScaleX) / 2);
  //   rectRef.current!.y(CANVAS_HEIGHT - CANVAS_HEIGHT * newScaleY);
  //   setCount((prev) => prev + 1);
  // };

  const onClickQuit = () => {
    setPage(PAGE.TOP);
  };
  const image = KonvaImage(`vla/vla${count % 92}.jpg`);
  // const image = KonvaImage(`vla/vla_5.jpg`);

  return (
    <div className="container mx-auto grid grid-cols-1 items-end">
      <div className="absolute z-50 inset-0 flex h-8 pointer-events-none">
        <div className={"basis-1/3"}></div>
        <div
          className={
            "mt-1 basis-1/3 text-center text-2xl text-slate-600 font-bold"
          }
        >
          {count} / {ANIMAL_NUM}
        </div>
        <div className={"basis-1/3 text-right mr-1 mt-1 pointer-events-auto"}>
          <button
            className={"btn btn-xs btn-error"}
            onClick={() => onClickQuit()}
          >
            Quit
          </button>
        </div>
      </div>

      <div className="absolute z-50 right-0 left-0 top-1/2 flex justify-center pointer-events-none">
        <div className="fade-out2s text-white text-5xl font-extrabold italic text-border">
          {grade !== undefined && GRADE[grade]}
        </div>
      </div>
      <div
        className={"container mx-auto flex justify-center items-end"}
        style={{ backgroundColor: `rgb(${vla_rgb[count]})` }}
      >
        <Stage
          width={CANVAS_WIDTH}
          height={canvasHeight}
          // style={{ backgroundColor: `rgb(${vla_rgb[count]})` }}
        >
          <Layer>
            <Rect
              ref={rectRef}
              width={CANVAS_WIDTH}
              height={canvasHeight}
              draggable={true}
              // x={CANVAS_WIDTH / 2 - (CANVAS_WIDTH * initialScaleX) / 2}
              // y={canvasHeight - canvasHeight * initialScaleY}
              fillPatternImage={image}
              fillPatternScaleY={canvasHeight / originalHeight}
              fillPatternScaleX={CANVAS_WIDTH / originalWidth}
            />
            <Transformer
              ref={trRef}
              anchorFill={"transparent"}
              anchorStroke={"transparent"}
              anchorSize={375}
              enabledAnchors={["top-center"]}
              borderEnabled={false}
              flipEnabled={false}
              rotateEnabled={false}
              padding={-50}
              // boundBoxFunc={(oldBox, newBox) => {
              //   if (newBox.height > newBox.width) {
              //     console.log("ok!!!!!!!");
              //     console.log(newBox.width, newBox.height);
              //   }

              //   // limit resize
              //   if (newBox.width < 5 || newBox.height < 5) {
              //     return oldBox;
              //   }
              //   return newBox;
              // }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
