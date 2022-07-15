import { useState } from "react";
import { LockIcon } from "../components/LockIcon";
import { Tutorial } from "../components/Tutorial";
import { PAGE, usePage } from "../hooks/usePage";
import { isTablet, isMobile } from "react-device-detect";
import { QRCode } from "../components/QRCode";
import { loginGuest } from "../utils/firebase";
import { LeaderBoard } from "../components/LeaderBoard";
import { ChartSquareBarIcon } from "@heroicons/react/solid";

if (isTablet || isMobile) {
  loginGuest();
}
export const Top = () => {
  const { setPage } = usePage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLearderBoard, setShowLearderBoard] = useState(false);

  return (
    <>
      {!isTablet && !isMobile && (
        <QRCode url={"https://verycorrectlength.com/"} />
      )}
      {showTutorial && (
        <Tutorial
          setShowModal={setShowTutorial}
          vlaNum={Math.floor(Math.random() * 92)}
        />
      )}
      {showLearderBoard && <LeaderBoard setShowModal={setShowLearderBoard} />}
      <div className="p-5 prose prose-slate container mx-auto flex flex-col items-center justify-between h-[600px]">
        <h1 className="w-64 mt-10">VERY CORRECT LENGTH (β)</h1>
        <div className="flex flex-col">
          <button
            onClick={() => {
              window.history.replaceState(null, "", "/");
              setPage(PAGE.COUNT_DOWN);
            }}
            className={"btn btn-wide"}
          >
            Very easy mode
          </button>

          {/* <button disabled className={"btn btn-wide gap-2 mt-10"}> */}
          <button
            className={"btn btn-wide mt-10"}
            onClick={() => {
              window.history.replaceState(null, "", "/#hard");
              console.log(window.location.hash);
              setPage(PAGE.COUNT_DOWN);
            }}
          >
            Very hard mode
            {/* <LockIcon className="w-5 h-5" /> */}
          </button>
          <div
            className={"prose-sm mt-2 text-center underline"}
            onClick={() => {
              setShowTutorial(true);
            }}
          >
            HOW TO PLAY?
          </div>
          <div className="mt-5 text-center">
            <button
              className={"btn btn-sm btn-accent"}
              onClick={() => {
                setShowLearderBoard(true);
              }}
            >
              Leader Board
              <ChartSquareBarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
