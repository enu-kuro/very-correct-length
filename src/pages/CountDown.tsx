import { useState } from "react";
import useInterval from "../hooks/useInterval";
import { PAGE, usePage } from "../hooks/usePage";

export const CountDown = () => {
  const { setPage } = usePage();
  const [count, setCount] = useState(3);
  useInterval(() => {
    if (count === 1) {
      setPage(PAGE.GAME);
    }
    setCount((prev) => prev - 1);
  }, 1000);
  return (
    <div className="prose text-8xl font-extrabold absolute inset-0 flex items-center justify-center">
      {count}
    </div>
  );
};
