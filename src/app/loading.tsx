import CircularProgress from "@mui/material/CircularProgress";

export default function loading() {
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <CircularProgress
        color="success"
        sx={{
          filter: "drop-shadow(0 0 10px rgba(0,255,0,0.5))",
          color: "green",
          "&.MuiCircularProgress-root": {
            animationDuration: "0.7s",
          },
        }}
        value={70}
        size={90}
      />
    </div>
  );
}
