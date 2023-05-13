import React, { useState, useEffect } from "react";
import { useToast } from "./contexts/ToastContext";
import { usePopupModal } from "./contexts/PopupModalContext";
import ButtonGroup from "./ButtonGroup";
import ContentFallbackCards1 from "./ContentFallbackCards1";
import { useData } from "./contexts/DataContext";
import axios from "axios";
import UserCard from "./UserCard";
import Table from "./Table";
import Button from "./Button";

let usersToBeDeletedDocs = [];

const categories = [
  {
    name: "Admins",
    value: "admin",
  },
  // {
  //     name: "Parents",
  //     value: "parent",
  // },
  {
    name: "Students",
    value: "student",
  },
];

const ManageUsers = () => {
  const { setToast } = useToast();
  const { setPopupModal } = usePopupModal();
  const { data } = useData();
  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [isAdminUsersReady, setIsAdminUsersReady] = useState(false);
  const [isParentUsersReady, setIsParentUsersReady] = useState(false);
  const [isStudentUsersReady, setIsStudentUsersReady] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const [category, setCategory] = useState("admin");
  const [adminUsers, setAdminUsers] = useState([]);
  const [parentUsers, setParentUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const [studentsRows, setStudentsRows] = useState([]);
  const [usersToBeDeletedLength, setUsersToBeDeletedLength] = useState(0);

  const selectHandler = (event, userObject) => {
    if (event.target.checked) {
      usersToBeDeletedDocs.push(userObject);
    } else {
      usersToBeDeletedDocs.splice(usersToBeDeletedDocs.indexOf(userObject), 1);
    }
    setUsersToBeDeletedLength(usersToBeDeletedDocs.length);
    setShouldRender(!shouldRender);
  };

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  useEffect(() => {
    setUsersToBeDeletedLength(0);
    usersToBeDeletedDocs = [];
    setToast(null);
    axios
      .get("/api/v1/users/users", {
        params: {
          category,
        },
      })
      .then((res) => {
        if (res.data.success) {
          if (category === "admin") {
            setAdminUsers(res.data.users);
            setIsAdminUsersReady(true);
          } else if (category === "parent") {
            setParentUsers(res.data.users);
            setIsParentUsersReady(true);
          } else if (category === "student") {
            const usersList = res.data.users;
            const studentsList = usersList.map((user) => [
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                onClick={(event) => selectHandler(event, user)}
              />,
              `${user.firstName} ${user.lastName}`,
              user.email,
              data.map.sections.find(
                (section) => section.value === user.section
              ).name,
              user.lrn,
            ]);
            setStudentUsers(usersList);
            setStudentsRows(studentsList);
            setIsStudentUsersReady(true);
          }
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [category]);

  const deleteUserHandler = (usersDocs) => {
    const ids = usersDocs.map((userObject) => userObject._id);
    let users = [];
    if (category === "admin") {
      users = adminUsers;
    } else if (category === "parent") {
      users = parentUsers;
    } else if (category === "student") {
      users = studentUsers;
    }
    const usersToBeDeleted = users.filter((user) => ids.includes(user._id));
    const usersToBeDeletedStrings = usersToBeDeleted.map(
      (user) => `${user.firstName} ${user.lastName}`
    );
    setPopupModal({
      message: `Are you sure you want to delete these users: ${usersToBeDeletedStrings.join(
        ", "
      )}?`,
      variant: "danger",
      handler: () => {
        const params = { category };

        if (category === "student") {
          const sectionsTabulation = {};
          for (let userDoc of usersDocs) {
            if (typeof sectionsTabulation[userDoc.section] === "undefined") {
              sectionsTabulation[userDoc.section] = [userDoc._id];
            } else {
              sectionsTabulation[userDoc.section].push(userDoc._id);
            }
          }
          params.sectionsTabulation = JSON.stringify(sectionsTabulation);
          params.ids = JSON.stringify(ids);
        } else if (category === "admin") {
          const sectionsTabulation = {};
          const subjects = [];
          let someAreAdvisers = false;
          for (let userDoc of usersDocs) {
            if (!userDoc.nonTeaching) {
              if (userDoc.adviseeSection) {
                someAreAdvisers = true;
              }
            }
            if (userDoc.subjectClasses) {
              for (const section of Object.keys(userDoc.subjectClasses)) {
                for (const subject of userDoc.subjectClasses[section]) {
                  if (!subjects.includes(subject)) {
                    subjects.push(subject);
                  }
                  if (typeof sectionsTabulation[section] === "undefined") {
                    sectionsTabulation[section] = [subject];
                  } else {
                    if (!sectionsTabulation[section].includes(subject)) {
                      sectionsTabulation[section].push(subject);
                    }
                  }
                }
              }
            }
          }

          params.sectionsTabulation = JSON.stringify(sectionsTabulation);
          params.someAreAdvisers = JSON.stringify(someAreAdvisers);
          params.subjects = JSON.stringify(subjects);
          params.usersDocs = JSON.stringify(
            usersDocs.map((userDoc) => {
              delete userDoc.firstName;
              delete userDoc.lastName;
              delete userDoc.email;
              return userDoc;
            })
          );
        }

        axios
          .delete("/api/v1/users/users", {
            params,
          })
          .then((res) => {
            if (res.data.success) {
              setToast({
                message: res.data.msg,
                icon: "check",
                lifetime: 10000,
              });
              if (category === "admin") {
                setAdminUsers((prevState) => {
                  const updatedUsersList = prevState.filter((user) =>
                    ids.find((id) => id !== user._id)
                  );
                  return updatedUsersList;
                });
              } else if (category === "parent") {
                setParentUsers();
              } else if (category === "student") {
                const LRNs = ids.map(
                  (id) => studentUsers.find((user) => user._id === id).lrn
                );
                const studentsRowsCopy = studentsRows;
                let updatedUsersList = studentUsers.filter(
                  (user) => !LRNs.includes(user.lrn)
                );
                for (const LRN of LRNs) {
                  studentsRowsCopy.splice(
                    studentsRowsCopy.indexOf(
                      studentsRowsCopy.find((row) =>
                        LRNs.includes(parseInt(row[3]))
                      )
                    ),
                    1
                  );
                }
                setStudentsRows(studentsRowsCopy);
                setStudentUsers(updatedUsersList);
              }
            } else {
              setToast({ message: res.data.msg, icon: "cross" });
            }
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setUsersToBeDeletedLength(0);
            usersToBeDeletedDocs = [];
          });
      },
    });
  };

  return (
    <>
      {isLocalDataReady ? (
        <div>
          <h1 className="mb-9">Manage Users</h1>
          <div className={`flex justify-between items-center`}>
            <ButtonGroup
              options={categories}
              stateHandler={setCategory}
              state={category}
            />
            <Button
              className={`${category !== "admin" ? "block" : "hidden"}`}
              variant="danger"
              size="small"
              type="button"
              onClick={() => {
                deleteUserHandler(usersToBeDeletedDocs);
              }}
              disabled={usersToBeDeletedLength === 0}
              shouldRender={shouldRender}
            >
              Delete Selected Users
            </Button>
          </div>
          <div className="py-3"></div>
          {category === "admin" ? (
            isAdminUsersReady ? (
              <>
                <ul className="flex flex-row flex-wrap max-w-full">
                  {adminUsers.map((user, i) => (
                    <li key={i} className="w-[21rem] mr-5 mb-5">
                      <UserCard
                        account={user}
                        map={data.map}
                        action="remove"
                        primaryHandler={() => {
                          deleteUserHandler([user]);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <ContentFallbackCards1 />
            )
          ) : (
            ""
          )}
          {category === "parent" ? (
            isParentUsersReady ? (
              <>
                <p>parent</p>
              </>
            ) : (
              <ContentFallbackCards1 />
            )
          ) : (
            ""
          )}
          {category === "student" ? (
            isStudentUsersReady ? (
              <>
                {studentsRows.length === 0 ? (
                  <p>No student users found.</p>
                ) : (
                  <Table
                    headersList={["Select", "Name", "Email", "Section", "LRN"]}
                    itemsList={studentsRows}
                  />
                )}
              </>
            ) : (
              <ContentFallbackCards1 />
            )
          ) : (
            ""
          )}
        </div>
      ) : (
        <>
          <div className="animate-pulse">
            <div className="ml-5 w-72 h-12 bg-indigo-500 rounded-xl"></div>
            <div className="py-4"></div>
            <div className="ml-5 w-60 h-11 bg-indigo-500 rounded-xl"></div>
            <div className="py-3"></div>
          </div>
          <ContentFallbackCards1 />
        </>
      )}
    </>
  );
};

export default ManageUsers;
