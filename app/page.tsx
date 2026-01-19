'use client'

import { url } from 'inspector'
import React, { useEffect } from 'react'
// import Navigation from '@/_components/Navigation'

interface Guide {
  name: string
  image: string
}

interface Trek {
  name: string
  price: string
  rating: number
  image: string
}

export default function JustHikePage(): JSX.Element {
  // Load Jaro font from Google Fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Jaro:wght@400;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    document.body.style.fontFamily = "'Jaro', sans-serif"
    
    return () => {
      document.body.style.fontFamily = ''
    }
  }, [])

  const topGuides: Guide[] = [
    { name: 'Tashi', image: 'https://placehold.co/80x80/4A90E2/white?text=T' },
    { name: 'Dipak', image: 'https://placehold.co/80x80/7B68EE/white?text=D' },
    { name: 'Ram', image: 'https://placehold.co/80x80/FF6B6B/white?text=R' },
    { name: 'Sanjay', image: 'https://placehold.co/80x80/FFA500/white?text=S' },
    { name: 'Roshan', image: 'https://placehold.co/80x80/2ECC71/white?text=R' },
  ]

  const popularTreks: Trek[] = [
    { name: 'ABC Trek', price: 'Rs 21000', rating: 4.9, image: 'https://placehold.co/400x300/3498DB/white?text=ABC+Trek' },
    { name: 'Langtang Valley Trek', price: 'Rs 33000', rating: 4.8, image: 'https://placehold.co/400x300/E74C3C/white?text=Langtang' },
    { name: 'ABC Trek', price: 'Rs 21000', rating: 4.9, image: 'https://placehold.co/400x300/3498DB/white?text=ABC+Trek' },
    { name: 'Langtang Valley Trek', price: 'Rs 33000', rating: 4.8, image: 'https://placehold.co/400x300/E74C3C/white?text=Langtang' },
    { name: 'ABC Trek', price: 'Rs 21000', rating: 4.9, image: 'https://placehold.co/400x300/3498DB/white?text=ABC+Trek' },
    { name: 'Langtang Valley Trek', price: 'Rs 33000', rating: 4.8, image: 'https://placehold.co/400x300/E74C3C/white?text=Langtang' },
  ]

  return (
    <div className="min-h-screen bg-white">
    

      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center" style={{ backgroundImage: `url('/Assets/Images/hero_image.webp')` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-blue-900/0 to-blue-900/0"></div>
        <div className="relative mx-auto max-w-5xl px-4 pt-40 text-center">
          <h1 className="mb-10 text-6xl font-bold text-white leading-tight drop-shadow-2xl">
            What do you want to explore?
          </h1>
          
          {/* Enhanced Search Bar */}
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center rounded-full bg-white px-8 py-5 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <svg className="h-7 w-7 text-[#45D1C1] mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search for treks, destinations, or experiences..."
                className="flex-1 text-gray-700 text-lg outline-none placeholder:text-gray-400"
              />
              <button className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="h-7 w-7 text-[#45D1C1] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Top Guides */}
          <div className="mt-12">
            <div className="text-left text-sm font-semibold text-white/90 mb-4 tracking-wide uppercase">
              ⭐ Top Rated Guides
            </div>
            <div className="flex justify-center space-x-6">
              {topGuides.map((guide: Guide, index: number) => (
                <div key={index} className="text-center group cursor-pointer">
                  <div className="relative">
                    <img
                      src={guide.image}
                      alt={guide.name}
                      className="h-20 w-20 rounded-full border-4 border-white shadow-xl object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white drop-shadow-lg">{guide.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Right Now Section */}
      <div className="mx-auto max-w-7xl px-6 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Popular Right Now</h2>
            <p className="text-gray-600">Discover the most sought-after treks this season</p>
          </div>
          <a href="#" className="flex items-center gap-2 text-[#45D1C1] hover:text-[#3bbfaf] font-semibold text-lg group transition-colors">
            View All
            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popularTreks.map((trek: Trek, index: number) => (
            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
              <div className="relative overflow-hidden">
                <img
                  src={trek.image}
                  alt={trek.name}
                  className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Heart Icon */}
                <button className="absolute right-4 top-4 rounded-full bg-white/90 backdrop-blur-sm p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300">
                  <svg className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Rating Badge */}
                <div className="absolute left-4 top-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <svg className="h-4 w-4 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-900">{trek.rating}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#45D1C1] transition-colors">
                  {trek.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Starting from</div>
                    <div className="text-2xl font-bold text-[#45D1C1]">{trek.price}</div>
                  </div>
                  <button className="px-6 py-3 bg-[#45D1C1] hover:bg-[#3bbfaf] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                    Book Now
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>7 Days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Max 12</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-[#45D1C1] to-[#3bbfaf] py-20">
        <div className="mx-auto max-w-4xl text-center px-6">
          <h2 className="text-5xl font-bold text-white mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl text-white/90 mb-10">Join thousands of hikers exploring breathtaking trails around the world</p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-[#45D1C1] font-bold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg text-lg">
              Start Exploring
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300 text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}