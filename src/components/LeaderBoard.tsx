import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getScores, updateName, UserScore } from "../utils/firebase";
import { getUID } from "../utils/utils";

export const LeaderBoard = ({
  setShowModal,
}: {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const [userScores, setUserScores] = useState<UserScore[]>();
  const [yourScore, setYourScore] = useState<UserScore>();
  const [showEditName, setShowEditName] = useState(false);

  const [uid, setUID] = useState<string | null>();
  const [yourName, setYourName] = useState<string>();

  useEffect(() => {
    setUID(getUID());
  }, []);

  useEffect(() => {
    (async () => {
      const _userScores = await getScores();
      const sortedUserScores = [..._userScores].sort((a, b) => {
        return b.score - a.score;
      });
      setUserScores(sortedUserScores);
      const _yourScore = _userScores.find((data) => data.id === uid);
      setYourScore(_yourScore);
      setYourName(_yourScore?.name);
    })();
  }, [uid]);

  console.log(yourName);
  console.log(yourScore);

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
        {uid && (
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
                updateName(uid!, yourName!)
                  .then(async () => {
                    const _userScores = await getScores();
                    const sortedUserScores = [..._userScores].sort((a, b) => {
                      return b.score - a.score;
                    });
                    setUserScores(sortedUserScores);
                    const _yourScore = _userScores.find(
                      (data) => data.id === uid
                    );
                    setYourScore(_yourScore);
                    setYourName(_yourScore?.name);
                    setShowEditName(false);
                  })
                  .catch((error) => {
                    // TODO:
                    console.log(error);
                  });
              }}
            >
              ok
            </button>
          </div>
        )}
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
            {/* {Array(200)
              .fill(1)
              .map((x, y) => (
                <tr key={x + y} className="">
                  <th>{x + y}</th>
                  <td>hoge</td>
                  <td>1</td>
                </tr>
              ))} */}
          </tbody>
        </table>
      </div>
    </div>
  );
};
