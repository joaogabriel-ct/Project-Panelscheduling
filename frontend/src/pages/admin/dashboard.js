import App from "@/components/admin/calendar";
import { withSuperUserHOC } from "@/service/auth/session";

function dashboardAdmin(){
    return(
        <div>
            <App/>
        </div>
    )
}

export default withSuperUserHOC(dashboardAdmin)