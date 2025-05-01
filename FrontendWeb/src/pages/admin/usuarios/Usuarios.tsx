import CustomDrawer from "../../../component/CustomDrawer";
import DrawerListProfile from "../../../component/DrawerListProfile";


export default function Usuarios() {
    return (
        <div className="flex flex-row grow justify-between items-start">
            <CustomDrawer DrawerList={DrawerListProfile} />
            <div className="flex grow self-center justify-center items-center">
                <p>Usuarios</p>
            </div>
        </div>
    )
};
