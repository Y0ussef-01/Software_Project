import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✨ استدعاء مكتبة فك التشفير

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // ✨ 1. نحن نقرأ التوكن فقط من المتصفح
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        // ✨ 2. فك تشفير التوكن لمعرفة البيانات الحقيقية
        const decodedPayload = jwtDecode(storedToken);

        // ✨ 3. حماية إضافية: التأكد من أن التوكن لم تنتهِ صلاحيته (exp = expiration time)
        const currentTime = Date.now() / 1000;
        if (decodedPayload.exp && decodedPayload.exp < currentTime) {
          throw new Error("Token Expired");
        }

        setToken(storedToken);
        // ✨ 4. نسحب الـ Role والـ User من داخل التوكن نفسه (مستحيل تزويره)
        setRole(decodedPayload.role);

        // إذا كان الباك إند يرسل بيانات اليوزر داخل التوكن، خذها منه،
        // أو يمكنك تركها فارغة وجلبها بـ API منفصل لاحقاً
        setUser(
          decodedPayload.user || {
            id: decodedPayload.id,
            name: decodedPayload.name,
          },
        );
      } catch (error) {
        // لو المستخدم لعب في التوكن وحاول يزوره، فك التشفير هيفشل ونطرده
        console.error("Invalid or expired token detected.");
        logout();
      }
    }
    setIsAuthLoading(false);
  }, []);

  // دالة تسجيل الدخول المحدثة
  const login = (userData, userToken, userRole) => {
    setUser(userData);
    setToken(userToken);
    setRole(userRole);

    // ✨ 5. التخزين الآمن: نخزن التوكن فقط! لا داعي لتخزين الـ role والـ user هنا بعد الآن
    localStorage.setItem("token", userToken);
  };

  // دالة تسجيل الخروج المحدثة
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);

    // ✨ 6. تنظيف التوكن فقط
    localStorage.removeItem("token");
    // (حتى لو كان هناك user و role قدامى في المتصفح من كودك القديم، امسحهم للتنظيف)
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ user, role, token, login, logout, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => useContext(AuthContext);
