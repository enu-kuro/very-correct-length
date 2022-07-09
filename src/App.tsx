import { AssertionError } from "assert";
import React, { useEffect, useState } from "react";
import "./App.css";
import { PAGE, PageProvider, usePage } from "./hooks/usePage";
import { useWindowSize } from "./hooks/useWindowSize";
import { CountDown } from "./pages/CountDown";

import { Game } from "./pages/Game";
import { Result } from "./pages/Result";
import { Top } from "./pages/Top";

const Page = () => {
  const [gradeHistory, setGradeHistory] = useState<number[]>([]);
  const windowSize = useWindowSize();
  const { page } = usePage();
  if (page === PAGE.COUNT_DOWN) {
    return <CountDown />;
  } else if (page === PAGE.TOP) {
    return <Top />;
  } else if (page === PAGE.GAME) {
    if (!windowSize) {
      return <div>Error!</div>;
    } else {
      return (
        <Game
          windowHeight={windowSize.height}
          setGradeHistory={setGradeHistory}
        />
      );
    }
  } else if (page === PAGE.RESULT) {
    return <Result gradeHistory={gradeHistory} />;
  } else {
    return <div>Error!</div>;
  }
};
function App() {
  return <PageProvider>{<Page />}</PageProvider>;
}

export default App;
