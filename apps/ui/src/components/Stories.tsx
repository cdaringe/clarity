import React from "react";

export const StoriesContainer: React.FC<{
  children: {
    el: React.FC<unknown>;
    name: string;
  }[];
}> = ({ children }) => {
  return (
    <>
      {children.map(({ name, el: El }, i) => {
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  margin: "2rem 0 1rem 0",
                }}
              >
                <hr />
              </div>
            ) : null}
            <h2>{name}</h2>
            <El />
          </React.Fragment>
        );
      })}
    </>
  );
};
