import { useState } from "react";
import { LockIcon } from "../components/LockIcon";
import { Tutorial } from "../components/Tutorial";
import { PAGE, usePage } from "../hooks/usePage";
import { isTablet, isMobile, isIOS } from "react-device-detect";
import { QRCode } from "../components/QRCode";
import { loginGuest } from "../utils/firebase";
import { LeaderBoard } from "../components/LeaderBoard";
import { ChartSquareBarIcon } from "@heroicons/react/solid";
import { clickSound, setSound } from "../utils/utils";
import { VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/solid";

if (isTablet || isMobile) {
  loginGuest();
}

export const Top = () => {
  const { setPage } = usePage();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLearderBoard, setShowLearderBoard] = useState(false);
  const [isSound, setIsSound] = useState(false);

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
        {/* <div
          className="opacity-0 absolute top-0 right-0"
          onClick={() => {
            clickSound?.play();
            window.history.replaceState(null, "", "/#hard");
            setPage(PAGE.COUNT_DOWN);
          }}
        >
          VERY HARD MODE
        </div> */}
        <h1 className="w-64 mt-10">VERY CORRECT LENGTH (β)</h1>

        <div className="flex flex-col">
          <button
            onClick={() => {
              clickSound?.play();
              window.history.replaceState(null, "", "/");
              setPage(PAGE.COUNT_DOWN);
            }}
            className={"btn btn-wide"}
          >
            Very easy mode
          </button>
          {/* <button disabled className={"btn btn-wide gap-2 mt-10"}> */}
          <button
            className={"btn btn-wide mt-10  btn-primary"}
            onClick={() => {
              clickSound?.play();
              window.history.replaceState(null, "", "/#hard");
              setPage(PAGE.COUNT_DOWN);
            }}
          >
            Very hard mode
            {/* <LockIcon className="w-5 h-5" /> */}
          </button>
          <div
            className={"prose-sm mt-2 text-center underline"}
            onClick={() => {
              clickSound?.play();
              setShowTutorial(true);
            }}
          >
            HOW TO PLAY?
          </div>
          <div className="mt-5 text-center mb-10">
            <button
              className={"btn btn-sm btn-accent"}
              onClick={() => {
                clickSound?.play();
                setShowLearderBoard(true);
              }}
            >
              Leader Board
              <ChartSquareBarIcon className="w-5 h-5" />
            </button>
          </div>
          {!isIOS && (
            <div className="flex absolute bottom-5 left-5">
              {isSound ? (
                <VolumeUpIcon
                  className="w-7 h-7"
                  onClick={() => {
                    // clickSound?.play();
                    setSound(false);
                    setIsSound(false);
                  }}
                />
              ) : (
                <VolumeOffIcon
                  className="w-7 h-7"
                  onClick={() => {
                    setSound(true);
                    clickSound?.play();
                    setIsSound(true);
                  }}
                />
              )}
              <a
                href="http://www.kurage-kosho.info/"
                className="ml-3 text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                フリー効果音素材 くらげ工匠
              </a>
              <a
                href="https://twitter.com/__B_E_N_A__"
                className="ml-3 text-xs"
                target="_blank"
                rel="noopener noreferrer"
              >
                BGM: @__B_E_N_A__
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
