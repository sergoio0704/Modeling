import { useAuth } from "../context/authContext"
import { AuthorizedRoutes } from "./authorizedRoutes"
import { UnauthorizedRoutes } from "./unauthorizedRoutes"

export const RootRoute = () => {
    const {token} = useAuth()
    return token  ? <AuthorizedRoutes /> : <UnauthorizedRoutes />
}