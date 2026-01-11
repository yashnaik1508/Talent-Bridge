import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);
    const { userId } = useAuth();

    // Determine the storage key based on user ID
    const themeKey = userId ? `theme_${userId}` : "theme";

    useEffect(() => {
        // Check localStorage or system preference
        const savedTheme = localStorage.getItem(themeKey);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, [themeKey]); // Re-run when userId changes

    const toggleTheme = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add("dark");
                localStorage.setItem(themeKey, "dark");
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem(themeKey, "light");
            }
            return newMode;
        });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
