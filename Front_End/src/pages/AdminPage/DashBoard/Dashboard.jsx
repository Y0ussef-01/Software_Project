import React from "react";
import { Admin, Resource } from "react-admin";
import {
  dataProvider,
  authProvider,
} from "../../../components/AdminComp/adminProviders";

// ✨ 1. استدعاء الـ Layout المخصص الخاص بك بالكامل
import MyLayout from "../../../components/AdminComp/Layout";

// ✨ (اختياري) استدعاء صفحة الإحصائيات التي تظهر أول ما تفتح الأدمن

const Dashboard = () => {
  return (
    <Admin
      basename="/adminPanel"
      dataProvider={dataProvider}
      authProvider={authProvider}
      // ✨ 2. تمرير الهيكل الخارجي الخاص بك (Header + Sidebar)
      layout={MyLayout}
      // ✨ 3. تمرير محتوى الصفحة الرئيسية للإدارة (الإحصائيات)
    >
      {/* مسارات الجداول الخاصة بك */}
      <Resource
        name="dummy"
        list={() => <div>Admin Dashboard: Users Control</div>}
      />
    </Admin>
  );
};

export default Dashboard;
