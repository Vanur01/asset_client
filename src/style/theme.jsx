import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0d3d52" },
    background: { default: "#f5f6f8", paper: "#ffffff" },
    text: { primary: "#111827", secondary: "#6b7280" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    body2: { fontSize: "0.82rem" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 4px rgba(0,0,0,.06)",
          border: "1.5px solid #e9eaec",
          borderRadius: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10, background: "#fff", fontSize: "0.82rem" },
        notchedOutline: { borderColor: "#e5e7eb" },
      },
    },
  },
});
