import MouseTrack from "@/components/cursor parts/mouse-track";
import { Shell } from "@/components/layout/shell";
import ThemeSwitch from "@/components/layout/theme-switch";
import { Room } from "@/components/providers/liveblocks-provider";
import { UserList } from "@/components/layout/user-list";
import Boundary from "@/components/cursor parts/cursor-boundary";
import StatusBadge from "@/components/layout/status-badge";

export default function Home() {
  return (
    <Room>
      <Boundary>
        <div className="flex relative justify-center md:justify-between w-full h-[70px]">
          <Shell className="hidden lg:flex font-anon text-4xl">
            Multiplayer Demo - Liveblocks
          </Shell>
          <UserList />
        </div>
        <MouseTrack />
        <div className="flex flex-col justify-between w-full sm:flex-row">
          <Shell className="flex justify-around w-full sm:w-fit">
            <div className="flex items-center space-x-4">
              <ThemeSwitch />
              <StatusBadge />
            </div>
          </Shell>
          <Shell className="flex justify-center w-full font-open sm:w-fit">
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
//online badge animation
//framer motion stagger userlist
//add toasts if possible
//redesign reactionbar
//stable fonts
//meta data and analytics stuff
