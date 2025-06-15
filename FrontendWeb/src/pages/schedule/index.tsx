import { Divider } from "@mui/material";
import CustomDrawer from "../../component/CustomDrawer";
import DrawerList from "../../component/DrawerList";
import ListIconHome from "../../component/ListIconHome";
import Calendar from "../../component/Calendar";

export default function Schedule() {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.25)] z-30 ">
                <CustomDrawer DrawerList={DrawerList}/>
                <Divider variant="middle"/>
                <ListIconHome />
                <div className="flex grow justify-center items-end py-4">
                    <a href="https://www.hogardecristo.cl/" target="_blank" rel="noopener noreferrer"><img src={"https://hcstore.org/wp-content/uploads/2020/01/cropped-hc-192x192.png"} loading="lazy" width={48} height={48}/></a>
                </div>
            </div>
            <div className="flex grow w-full overflow-auto gap-1 items-center justify-center">
                <div className="grow p-5 min-h-full w-full">
                    <Calendar />
                </div>
            </div>
        </div>
    )
};
