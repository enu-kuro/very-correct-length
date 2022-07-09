import { createContext, useState, useContext, Dispatch, FC } from "react";

export const enum PAGE {
  TOP,
  COUNT_DOWN,
  GAME,
  RESULT,
}
interface PageContextValueType {
  page: PAGE;
  setPage: Dispatch<React.SetStateAction<PAGE>>;
}

const PageContext = createContext({} as PageContextValueType);

export const PageProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState<PAGE>(PAGE.TOP);

  const contextValue = {
    page,
    setPage,
  };
  return (
    <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};

export const usePage = (): PageContextValueType => {
  const { page, setPage } = useContext(PageContext);
  return {
    page,
    setPage,
  };
};
