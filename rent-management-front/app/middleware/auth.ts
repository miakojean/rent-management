import { api } from "~/services/api";


export interface User {
    id?:number|String,
    firstName:string,
    lastName:string,
    email:string,
    username:string,
    phoneNumber?:string,
    isAdmin?:boolean,
}

export const authMiddleware = async () :Promise<boolean> => {
    try {
        const response = await api.get('/rent-management/auth/profile');
        const user: User = response.data;
        console.log("Authenticated user:", user);
        return true;
    } catch (error) {
        console.error("Authentication error:", error);
        return false;
    }
}