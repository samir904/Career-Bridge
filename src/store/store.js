import {configureStore} from '@reduxjs/toolkit'
import userReducer from './slices/user.slice'
import jobReducer from './slices/job.slice'
import companyReducer from './slices/company.slice'
import applicationRoute from './slices/application.slice'
const store=configureStore({
    reducer:{
        user:userReducer,
        job:jobReducer,
        company:companyReducer,
        application:applicationRoute
    },
    devTools:true
})

export default store;