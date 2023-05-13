import React, { lazy, Suspense } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Outlet,
} from "react-router-dom";
import axios from "axios";
import { isLoggedIn, isLoggedOut, logout } from "./services/auth";
import { API_URL } from "./config/config";
import Auth from "./components/Auth";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import RequireAdmins from "./components/RequireAdmins";
import RequireSuperadmin from "./components/RequireSuperadmin";
import Layout from "./components/Layout";
import LayoutMax from "./components/LayoutMax";
import LayoutFixed from "./components/LayoutFixed";
import Dashboard from "./components/Dashboard";
import ModalsSpace from "./components/ModalsSpace";
import Loading from "./components/Loading";
import PageFallback1 from "./components/PageFallback1";
import User from "./components/User";
import UserAttendance from "./components/UserAttendance";

const LRN = lazy(() => import("./components/LRN"));
const Requests = lazy(() => import("./components/Requests"));
const Home = lazy(() => import("./components/Home"));
const SubjectClass = lazy(() => import("./components/SubjectClass"));
const ManageSubjects = lazy(() => import("./components/ManageSubjects"));
const ManageSections = lazy(() => import("./components/ManageSections"));
const ManageUsers = lazy(() => import("./components/ManageUsers"));
const Inventory = lazy(() => import("./components/Inventory"));
const Sections = lazy(() => import("./components/Sections"));
const Attendance = lazy(() => import("./components/Attendance"));
const ReportCard = lazy(() => import("./components/ReportCard"));
const Profile = lazy(() => import("./components/Profile"));
const Main = lazy(() => import("./components/Main"));
const About = lazy(() => import("./components/About"));
const Contact = lazy(() => import("./components/Contact"));
const PasswordReset = lazy(() => import("./components/PasswordReset"));
const LayoutPlain = lazy(() => import("./components/LayoutPlain"));

axios.defaults.baseURL = API_URL;

axios.interceptors.request.use((req) => {
  if (isLoggedOut()) {
    logout();
  }
  const idToken = localStorage.getItem("token");
  if (isLoggedIn()) {
    req.headers["Authorization"] = idToken;
    return req;
  } else {
    return req;
  }
});

axios.interceptors.response.use(
  (res) => {
    if (isLoggedIn()) {
      if (res.data.logoutRequired && res.data.logoutRequired === true) {
        logout();
        localStorage.setItem(
          "authMessage",
          "Data synchronization required. Please relogin."
        );
        window.location.href = "/auth";
      } else {
        localStorage.removeItem("authMessage");
      }
    }
    return res;
  },
  (error) => {
    if (error.response.status === 404) {
      console.log("Error: Resource not found");
    } else if (error.response.status === 500) {
      console.log("Error: Internal server error");
    }

    return Promise.reject(error);
  }
);

document.title = "GARSHS | Quality is our Mandate";

const App = () => {
  return (
    <>
      <Router>
        <ModalsSpace>
          <Routes>
            <Route
              path="/auth"
              element={
                <LayoutFixed>
                  <Suspense fallback={<Loading />}>
                    <Auth />
                  </Suspense>
                </LayoutFixed>
              }
            />

            <Route
              path="/user/reset-password"
              element={
                <Suspense fallback={<Loading />}>
                  <LayoutPlain>
                    <PasswordReset />
                  </LayoutPlain>
                </Suspense>
              }
            />

            <Route
              path="/about"
              element={
                <Layout>
                  <Suspense fallback={<Loading />}>
                    <About />
                  </Suspense>
                </Layout>
              }
            />

            <Route
              path="/contact"
              element={
                <Layout>
                  <Suspense fallback={<Loading />}>
                    <Contact />
                  </Suspense>
                </Layout>
              }
            />

            <Route
              path="/"
              element={
                <LayoutMax>
                  <Suspense
                    fallback={
                      <div className="w-screen flex justify-center pt-40">
                        <Loading bgBehindColor="white" />
                      </div>
                    }
                  >
                    <Home />
                  </Suspense>
                </LayoutMax>
              }
            />

            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            >
              <Route
                index
                element={
                  <Layout>
                    <Suspense fallback={<PageFallback1 />}>
                      <Main />
                    </Suspense>
                  </Layout>
                }
              />

              <Route path="user/:_id" element={<Layout>{<User />}</Layout>} />

              <Route
                path="attendance/user/:_id"
                element={<Layout>{<UserAttendance />}</Layout>}
              />

              <Route
                path="sections"
                element={
                  <LayoutMax bgColor="bg-indigo-600">
                    <Suspense
                      fallback={
                        <div className="w-auto h-auto flex items-start justify-center pt-10">
                          <Loading />
                        </div>
                      }
                    >
                      <Sections />
                    </Suspense>
                  </LayoutMax>
                }
              />
              <Route
                path="inventory"
                element={
                  <Layout>
                    <Suspense fallback={<Loading />}>
                      <Inventory />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="attendance"
                element={
                  <LayoutMax bgColor="bg-indigo-600">
                    <Suspense
                      fallback={
                        <div className="w-auto h-auto flex items-start justify-center pt-10">
                          <Loading />
                        </div>
                      }
                    >
                      <Attendance />
                    </Suspense>
                  </LayoutMax>
                }
              />
              <Route
                path="report-card/:section/:_id"
                element={
                  <Layout>
                    <Suspense fallback={<Loading />}>
                      <ReportCard />
                    </Suspense>
                  </Layout>
                }
              />
              <Route
                path="profile"
                element={
                  <Layout>
                    <Suspense fallback={<Loading />}>
                      <Profile />
                    </Suspense>
                  </Layout>
                }
              />

              <Route
                path="admin"
                element={
                  <Layout>
                    <Suspense fallback={<Loading />}>
                      <RequireAdmins>
                        <Outlet />
                      </RequireAdmins>
                    </Suspense>
                  </Layout>
                }
              >
                <Route path="lrn" element={<LRN />} />
                <Route path="requests" element={<Requests />} />
              </Route>

              <Route
                path="superadmin"
                element={
                  <Layout>
                    <Suspense fallback={<Loading />}>
                      <RequireSuperadmin>
                        <Outlet />
                      </RequireSuperadmin>
                    </Suspense>
                  </Layout>
                }
              >
                <Route path="sections" element={<ManageSections />} />
                <Route path="subjects" element={<ManageSubjects />} />
                <Route path="users" element={<ManageUsers />} />
              </Route>

              <Route
                path=":section/:subject"
                element={
                  <Layout>
                    <Suspense fallback={<PageFallback1 />}>
                      <SubjectClass />
                    </Suspense>
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </ModalsSpace>
      </Router>
    </>
  );
};

export default App;
