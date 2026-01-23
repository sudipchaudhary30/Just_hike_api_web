"use server"
 
import { login, register } from "../api/auth";
import { setUserData, setAuthToken } from "../cookie";
 
 
export const handleRegister = async(fromData: any) => {
    try{
        //handle data from component from
        const result =  await register(fromData);
        //handle how to send data back to component
        if(result.success){
            return{
                success: true,
                message: "Registration successful",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Registration failed"
        }
    }catch(err: Error | any){
        return {
            success: false, message: err.message || "Registration failed"
        }
    }
}
 
 
export const handleLogin = async(fromData: any) => {
    try{
        //handle data from component from
        console.log('🔵 handleLogin called with:', fromData);
        const result =  await login(fromData);
        console.log('🟢 Login API response:', result);
        
        //handle how to send data back to component
        if(result.success){
            console.log('✅ Setting auth cookies...');
            await setAuthToken(result.token)
            await setUserData(result.data)
           
            return{
                success: true,
                message: "Login successful",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Login failed"
        }
    }catch(err: Error | any){
        console.error('❌ handleLogin error:', err);
        return {
            success: false, message: err.message || "Login failed"
        }
    }
}
 
 