import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar className="bg-[#121212] shadow-md">
        <Link href="/" className="-my-7">
          <Image
            src="/HMDB_logo.webp"
            alt="HMDB logo"
            width={130}
            height={130}
            priority // ✅ This removes the LCP warning
          />
        </Link>
        <SearchBar />
      </Toolbar>
    </AppBar>
  );
}
