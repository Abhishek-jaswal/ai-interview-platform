import Image from "next/image";
// import LoginPage from "./login/page";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <div className="pb-0 font-[family-name:var(--font-patrick-hand)]">
     {/* <LoginPage/> */}
     <Dashboard />
    </div>
   
  );
}
