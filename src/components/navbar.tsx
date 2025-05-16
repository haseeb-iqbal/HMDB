import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import logo from "@images/HMDB_logo.webp";
import Link from "next/link";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar className="bg-gray-900 shadow-md">
        <Link href="/" className="-my-7">
          <Image src={logo} width={130} height={130} alt="hmdb logo" />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
