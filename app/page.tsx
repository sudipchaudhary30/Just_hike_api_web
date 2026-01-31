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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=700&fit=crop" 
            alt="Hero" 
            className="w-full h-[520px] md:h-[600px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            What do you want to explore?
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur px-4 py-3 rounded-2xl shadow-lg">
              <span className="text-teal-500">🔍</span>
              <input
                type="text"
                placeholder="Hike you want to join"
                className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400"
              />
              <button className="h-10 w-10 rounded-full bg-teal-400 text-white flex items-center justify-center hover:bg-teal-500 transition-colors">
                🎤
              </button>
            </div>
          </div>

          {/* Top Guides */}
          <div className="mt-8">
            <p className="text-white/80 text-sm mb-3">Top Guides</p>
            <div className="flex flex-wrap justify-center gap-4">
              {topGuides.map((guide: Guide, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-white/80"
                  />
                  <span className="text-white/80 text-xs mt-1">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Guides Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">FEATURED</span>
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
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-teal-100 group-hover:ring-teal-300 transition-all duration-300 group-hover:scale-110 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-teal-400 rounded-full border-4 border-white flex items-center justify-center text-sm">✓</div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{guide.name}</h3>
              <p className="text-gray-500 text-sm">Expert Guide</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Treks Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-16">
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">POPULAR</span>
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
                  <button className="px-4 py-2 bg-teal-400 text-white rounded-lg font-semibold hover:bg-teal-500 transition-all duration-300 shadow hover:shadow-lg">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/treks" className="inline-block px-8 py-4 bg-teal-400 text-white rounded-full font-semibold hover:bg-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl">
            View All Treks →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-teal-500 to-emerald-500 py-20">
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
          <Link href="/auth/register" className="px-8 py-4 bg-teal-400 text-white rounded-full font-semibold hover:bg-teal-500 transition-all duration-300 shadow-lg hover:shadow-xl">
            Sign Up Now
          </Link>
          <Link href="/blog" className="px-8 py-4 bg-white text-teal-600 rounded-full font-semibold border-2 border-teal-500 hover:bg-teal-50 transition-all duration-300">
            Read Our Blog
          </Link>
        </div>
      </section>
    </div>
  )
}
