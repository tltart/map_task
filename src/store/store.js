import {combineReducers, createStore} from 'redux'
import addressReducer from "./addressReducer"


let reducers = combineReducers({
    address: addressReducer
})

let store = createStore(reducers)


window.store = store

export default store