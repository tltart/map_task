import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import c from './listPlaces.module.css'
import { connect } from 'react-redux'
import { removeAdressToStore, sortAddressFromStore } from '../../store/addressReducer.js'


const mapStateToProps = (state) => {
    return {
        addressFromStore: state.address
    }
}


const ListPlaces = ({ addressFromStore, removeAdressToStore, sortAddressFromStore }) => {

    const [cardDrag, setCardDrag] = useState(null)


    const handleClickRemove = (e) => {
        removeAdressToStore(JSON.parse(e.target.previousSibling.dataset.item))
    }

    const handleonDragStart = (e, index) => {
        setCardDrag(index)
    }

    const handleonDrop = (e, index) => {
        e.preventDefault()
        sortAddressFromStore(cardDrag, index)
    }
    const handleonDragOver = (e) => {
        e.preventDefault()
        e.target.classList.add(`${c.over}`)
    }
    const handleonDragLeave = (e) => {
        e.target.classList.remove(`${c.over}`)
    }

    useEffect(() => {
        // Проверяем количество точек, и если их больше двух, при каждом рендере удаляем вспомогательный класс
        let elem = document.querySelectorAll(`.${c.wrap__item}`)
        if (elem.length >= 2) {
            elem.forEach(item => item.classList.remove(`${c.over}`))
        }
    }, [addressFromStore])

    return (
        <>
            {addressFromStore.map((item, index) => <div key={uuidv4()} className={c.wrap__item}
                draggable={true}
                onDragStart={(e) => handleonDragStart(e, index)}
                onDrop={(e) => handleonDrop(e, index)}
                onDragOver={handleonDragOver}
                onDragLeave={handleonDragLeave}
            >
                <div data-item={JSON.stringify(item.coord)}>
                    {item.address}
                    {`        ${item.coord.lat} ${item.coord.lng}`}</div>
                <div className={c.remove} onClick={handleClickRemove}></div>
            </div>)}
        </>
    )
}


export default connect(mapStateToProps, { removeAdressToStore, sortAddressFromStore })(ListPlaces)