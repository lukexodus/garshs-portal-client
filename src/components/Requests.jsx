import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "./contexts/ToastContext";
import { useData } from "./contexts/DataContext";
import ContentFallbackCards1 from "./ContentFallbackCards1";
import UserCard from "./UserCard";

import { usePopupModal } from "./contexts/PopupModalContext";

const Requests = () => {
  document.title = `Account Requests`;
  const [accountRequests, setAccountRequests] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isLocalDataReady, setIsLocalDataReady] = useState(false);
  const [thereAreRequests, setThereAreRequests] = useState(true);

  const { setToast } = useToast();
  const { setPopupModal } = usePopupModal();
  const { data } = useData();

  useEffect(() => {
    if (data) {
      setIsLocalDataReady(true);
    }
  }, [data]);

  useEffect(() => {
    axios
      .get("/api/v1/users/requests")
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setAccountRequests(res.data.accounts);
          setIsDataReady(true);
        } else {
          if (res.data.count === 0) {
            setThereAreRequests(false);
            setIsDataReady(true);
          } else {
            setToast({ message: res.data.msg, icon: "cross" });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const approveRequest = (user) => {
    setPopupModal({
      message: `Are you sure you want to approve ${user.firstName}'s request? Upon approval, the user will have access to some school records and the ability to change them.`,
      handler: () => {
        const params = {
          _id: user._id,
          role: user.role,
          nonTeaching: user.nonTeaching,
        };
        if (user.role === "admin" && !user.nonTeaching) {
          const subjects = [];
          const subjectClasses = user.subjectClasses;
          const sections = Object.keys(subjectClasses);
          for (const section of sections) {
            subjectClasses[section].forEach((subject) => {
              if (!subjects.includes(subject)) {
                subjects.push(subject);
              }
            });
          }
          params.subjects = subjects;
        }
        axios
          .patch("/api/v1/users/requests", params, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            if (res.data.success) {
              setToast({
                message: res.data.msg,
                icon: "check",
                lifetime: 10000,
              });
              setAccountRequests((prevState) => {
                const updatedRequests = prevState.filter(
                  (request) => request._id !== user._id
                );
                return updatedRequests;
              });
            } else {
              setToast({ message: res.data.msg, icon: "cross" });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
    });
  };

  const rejectRequest = (user) => {
    setPopupModal({
      message: `Are you sure you want to delete ${user.firstName}'s request?`,
      handler: () => {
        axios
          .delete(`/api/v1/users/requests/${user._id}`)
          .then((res) => {
            if (res.data.success) {
              setToast({
                message: res.data.msg,
                icon: "check",
                lifetime: 10000,
              });
              setAccountRequests((prevState) => {
                const updatedRequests = prevState.filter(
                  (request) => request._id !== user._id
                );
                return updatedRequests;
              });
            } else {
              setToast({ message: res.data.msg, icon: "cross" });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      },
    });
  };

  return (
    <>
      {isDataReady && isLocalDataReady ? (
        <>
          <h2 className="mb-5">Account Requests</h2>
          <ul className="flex flex-row flex-wrap max-w-full">
            {accountRequests
              .sort((a, b) => a.role.localeCompare(b.role))
              .map((account, i) => (
                <li key={i} className="w-[21rem] mr-5 mb-5">
                  <UserCard
                    account={account}
                    map={data.map}
                    action="approve"
                    primaryHandler={approveRequest}
                    secondaryHandler={rejectRequest}
                  />
                </li>
              ))}
            {!thereAreRequests ? <p>No pending account requests.</p> : ""}
          </ul>
        </>
      ) : (
        <>
          <div className="animate-pulse">
            <div className="ml-5 w-64 h-12 bg-indigo-500 rounded-xl"></div>
            <div className="py-3"></div>
          </div>
          <ContentFallbackCards1 />
        </>
      )}
    </>
  );
};

export default Requests;
