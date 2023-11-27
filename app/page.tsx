import MouseTrack from "@/components/mouse-track";
import { Shell } from "@/components/layout.tsx/shell";
import ThemeSwitch from "@/components/theme-switch";
import { Badge } from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge";
import { Room } from "../components/providers/liveblocks-provider";
import { UserList } from "@/components/user-list";
import { Boundary } from "@/components/mouse-boundary";

export default function Home() {
  return (
    <Room>
      <Boundary>
        <div className="flex relative justify-between w-full h-[70px]">
          <Shell>Chat</Shell>
          <UserList />
        </div>
        <MouseTrack />
        <div className=" flex sm:flex-row flex-col justify-between w-full">
          <Shell className="sm:w-fit w-full">
            <div className="flex items-center space-x-4">
              <ThemeSwitch />
              <Badge variant={"outline"}>Latency: 500ms</Badge>
              <div
                className={`${badgeVariants({
                  variant: "outline",
                })} flex gap-3 items-center`}
              >
                <p>Operational</p>
                <div className="relative flex items-center pr-3">
                  <div className="w-2 h-2 absolute rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 absolute rounded-full bg-green-500 animate-ping"></div>
                </div>
              </div>
            </div>
          </Shell>
          <Shell className="sm:w-fit w-full">
            <p>Designed with ❤️ by Shehu</p>
          </Shell>
        </div>
      </Boundary>
    </Room>
  );
}
//TODO:
//redesign theme switch
//style the editable input
//framer motion stagger userlist
//add toasts if possible
//add chat
//redesign cursor view
//design mobile view
//detect mobile
