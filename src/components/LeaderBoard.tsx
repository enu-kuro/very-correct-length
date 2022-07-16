import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  getCurrentUser,
  getScores,
  refetchCurrentUser,
  updateUserName,
  UserScore,
} from "../utils/firebase";
import { PlayMode } from "../utils/utils";

export const LeaderBoard = ({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [userScoresEasy, setUserScoresEasy] = useState<UserScore[]>();
  const [userScoresHard, setUserScoresHard] = useState<UserScore[]>();
  const [showEditName, setShowEditName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [yourName, setYourName] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState(PlayMode.EASY);
  const userScores =
    selectedMode === PlayMode.HARD ? userScoresHard : userScoresEasy;
  const currentUser = getCurrentUser();
  const uid = currentUser?.uid;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refetchCurrentUser();
      const userScores = await getScores();

      console.log(userScores.data);
      setUserScoresEasy(userScores.data.easy);
      setUserScoresHard(userScores.data.hard);
      setYourName(getCurrentUser()?.displayName || "");
      setIsLoading(false);
    })();
  }, [currentUser?.displayName, uid]);

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
      >
        <label
          className="btn btn-circle absolute right-2 top-2 z-50"
          onClick={() => {
            setShowModal(false);
          }}
        >
          ✕
        </label>
        {yourName && (
          <div
            className={"prose-sm mt-10 underline"}
            onClick={() => {
              setShowEditName((prevState) => !prevState);
            }}
          >
            EDIT YOUR NAME
          </div>
        )}
        {showEditName && (
          <div className="flex flex-row">
            <input
              type="text"
              className="input input-bordered input-sm text-base w-full max-w-xs mr-2"
              value={yourName}
              onChange={(event) => setYourName(event.target.value)}
            />
            <button
              className={"btn btn-sm"}
              onClick={() => {
                if (yourName) {
                  setIsLoading(true);
                  setShowEditName(false);
                  updateUserName({ name: yourName })
                    .then(async () => {
                      return refetchCurrentUser();
                    })
                    .then(() => {
                      setIsLoading(false);
                    })
                    .catch((error) => {
                      console.log(error);
                      setIsLoading(false);
                    });
                }
              }}
            >
              ok
            </button>
          </div>
        )}
        {/* <div className="tabs">
          <span
            className={`tab tab-sm tab-lifted ${
              selectedMode === PlayMode.EASY && "tab-active"
            }`}
            onClick={() => {
              setSelectedMode(PlayMode.EASY);
            }}
          >
            EASY
          </span>
          <span
            className={`tab tab-sm tab-lifted ${
              selectedMode === PlayMode.HARD && "tab-active"
            }`}
            onClick={() => {
              setSelectedMode(PlayMode.HARD);
            }}
          >
            HARD
          </span>
        </div> */}
        <table className="table table-compact w-full -mt-0">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {userScores?.map((user, i) => {
              return (
                <tr key={user.id} className={`${uid === user.id && "active"}`}>
                  <th>{i + 1}</th>
                  <td>{user.name}</td>
                  <td>{user.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && (
          <div className="translate-x-2/4 absolute z-50 top-2/3 right-1/2">
            <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
};
