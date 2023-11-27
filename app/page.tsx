import MouseTrack from "@/components/cursor parts/mouse-track";
import { Shell } from "@/components/layout/shell";
import ThemeSwitch from "@/components/layout/theme-switch";
import { Badge } from "@/components/ui/badge";
import { badgeVariants } from "@/components/ui/badge";
import { Room } from "../components/providers/liveblocks-provider";
import { UserList } from "@/components/layout/user-list";
import Boundary from "@/components/cursor parts/cursor-boundary";

export default function Home() {
  return (
    <Room>
      <Boundary>
        <div className="flex relative justify-between w-full h-[70px]">
          <Shell>Chat</Shell>
          <UserList />
        </div>
        <MouseTrack />
        <div className="flex flex-col justify-between w-full sm:flex-row">
          <Shell className="w-full sm:w-fit">
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
                  <div className="absolute w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
          </Shell>
          <Shell className="w-full sm:w-fit">
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
