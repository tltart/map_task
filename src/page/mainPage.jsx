import React from "react";
import c from './mainPage.module.css'
import MapComponent from "../component/map/map";
import Search from '../component/places/placeComponent'
import ListPlaces from "../component/listPlaces/listPlaces";


const MainPage = () => {

    return (
        <div className={c.wrap}>
            <div className={c.wrap__map}>
                <MapComponent />
            </div>
            <div className={c.wrap__search}>
                <Search />
            </div>
            <div className={c.wrap__list}>
                <ListPlaces />
            </div>

        </div>
    )
}

export default MainPage;
