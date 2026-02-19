import Link from 'next/link'

export default function AboutPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-900">
      <section className="bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/80 mb-4">Who We Are</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mb-6">
            Building trusted trekking experiences for every kind of adventurer
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
            Just Hike is a trekking platform focused on safety, local expertise, and responsible travel. We connect trekkers with verified guides and thoughtfully curated routes across the Himalayas.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              We make mountain travel more accessible and more reliable by offering clear trek information, transparent pricing, and verified local professionals.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              From first-time hikers to experienced trekkers, our goal is the same: deliver safe, memorable journeys that respect nature and support mountain communities.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-lg">
            <img
              src="/Assets/Images/hero_image.webp"
              alt="Mountain trekking"
              className="w-full h-[360px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#45D1C1] mb-1">50+</p>
              <p className="text-gray-600">Verified Guides</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#45D1C1] mb-1">120+</p>
              <p className="text-gray-600">Curated Treks</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#45D1C1] mb-1">10K+</p>
              <p className="text-gray-600">Happy Trekkers</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#45D1C1] mb-1">24/7</p>
              <p className="text-gray-600">Support Team</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">What We Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Every trek is backed by verified guides, route planning, and practical risk awareness.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Experiences</h3>
              <p className="text-gray-600">
                Local expertise and trail knowledge ensure journeys that feel real, immersive, and personal.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Responsible Travel</h3>
              <p className="text-gray-600">
                We promote low-impact trekking that protects mountain ecosystems and local communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-sm font-semibold text-[#45D1C1] mb-2">2022</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Foundation</h3>
              <p className="text-gray-600">Just Hike was launched to make trekking planning simpler and more trustworthy.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-sm font-semibold text-[#45D1C1] mb-2">2024</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scale</h3>
              <p className="text-gray-600">Expanded our guide network and introduced broader regional trekking options.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <p className="text-sm font-semibold text-[#45D1C1] mb-2">Today</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">We continue to grow a community built around safe, meaningful mountain adventures.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-[#45D1C1]/10 via-white to-[#3BC1B1]/10 border border-[#45D1C1]/20 p-8 md:p-10 shadow-xl">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.2em] text-[#45D1C1] mb-3 font-semibold">Leadership</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Executive Management</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                A focused leadership team combining mountain expertise, operations excellence, and technology-driven service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#45D1C1]/20 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#45D1C1] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">AK</div>
                <h3 className="text-gray-900 text-lg font-semibold">Sudip Chaudhary</h3>
                <p className="text-[#45D1C1] font-medium mt-1">CEO</p>
                <p className="text-gray-600 text-sm mt-3">Leads strategic direction, partnerships, and long-term growth.</p>
              </div>

              <div className="bg-white border border-[#45D1C1]/20 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#45D1C1]/15 text-[#45D1C1] flex items-center justify-center text-xl font-bold mx-auto mb-4">SP</div>
                <h3 className="text-gray-900 text-lg font-semibold">Sana Pradhan</h3>
                <p className="text-[#45D1C1] font-medium mt-1">COO</p>
                <p className="text-gray-600 text-sm mt-3">Oversees trek operations, guide standards, and service quality.</p>
              </div>

              <div className="bg-white border border-[#45D1C1]/20 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#45D1C1]/15 text-[#45D1C1] flex items-center justify-center text-xl font-bold mx-auto mb-4">RM</div>
                <h3 className="text-gray-900 text-lg font-semibold">Rohan Manandhar</h3>
                <p className="text-[#45D1C1] font-medium mt-1">CTO</p>
                <p className="text-gray-600 text-sm mt-3">Builds platform reliability, booking systems, and user experience.</p>
              </div>

              <div className="bg-white border border-[#45D1C1]/20 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="h-16 w-16 rounded-full bg-[#45D1C1]/15 text-[#45D1C1] flex items-center justify-center text-xl font-bold mx-auto mb-4">NL</div>
                <h3 className="text-gray-900 text-lg font-semibold">Nima Lama</h3>
                <p className="text-[#45D1C1] font-medium mt-1">Head of Management</p>
                <p className="text-gray-600 text-sm mt-3">Leads team coordination, customer success, and partner onboarding.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Our Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 text-center font-semibold text-gray-700">Himalayan Trails Co.</div>
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 text-center font-semibold text-gray-700">Summit Safe Guides</div>
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 text-center font-semibold text-gray-700">Eco Trek Nepal</div>
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 text-center font-semibold text-gray-700">Mountain Care Foundation</div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">Ready to plan your next trek?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore curated adventures, compare options clearly, and choose a journey with confidence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/treks"
                className="px-6 py-3 bg-[#45D1C1] text-white rounded-lg font-semibold hover:bg-[#3BC1B1] transition-colors"
              >
                Explore Treks
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Read Stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}