import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Transformer, Line } from "react-konva";
import { vla_rgb } from "../utils/vla_rgb";
import { KonvaImage } from "../utils/utils";
import { HandGestureIcon } from "./HandGestureIcon";

export const Tutorial = ({
  vlaNum,
  setShowModal,
}: {
  vlaNum: number;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [showExcelent, setShowExcelent] = useState(false);
  const [showGesture, setShowGesture] = useState(true);
  return (
    <div
      className="modal modal-open"
      onClick={() => {
        setShowModal(false);
      }}
    >
      <div
        className="modal-box"
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ backgroundColor: `rgb(${vla_rgb[vlaNum]})` }}
      >
        {showGesture && (
          <div className="pointer-events-none absolute z-50 top-2/3 left-1/2">
            <HandGestureIcon
              className={"up-down w-20 h-20 rotate-[-45deg]"}
              fill={"white"}
            />
          </div>
        )}
        <label
          className="btn btn-sm btn-circle absolute right-2 top-2 z-50"
          onClick={() => {
            setShowModal(false);
          }}
        >
          ✕
        </label>
        {/* <h2 className="font-bold text-lg">HOW TO PLAY?</h2> */}
        <div className="container mx-auto flex justify-center items-end">
          <Canvas
            vlaNum={vlaNum}
            setShowExcelent={setShowExcelent}
            setShowGesture={setShowGesture}
          />
        </div>
        <div className="absolute z-50 right-0 left-0 top-1/3 flex justify-center pointer-events-none">
          {showExcelent && (
            <div className="fade-out-once text-white text-5xl font-extrabold italic text-border">
              EXCELENT
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const originalHeight = 800;
const originalWidth = 800;
const CANVAS_WIDTH = 400;
const canvasHeight = 500;
const Canvas = ({
  vlaNum,
  setShowExcelent,
  setShowGesture,
}: {
  vlaNum: number;
  setShowExcelent: Dispatch<SetStateAction<boolean>>;
  setShowGesture: Dispatch<SetStateAction<boolean>>;
}) => {
  const image = KonvaImage(`vla/vla${vlaNum}.jpg`);
  const rectRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (trRef.current && rectRef.current) {
      const initialScaleY = 0.2;
      rectRef.current!.scaleY(initialScaleY);
      rectRef.current!.y(canvasHeight - canvasHeight * initialScaleY);
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()!.batchDraw();
    } else {
      console.assert("Error");
    }
  }, []);
  return (
    <Stage width={CANVAS_WIDTH} height={canvasHeight}>
      <Layer>
        <Rect
          ref={rectRef}
          width={CANVAS_WIDTH}
          height={canvasHeight}
          fillPatternImage={image}
          fillPatternScaleY={canvasHeight / originalHeight}
          fillPatternScaleX={CANVAS_WIDTH / originalWidth}
          // stroke入れたら境目のノイズが消えた！
          stroke={`rgb(${vla_rgb[vlaNum]})`}
        />
        <Transformer
          ref={trRef}
          anchorFill={"transparent"}
          anchorStroke={"transparent"}
          anchorSize={300}
          enabledAnchors={["top-center"]}
          borderEnabled={false}
          flipEnabled={false}
          rotateEnabled={false}
          padding={-50}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.height > newBox.width) {
              // console.log(newBox.width, newBox.height);
              setShowExcelent(true);
            } else {
              setShowExcelent(false);
            }
            if (newBox.height > 150) {
              setShowGesture(false);
            } else {
              setShowGesture(true);
            }

            return newBox;
          }}
        />
        {/* <Line
          x={0}
          y={canvasHeight - CANVAS_WIDTH}
          points={[0, 0, CANVAS_WIDTH, 0]}
          stroke="yellow"
          strokeWidth={2}
        /> */}
        <Line
          x={0}
          // 画像上部に空白部分があるので+10しておく
          y={canvasHeight - CANVAS_WIDTH + 10}
          points={[0, 0, CANVAS_WIDTH, 0]}
          stroke="yellow"
          strokeWidth={10}
        />
      </Layer>
    </Stage>
  );
};
