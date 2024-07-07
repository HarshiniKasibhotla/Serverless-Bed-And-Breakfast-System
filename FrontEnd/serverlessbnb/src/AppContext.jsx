import { createContext, useReducer } from "react";

export const AppContext = createContext(null);
export const AppDispatchContext = createContext(null);

export function AppProvider({ children }) {
  const [tasks, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={tasks}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

function appReducer(currentState, action) {
  switch (action.type) {
    case "userAdded": {
      localStorage.setItem("user", JSON.stringify(action.user));
      return { ...currentState, user: action.user };
    }

    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialState = { user: JSON.parse(localStorage.getItem("user")) || {} };
