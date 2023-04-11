import React, { useState, useEffect } from "react";
import axios from "axios";
import { useData } from "./contexts/DataContext";
import { useToast } from "./contexts/ToastContext";
import Spinner from "./Spinner";
import InventoryHistoryItem from "./InventoryHistoryItem";

const InventoryHistory = ({ mode, ...props }) => {
  const { data } = useData();
  const { setToast } = useToast();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [previousLastId, setPreviousLastId] = useState(null);
  const [loadMore, setLoadMore] = useState(false);
  const [isHistoryRecordsReady, setIsHistoryRecordsReady] = useState(false);
  const [noMoreItems, setNoMoreItems] = useState(false);

  useEffect(() => {
    let params = { mode };
    if (historyRecords.length !== 0) {
      params = { ...params, previousLastId };
    }
    axios
      .get("/api/v1/inventory/history", { params: params })
      .then((res) => {
        if (res.data.success) {
          setHistoryRecords(historyRecords.concat(res.data.historyRecords));
          setIsHistoryRecordsReady(true);
          if (res.data.historyRecords.length < 10) {
            setNoMoreItems(true);
          } else {
            setPreviousLastId(
              res.data.historyRecords[res.data.historyRecords.length - 1]._id
            );
          }
        } else {
          setToast({ message: res.data.msg, icon: "cross" });
        }
      })
      .catch((err) => {
        console.log("Error fetching inventory history records");
        console.error(err);
      });
  }, [loadMore]);

  return (
    <div
      className={`flex flex-col space-y-2 ${
        props.className && props.className
      }p-5 lg:p-6 xl:p-8`}
    >
      <div className="flex flex-col justify-between space-y-3">
        <div className="flex justify-between items-center">
          <h3>History</h3>
        </div>
        {isHistoryRecordsReady ? (
          historyRecords.length !== 0 ? (
            <div className="flex flex-col space-y-4 justify-center">
              <ul className="flex flex-col space-y-4 w-full">
                {historyRecords.map((historyRecord, i) => {
                  return (
                    <li key={i} className="w-full">
                      <InventoryHistoryItem historyRecord={historyRecord} />
                    </li>
                  );
                })}
              </ul>
              {noMoreItems ? (
                ""
              ) : (
                <div className="flex justify-center ">
                  <span
                    className="hover:underline"
                    onClick={() => setLoadMore((prev) => !prev)}
                  >
                    Load more
                  </span>
                </div>
              )}
            </div>
          ) : (
            <>No history</>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default InventoryHistory;
