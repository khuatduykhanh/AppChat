import { createContext,useState } from "react";

export const AuthenticatedUserContext = createContext({}) // tạo một context để truyền dữ liệu xuống các thành phần mà không cần truyền qua nhiều lớp con
const AuthenticatedUserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [userAvtUrl,setUserAvtUrl] = useState(null);
    return (
        <AuthenticatedUserContext.Provider value = {{user,setUser,userAvtUrl,setUserAvtUrl}}> 
            {children}
        </AuthenticatedUserContext.Provider> // truyền giá trị của user,setUser xuống các thành phần con dưới mà không cần truyền qua nhiều giá trị
    )
}
export default AuthenticatedUserProvider;