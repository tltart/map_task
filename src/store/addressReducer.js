const SET_ADDRESS = 'SET_ADDRESS'
const REMOVE_ADDRESS = 'REMOVE_ADDRESS'
const CHANGE_ADDRESS = 'CHANGE_ADDRESS'
const SORT_ADRESSES = 'SORT_ADRESSES'


let initialState = []

const addressReducer = (state = initialState, action) => {
    switch (action.type) {

        // Добавление нового адреса
        case SET_ADDRESS:
            let stateCopy = [...state]
            let rr = stateCopy.filter(item => JSON.stringify(item.coord) === JSON.stringify(action.payload.coord))
            if (rr.length) return state
            return [...state, {coord: action.payload.coord, address: action.payload.address }]

        // Удаление адреса
        case REMOVE_ADDRESS:
            return [...state.filter(item => JSON.stringify(item.coord) !== JSON.stringify(action.payload))]

        // Смена маркера при перетаскивании
        case CHANGE_ADDRESS:
            let copy = [...state]
            copy[action.payload.oldAddress] = action.payload.newAddress
            return copy

        // Перестановка адресов при перетаскивании
        case SORT_ADRESSES:
            [state[action.payload.coverCard], state[action.payload.selectCard]] = [state[action.payload.selectCard], state[action.payload.coverCard]]
            return [...state]
            
        default:
            return state

    }
}

export const addAdressToStore = (coord, address) => ({ type: SET_ADDRESS, payload: { coord, address } })
export const removeAdressToStore = (address) => ({ type: REMOVE_ADDRESS, payload: address })
export const changeAdressToStore = (oldAddress, newAddress) => ({type: CHANGE_ADDRESS, payload: {oldAddress, newAddress}}) 
export const sortAddressFromStore = (selectCard, coverCard) => ({ type: SORT_ADRESSES, payload: {selectCard, coverCard} })


export default addressReducer