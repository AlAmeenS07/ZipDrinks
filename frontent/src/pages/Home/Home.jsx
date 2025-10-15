import React from 'react'
import { useSelector } from 'react-redux'
import Banner from '../../Components/Banner'

const Home = () => {

    const name = useSelector(state => state.user)


    return (
        <div>
            <h1>Home Page - {name.userData?.fullname}</h1>
            <Banner />
        </div>
    )
}

export default Home
