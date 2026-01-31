'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

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
  // Load Inter font from Google Fonts
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    document.body.style.fontFamily = "'Inter', sans-serif"
    
    return () => {
      document.body.style.fontFamily = ''
    }
  }, [])

  const topGuides: Guide[] = [
    { name: 'Tashi', image: 'https://i.pravatar.cc/100?img=1' },
    { name: 'Dipak', image: 'https://i.pravatar.cc/100?img=2' },
    { name: 'Ram', image: 'https://i.pravatar.cc/100?img=3' },
    { name: 'Sanjay', image: 'https://i.pravatar.cc/100?img=4' },
    { name: 'Roshan', image: 'https://i.pravatar.cc/100?img=5' },
  ]

  const popularTreks: Trek[] = [
    { name: 'ABC Trek', price: 'Rs 21000', rating: 4.9, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop' },
    { name: 'Langtang Valley Trek', price: 'Rs 33000', rating: 4.8, image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&h=400&fit=crop' },
    { name: 'Manaslu Trek', price: 'Rs 45000', rating: 4.9, image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=400&fit=crop' },
    { name: 'Everest Base Camp', price: 'Rs 55000', rating: 4.8, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop' },
    { name: 'Annapurna Circuit', price: 'Rs 42000', rating: 4.7, image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=500&h=400&fit=crop' },
    { name: 'Dhaulagiri Trek', price: 'Rs 48000', rating: 4.9, image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&h=400&fit=crop' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop" 
            alt="Hero" 
            className="w-full h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-6 py-40">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium mb-6">
              ✨ Discover Your Next Adventure
            </span>
            <h1 className="text-7xl font-bold text-white mb-6 leading-tight">
              Explore the Majestic Himalayas
            </h1>
            <p className="text-xl text-white/90 mb-8 font-light">
              Experience breathtaking trekking adventures with expert guides across the world's most stunning mountain ranges.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="flex gap-3 mb-12">
              <Link href="/treks" className="px-8 py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                Explore Treks →
              </Link>
              <button className="px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-full font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Guides Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">FEATURED</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Expert Mountain Guides</h2>
          <p className="text-gray-600 text-lg">Meet our certified guides with years of experience</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          {topGuides.map((guide: Guide, index: number) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="relative mb-4 inline-block">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-green-100 group-hover:ring-green-400 transition-all duration-300 group-hover:scale-110 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-sm">✓</div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{guide.name}</h3>
              <p className="text-gray-500 text-sm">Expert Guide</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Treks Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">POPULAR</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Treks</h2>
          <p className="text-gray-600 text-lg">Handpicked adventures for unforgettable experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTreks.map((trek: Trek, index: number) => (
            <div key={index} className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              {/* Trek Image */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={trek.image}
                  alt={trek.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Rating Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-2 rounded-full">
                  <span className="text-yellow-400">⭐</span>
                  <span className="font-semibold text-gray-900">{trek.rating}</span>
                </div>
              </div>

              {/* Trek Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{trek.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">🗻</span>
                    <span className="text-sm">Mountain Trek</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-green-600">{trek.price}</span>
                  </div>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 shadow hover:shadow-lg">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/treks" className="inline-block px-8 py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Treks →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Treks', value: '50+' },
              { label: 'Expert Guides', value: '100+' },
              { label: 'Happy Hikers', value: '5000+' },
              { label: 'Destinations', value: '25+' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Adventure?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of adventurers who have discovered the beauty of mountain trekking with JustHike.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="px-8 py-4 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            Sign Up Now
          </Link>
          <Link href="/blog" className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-300">
            Read Our Blog
          </Link>
        </div>
      </section>
    </div>
  )
}      {/* Popular Right Now Section */}
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