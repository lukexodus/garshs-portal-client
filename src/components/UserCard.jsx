import React, { useEffect } from "react";
import Button from "./Button";

const UserCard = ({
  account,
  map,
  action,
  primaryHandler,
  secondaryHandler,
}) => {
  return (
    <div className="bg-indigo-500 rounded-xl p-5 flex flex-col justify-between shadow-md h-full">
      <div className="flex flex-col space-y-1">
        <span className="flex flex-row items-center justify-between space-x-10 mb-2">
          <span className="uppercase bg-indigo-400 px-2 py-1 rounded-md text-xs">
            {account.role}
          </span>
          {!account.role === "admin" ? (
            ""
          ) : account.nonTeaching ? (
            <small>Non-teaching staff</small>
          ) : (
            <small>Teaching staff</small>
          )}
        </span>

        <span>
          <b>Name</b>: {account.firstName} {account.lastName}
        </span>
        <br />

        <span>
          <b>E-mail</b>: {account.email}
        </span>
        <br />

        {!account.role === "admin" ? (
          ""
        ) : account.nonTeaching ? (
          ""
        ) : account.adviseeSection ? (
          <span>
            <b>Advisee Section</b>:{" "}
            {
              map.sections.find((doc) => doc.value === account.adviseeSection)
                .name
            }
          </span>
        ) : (
          <span className="font-semibold">No Advisee Section</span>
        )}
        <br />

        {!account.nonTeaching ? (
          <>
            <b>Subject Classes:</b>
            <span>
              <ul>
                {Object.keys(account.subjectClasses).map((section, j) => (
                  <li key={j} className="p-1">
                    {map.sections.find((doc) => doc.value === section).name}
                    <ul>
                      {account.subjectClasses[section].map((subject, k) => (
                        <li key={k} className="text-sm mr-4 inline-block">
                          {
                            map.subjects.find((doc) => doc.value === subject)
                              .name
                          }
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </span>
          </>
        ) : (
          ""
        )}
      </div>

      <span className="mt-5">
        {action === "approve" ? (
          <>
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={() => primaryHandler(account)}
            >
              Approve
            </Button>
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={() => secondaryHandler(account)}
            >
              Reject
            </Button>
          </div>
          </>
        ) : action === "remove" ? (
          <>
            <Button
              variant="danger"
              size="small"
              type="button"
              onClick={() => primaryHandler()}
            >
              Remove User
            </Button>
          </>
        ) : (
          ""
        )}
      </span>
    </div>
  );
};

export default UserCard;
