import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Banner from '../../Components/Banner'
import Card from '../../Components/Card'
import { productFetch } from '../../Store/user/Products'
import Footer from '../../Components/Footer'
import { Loader } from 'lucide-react'

const Home = () => {

    const dispatch = useDispatch()
    const products = useSelector(state => state.product.productData)
    const loading = useSelector(state => state.product.loading)

    useEffect(() => {
        dispatch(productFetch())
    }, [dispatch])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader className="animate-spin text-gray-600" size={30} />
            </div>
        )
    }

    return (
        <div>
            <Banner />
            <div className="min-h-[1000] bg-gray-100 p-4 my-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl text-center font-bold text-gray-900 mb-2">Special Drinks</h1>
                    <p className="text-gray-600 text-center mb-8">Check out our Special Drinks</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        {products?.slice(0, 4)?.map((product) => (
                            <Card key={product._id}
                                id={product._id}
                                image={product.images[0]}
                                name={product.name}
                                category={product.category}
                                price={product.variants[0].salePrice}
                            />
                        ))}
                    </div>

                </div>
            </div>

            <img src="Home-cooldrinks.webp" className="w-full h-auto object-cover my-4" />

            <div className="min-h-[1000] bg-gray-100 p-4 my-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl text-center font-bold text-gray-900 mb-2">Refreshing Drinks</h1>
                    <p className="text-gray-600 text-center mb-8">Check out our Refreshing Drinks</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                        {products?.slice(products.length - 4, products.length)?.map((product) => (
                            <Card key={product._id}
                                id={product._id}
                                image={product.images[0]}
                                name={product.name}
                                category={product.category}
                                price={product.variants[0].salePrice}
                            />
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home
