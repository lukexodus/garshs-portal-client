import * as React from "react";

export const RoleContext = React.createContext();

export function RoleProvider({ children }) {
  const role = React.useState("student");

  return (
    <RoleProvider.Provider value={value}>{children}</RoleProvider.Provider>
  );
}
