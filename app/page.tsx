'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Guide {
  id: string
  name: string
  email: string
  bio: string
  experienceYears: number
  languages: string[]
  imageUrl?: string
}

interface Trek {
  id: string
  title: string
  price: number
  difficulty: 'easy' | 'moderate' | 'hard'
  durationDays: number
  location: string
  imageUrl?: string
  description?: string
  createdAt?: string
}

interface Blog {
  id: string
  title: string
  excerpt: string
  tags: string[]
  imageUrl?: string
  authorName: string
  publishedAt?: string
  createdAt?: string
}

export default function JustHikePage(): JSX.Element {
  const [guides, setGuides] = useState<Guide[]>([])
  const [treks, setTreks] = useState<Trek[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [guidesLoading, setGuidesLoading] = useState(true)
  const [treksLoading, setTreksLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(true)

  // Preload hero background image
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = '/Assets/Images/hero_image.webp'
    document.head.appendChild(link)
  }, [])

  // Fetch guides
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050'
        const response = await fetch(`${API_BASE_URL}/api/guides`)
        const data = await response.json()
        const mappedGuides = (data.data || []).slice(0, 5).map((guide: any) => ({
          id: guide._id,
          name: guide.name,
          email: guide.email,
          bio: guide.bio,
          experienceYears: guide.experienceYears,
          languages: guide.languages || [],
          imageUrl: guide.imageUrl,
        }))
        setGuides(mappedGuides)
      } catch (error) {
        console.error('Error fetching guides:', error)
      } finally {
        setGuidesLoading(false)
      }
    }
    fetchGuides()
  }, [])

  // Fetch treks
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await fetch('/api/treks')
        const data = await response.json()
        const mappedTreks = (data.packages || []).map((trek: any) => ({
          id: trek._id || trek.id,
          title: trek.title || trek.name,
          price: trek.price,
          difficulty: trek.difficulty,
          durationDays: trek.durationDays || trek.duration,
          location: trek.location,
          imageUrl: trek.imageUrl || trek.image,
          description: trek.description,
          createdAt: trek.createdAt || trek.updatedAt,
        }))
        const sortedTreks = mappedTreks.sort((a: Trek, b: Trek) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return bTime - aTime
        })
        setTreks(sortedTreks.slice(0, 6))
      } catch (error) {
        console.error('Error fetching treks:', error)
      } finally {
        setTreksLoading(false)
      }
    }
    fetchTreks()
  }, [])

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050'
        const response = await fetch(`${API_BASE_URL}/api/blogs`)
        const data = await response.json()
        const mappedBlogs = (data.data || []).map((blog: any) => ({
          id: blog._id,
          title: blog.title,
          excerpt: blog.excerpt,
          tags: blog.tags || [],
          imageUrl: blog.imageUrl,
          authorName: blog.author?.name || 'Admin',
          publishedAt: blog.publishedAt || blog.createdAt,
          createdAt: blog.publishedAt || blog.createdAt,
        }))
        const sortedBlogs = mappedBlogs.sort((a: Blog, b: Blog) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return bTime - aTime
        })
        setBlogs(sortedBlogs.slice(0, 3))
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setBlogsLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-[600px] flex items-center" style={{
        backgroundImage: `url('/Assets/Images/hero_image.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative mx-auto max-w-6xl px-6 w-full text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Trekking the world made easy
          </h1>
          
          {/* Search Bar */}
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center gap-2 bg-white rounded-lg p-3">
              <input
                type="text"
                placeholder="Search treks, guides, destinations..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
              />
              <Link href="/treks" className="px-6 py-2 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors">
                Search
              </Link>
            </div>
          </div>

          {/* Guides Carousel */}
          <div className="mt-10">
            {guidesLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
              </div>
            ) : guides.length > 0 ? (
              <div className="flex justify-center gap-6 flex-wrap">
                {guides.slice(0, 5).map((guide: Guide) => (
                  <div key={guide.id} className="flex flex-col items-center group">
                    <div className="relative inline-block mb-2">
                      <img
                        src={guide.imageUrl || `https://i.pravatar.cc/120?img=${Math.random() * 70}`}
                        alt={guide.name}
                        className="h-24 w-24 rounded-full object-cover border-4 border-[#45D1C1] group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-white font-semibold text-sm">{guide.name}</h4>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Why Not Climb Mountains Section */}
      <section className="bg-gradient-to-b from-white to-blue-50/50 py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image */}
          <div className="order-2 lg:order-1">
            <img 
              src="Assets/Images/hero_image.webp" 
              alt="Mountain climbing"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why not climb mountains
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Reconnecting with nature is at the core of everything we do. Our treks are designed to help you experience the raw beauty of the Himalayas while building lasting memories and friendships.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-[#45D1C1] font-bold text-xl">✓</span>
                <span className="text-gray-600">Expert guides with years of experience</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#45D1C1] font-bold text-xl">✓</span>
                <span className="text-gray-600">Carefully curated trails for all levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#45D1C1] font-bold text-xl">✓</span>
                <span className="text-gray-600">Safe and sustainable adventure</span>
              </li>
            </ul>
            <Link href="/treks" className="inline-block mt-8 px-8 py-3 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors">
              Explore Packages
            </Link>
          </div>
          </div>
        </div>
      </section>

      {/* Featured Treks Section - Famous Treks */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Famous Treks</h2>
            <p className="text-gray-600 text-lg">Experience the most sought-after mountain adventures</p>
          </div>

          {treksLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45D1C1]"></div>
            </div>
          ) : treks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {treks.slice(0, 3).map((trek: Trek) => (
                  <div key={trek.id} className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {/* Trek Image */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      {trek.imageUrl ? (
                        <img
                          src={trek.imageUrl}
                          alt={trek.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Difficulty Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`${getDifficultyColor(trek.difficulty)} px-3 py-1 rounded-full text-xs font-bold uppercase`}>
                          {trek.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Trek Info */}
                    <div className="p-6 flex flex-col justify-between h-full">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#45D1C1] transition-colors">{trek.title}</h3>
                        
                        <div className="space-y-2 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#45D1C1]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span>{trek.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#45D1C1]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                            </svg>
                            <span>{trek.durationDays} days</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <div className="text-sm text-gray-500">Starting from</div>
                          <span className="text-2xl font-bold text-[#45D1C1]">Rs {trek.price}</span>
                        </div>
                        <Link href={`/treks/${trek.id}`} className="relative z-10">
                          <button className="px-4 py-2 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-all duration-300 shadow hover:shadow-lg">
                            Book Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/treks" className="inline-block px-8 py-4 bg-[#45D1C1] text-white rounded-full font-semibold hover:bg-[#3BC1B1] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Explore All Treks →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No treks available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="bg-gradient-to-b from-white to-blue-50/50 py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Blog Articles</h2>
          <p className="text-gray-600 text-lg">Expert advice and inspiring stories from the mountain community</p>
        </div>

        {blogsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#45D1C1]"></div>
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog: Blog) => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <div className="group overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                    {/* Blog Image */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50">
                      {blog.imageUrl ? (
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.001c0 5.591 3.824 10.404 9 11.623m0-13c5.5 0 10-4.745 10-10.999C22 5.004 17.5.25 12 .25m0 13v13m0-13C6.5 30.253 2 25.498 2 19.495" />
                          </svg>
                        </div>
                      )}
                      {/* Tag Badge */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {blog.tags[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Blog Info */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#45D1C1] transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-teal-600">{blog.authorName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{blog.authorName}</p>
                            {blog.publishedAt && (
                              <p className="text-xs text-gray-500">
                                {new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-all duration-300 shadow hover:shadow-lg">
                          Read
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/blog" className="inline-block px-8 py-4 bg-white border-2 border-[#45D1C1] text-[#45D1C1] rounded-full font-semibold hover:bg-[#45D1C1] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl">
                Read All Articles →
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles available yet. Check back soon!</p>
          </div>
        )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-14 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trusted by Adventurers</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join a growing community of mountain enthusiasts who've transformed their lives through unforgettable adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                number: '50+', 
                label: 'Trek Routes', 
                description: 'Carefully curated mountain paths' 
              },
              { 
                number: '120+', 
                label: 'Expert Guides', 
                description: 'Certified professionals' 
              },
              { 
                number: '8500+', 
                label: 'Happy Adventurers', 
                description: 'Life-changing experiences' 
              },
              { 
                number: '32', 
                label: 'Destinations', 
                description: 'Across the Himalayas' 
              },
            ].map((stat, idx) => (
              <div key={idx} className="p-8 border border-gray-200 rounded-lg hover:border-teal-400 transition-colors">
                <div className="text-4xl font-bold text-[#45D1C1] mb-4">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</h3>
                <p className="text-sm text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-12 md:py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg">
                <span className="text-[#45D1C1] text-sm font-semibold">TESTIMONIALS</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">What our peers say about us</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Authentic reviews as well as the experience our guides hold defines the success we had over these years of service
              </p>
              <button className="px-8 py-3 bg-[#45D1C1] text-white rounded-full font-semibold hover:bg-[#3BC1B1] transition-all duration-300">
                See all reviews
              </button>
            </div>

            {/* Right - Testimonial Cards */}
            <div className="relative h-96">
              {/* Card 1 - Front */}
              <div className="absolute top-0 right-0 w-80 bg-white rounded-2xl p-6 z-30 transform hover:scale-105 transition-transform border border-gray-100 border-l-4 border-l-teal-500">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://i.pravatar.cc/80?img=1" 
                    alt="Traveler"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Alex Johnson</h4>
                    <p className="text-sm text-[#45D1C1]">Everest Trek, Jan 2024</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic mb-4">
                  "The best trekking experience of my life. Our guide was incredibly knowledgeable and made sure we were safe throughout."
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#45D1C1]">★</span>
                  ))}
                </div>
              </div>

              {/* Card 2 - Middle */}
              <div className="absolute top-12 right-20 w-80 bg-white rounded-2xl p-6 z-20 transform hover:scale-105 transition-transform border border-gray-100 border-l-4 border-l-cyan-500">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://i.pravatar.cc/80?img=2" 
                    alt="Traveler"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
                    <p className="text-sm text-[#45D1C1]">Annapurna Trek, Dec 2024</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic mb-4">
                  "A really random quote found on the internet. Yes I'm not really creative. And enclosing it in double quotes cause aesthetics"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#45D1C1]">★</span>
                  ))}
                </div>
              </div>

              {/* Card 3 - Back */}
              <div className="absolute top-24 right-40 w-80 bg-white rounded-2xl p-6 z-10 transform hover:scale-105 transition-transform border border-gray-100 border-l-4 border-l-teal-500">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src="https://i.pravatar.cc/80?img=3" 
                    alt="Traveler"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Marco Rossi</h4>
                    <p className="text-sm text-[#45D1C1]">Inca Trail, Nov 2024</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic mb-4">
                  "Unforgettable adventure with professional guides. Highly recommended for everyone who loves mountains!"
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#45D1C1]">★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Top section */}
          <div className="mb-8 pb-8 border-b border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Brand */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">JustHike</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Discover authentic mountain adventures. Professional guides, unforgettable experiences.
                </p>
                <div className="flex gap-4 mt-6">
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[#45D1C1] transition-colors text-sm font-semibold">
                    f
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[#45D1C1] transition-colors text-sm font-semibold">
                    X
                  </a>
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-[#45D1C1] transition-colors text-sm font-semibold">
                    in
                  </a>
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/treks" className="hover:text-[#45D1C1] transition-colors">Trek Packages</Link></li>
                  <li><Link href="/blog" className="hover:text-[#45D1C1] transition-colors">Blog & Stories</Link></li>
                  <li><Link href="/about" className="hover:text-[#45D1C1] transition-colors">About Us</Link></li>
                  <li><a href="#" className="hover:text-[#45D1C1] transition-colors">Contact</a></li>
                </ul>
              </div>

              {/* Info */}
              <div>
                <h4 className="text-white font-semibold mb-6">Get In Touch</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#45D1C1]">→</span>
                    <span>Kathmandu, Nepal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#45D1C1]">→</span>
                    <a href="mailto:info@justhike.com" className="hover:text-[#45D1C1] transition-colors">info@justhike.com</a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#45D1C1]">→</span>
                    <a href="tel:+977xxxx" className="hover:text-[#45D1C1] transition-colors">+977 1 XXXX XXXX</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2026 JustHike. All rights reserved.</p>
            <div className="flex gap-6 mt-6 md:mt-0">
              <a href="#" className="hover:text-[#45D1C1] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#45D1C1] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#45D1C1] transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
