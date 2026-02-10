import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PurchasedCourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  progress: number;
  status: "active" | "completed";
  purchasedAt: string;
  accessUntil: string;
  totalModules: number;
  completedModules: number;
  image?: string;
  instructor: string;
}

interface DummyUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
}

interface CustomerAuthContextType {
  user: DummyUser | null;
  isAuthenticated: boolean;
  purchasedCourses: PurchasedCourse[];
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  addPurchasedCourse: (course: Omit<PurchasedCourse, "purchasedAt" | "accessUntil" | "progress" | "status" | "completedModules">) => void;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

// Dummy initial purchased courses
const initialPurchasedCourses: PurchasedCourse[] = [
  {
    id: 1,
    title: "Dasar-Dasar Pengelolaan Sampah",
    description: "Pengenalan komprehensif tentang prinsip pengelolaan sampah",
    duration: "4 minggu",
    level: "Pemula",
    price: "Rp 1.500.000",
    progress: 75,
    status: "active",
    purchasedAt: "2024-01-01",
    accessUntil: "2025-01-01",
    totalModules: 4,
    completedModules: 3,
    instructor: "Dr. Ahmad Sustani",
  },
  {
    id: 6,
    title: "Workshop Daur Ulang Komunitas",
    description: "Pelajari cara mengorganisir program daur ulang di komunitas",
    duration: "2 minggu",
    level: "Pemula",
    price: "Rp 750.000",
    progress: 100,
    status: "completed",
    purchasedAt: "2023-12-01",
    accessUntil: "2024-12-01",
    totalModules: 4,
    completedModules: 4,
    instructor: "Kak Community",
  },
];

// Dummy user for simulation
const DUMMY_USER: DummyUser = {
  id: "user-001",
  email: "learner@resikplus.com",
  name: "Budi Learner",
  phone: "081234567890",
};

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DummyUser | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("resikplus_customer");
    const savedCourses = localStorage.getItem("resikplus_courses");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPurchasedCourses(savedCourses ? JSON.parse(savedCourses) : initialPurchasedCourses);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate login - accept any email/password for demo
    if (email && password) {
      const loggedInUser = { ...DUMMY_USER, email, name: email.split("@")[0] };
      setUser(loggedInUser);
      setPurchasedCourses(initialPurchasedCourses);
      localStorage.setItem("resikplus_customer", JSON.stringify(loggedInUser));
      localStorage.setItem("resikplus_courses", JSON.stringify(initialPurchasedCourses));
      return { success: true };
    }
    return { success: false, error: "Email dan password tidak boleh kosong" };
  };

  const logout = () => {
    setUser(null);
    setPurchasedCourses([]);
    localStorage.removeItem("resikplus_customer");
    localStorage.removeItem("resikplus_courses");
  };

  const addPurchasedCourse = (course: Omit<PurchasedCourse, "purchasedAt" | "accessUntil" | "progress" | "status" | "completedModules">) => {
    const newCourse: PurchasedCourse = {
      ...course,
      purchasedAt: new Date().toISOString().split("T")[0],
      accessUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      progress: 0,
      status: "active",
      completedModules: 0,
    };
    
    const updatedCourses = [...purchasedCourses, newCourse];
    setPurchasedCourses(updatedCourses);
    localStorage.setItem("resikplus_courses", JSON.stringify(updatedCourses));
  };

  return (
    <CustomerAuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      purchasedCourses,
      login, 
      logout,
      addPurchasedCourse,
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (context === undefined) {
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  }
  return context;
};
