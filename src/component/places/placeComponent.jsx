import React, { useEffect, useRef, useState } from 'react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete"
import { addAdressToStore } from '../../store/addressReducer';
import c from './placeComponent.module.css'
import { connect } from 'react-redux'


const mapStateToProps = (state) => {
    return {
        addressFromStore: state.address
    }
}

const PlaceComponent = ({ addAdressToStore }) => {

    const [address, setAddress] = useState("")
    const addressRef = useRef()


    useEffect(() => {
        const press = async (event) => {
            if (event.keyCode === 13) {
                const results = await geocodeByAddress(addressRef.current.value);
                const latLng = await getLatLng(results[0]);
                addAdressToStore(latLng, event.target.value)
                setAddress("")
            }
        }

        window.addEventListener('keyup', press)
        return () => window.removeEventListener('keyup', press)
    }, [addAdressToStore])


    return (

        <div className={c.wrap}>
            <PlacesAutocomplete
                value={address}
                onChange={setAddress}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <div className={c.wrap__input}>
                            <input ref={addressRef} {...getInputProps({ placeholder: "Введите адрес..." })} />
                        </div>
                        <div>
                            {suggestions.map((suggestion, index) => {
                                const style = {
                                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                                    position: "absolute",
                                    display: 'flex',
                                    alignItems: 'center',
                                    top: `${(index + 1.3) * 40}px`,
                                    paddingLeft: '10px',
                                    zIndex: 1000,
                                    fontFamily: 'Roboto-Regular',
                                    fontSize: '15px',
                                };

                                return (
                                    <div className={c.drop__menu} key={suggestion.placeId} {...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        </div>

    )
}


export default connect(mapStateToProps, { addAdressToStore })(PlaceComponent)