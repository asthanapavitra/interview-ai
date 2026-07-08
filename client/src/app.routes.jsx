import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import HomePage from './features/interview/pages/HomePage'
import Protected from "./features/auth/components/Protected";
import InterviewReport from "./features/interview/pages/InterviewReport";

export const router=createBrowserRouter([
    {
        path:'/login',
        element:<Login/>
    },
    {
        path: '/register',
        element: <Register/>
    },
    {
        path:'/',
        element:<Protected><HomePage/></Protected>
    },
    {
        path:'/interview/:interviewId',
        element:<Protected><InterviewReport/></Protected>
    },
])