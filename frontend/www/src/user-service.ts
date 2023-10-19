import { setUsers } from "./model/store"
const USER_URL = "./api/user"
class UserService {
    async fetchAll() {
        const response = await fetch(USER_URL)
        const users = await response.json()
        setUsers(users)
    }
}

const userService = new UserService()
export default userService