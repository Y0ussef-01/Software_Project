import React from "react";
import { Admin, Layout, Resource } from "react-admin";
import SideBar from "../../../components/AdminComp/SideBar";
import {
  dataProvider,
  authProvider,
} from "../../../components/AdminComp/adminProviders";
const Dashboard = () => {
  return (
    <div>
      <Admin
        basename="/adminPanel"
        dataProvider={dataProvider}
        authProvider={authProvider}
      >
        <Resource
          name="dummy"
          list={() => <div>Admin Dashboard: Users Control</div>}
        />
      </Admin>
    </div>
  );
};
export default Dashboard;
