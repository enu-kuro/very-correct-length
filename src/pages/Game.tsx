import { FC, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import useInterval from "../hooks/useInterval";
import { PAGE, usePage } from "../hooks/usePage";
import { vla_rgb } from "../utils/vla_rgb";
import {
  bgmSound,
  clickSound,
  extendSound,
  KonvaImage,
  PlayMode,
  saveHighestScore,
} from "../utils/utils";

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
const ANIMAL_NUM_HARD = 91;
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
const INTERVAL_HARD = 1000;

const culculateGrade = (lengthDiff: number) => {
  if (lengthDiff > 0.2) {
    return GRADE.BAD;
  } else if (lengthDiff > 0.1) {
    return GRADE.GOOD;
    // TODO: 難易度調整
  } else if (lengthDiff > 0.04) {
    return GRADE.GREAT;
  } else {
    return GRADE.EXCELENT;
  }
};

export const Game: FC<{
  windowHeight: number;
  gradeHistory: number[];
  setGradeHistory: React.Dispatch<React.SetStateAction<number[]>>;
  mode: PlayMode;
}> = ({ windowHeight, gradeHistory, setGradeHistory, mode }) => {
  const interval = mode === PlayMode.HARD ? INTERVAL_HARD : INTERVAL;
  const animal_num = mode === PlayMode.HARD ? ANIMAL_NUM_HARD : ANIMAL_NUM;
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
  const isSound = useRef(true);
  useEffect(() => {
    if (trRef.current && rectRef.current) {
      bgmSound?.play();
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
      }, interval / 2);
    } else {
      console.assert("Error");
    }
    return () => {
      if (bgmSound) {
        bgmSound.pause();
        bgmSound.currentTime = 0;
      }
    };
  }, []);

  useInterval(
    () => {
      isSound.current = true;
      // extendSound.load();
      // extendSound.currentTime = 0;
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
      // const [newScaleX, newScaleY] = generateRandomScale(canvasHeight);
      // rectRef.current!.scaleX(newScaleX);
      // rectRef.current!.scaleY(newScaleY);
      // rectRef.current!.x(CANVAS_WIDTH / 2 - (CANVAS_WIDTH * newScaleX) / 2);
      // rectRef.current!.y(canvasHeight - canvasHeight * newScaleY);

      if (count === animal_num) {
        setPlaying(false);
        const _score = gradeHistory.reduce(
          (partialSum, a) => partialSum + a,
          0
        );
        saveHighestScore(_score, mode);
        setTimeout(() => {
          setPage(PAGE.RESULT);
        }, interval);
      } else {
        const [newScaleX, newScaleY] = generateRandomScale(canvasHeight);
        rectRef.current!.scaleX(newScaleX);
        rectRef.current!.scaleY(newScaleY);
        rectRef.current!.x(CANVAS_WIDTH / 2 - (CANVAS_WIDTH * newScaleX) / 2);
        rectRef.current!.y(canvasHeight - canvasHeight * newScaleY);
        setCount((prev) => prev + 1);
      }
    },
    isPlaying ? interval : null
  );

  useInterval(
    () => {
      // 表示が残ってしまうので...
      setGrade(undefined);
    },
    isPlaying2 ? interval : null
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
    clickSound?.play();
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
            "mt-1 basis-1/3 text-center text-4xl text-slate-600 font-bold"
          }
        >
          {count} / {animal_num}
        </div>
        <div className={"basis-1/3 text-right mr-2 mt-2 pointer-events-auto"}>
          <button
            className={"btn btn-sm btn-error"}
            onClick={() => onClickQuit()}
          >
            Quit
          </button>
        </div>
      </div>

      <div className="absolute z-50 right-0 left-0 top-1/2 flex justify-center pointer-events-none">
        <div
          className={`fade-out${
            mode === PlayMode.HARD ? "1" : "2"
          }s text-white text-5xl font-extrabold italic text-border`}
        >
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
              // draggable={true}
              // x={CANVAS_WIDTH / 2 - (CANVAS_WIDTH * initialScaleX) / 2}
              // y={canvasHeight - canvasHeight * initialScaleY}
              fillPatternImage={image}
              fillPatternScaleY={canvasHeight / originalHeight}
              fillPatternScaleX={CANVAS_WIDTH / originalWidth}
              stroke={`rgb(${vla_rgb[count]})`}
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
              boundBoxFunc={(oldBox, newBox) => {
                // if (newBox.height > newBox.width) {
                //   console.log("ok!!!!!!!");
                //   console.log(newBox.width, newBox.height);
                // }

                // limit resize
                if (newBox.height > 150 && isSound.current) {
                  if (extendSound) {
                    extendSound?.pause();
                    extendSound.currentTime = 0;
                    extendSound.play();
                  }

                  isSound.current = false;
                  return newBox;
                }
                return newBox;
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
