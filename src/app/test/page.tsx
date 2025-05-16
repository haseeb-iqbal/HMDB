import CircularProgress from "@mui/material/CircularProgress";

export default function loading() {
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <CircularProgress />
    </div>
  );
}
