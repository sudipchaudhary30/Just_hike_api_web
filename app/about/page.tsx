export default function AboutPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-900">
      <section className="bg-gradient-to-r from-[#45D1C1] to-[#3BC1B1] text-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center md:text-left">
          <p className="text-sm md:text-base uppercase tracking-[0.2em] text-white/80 mb-4">About Just Hike</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl mb-5">
            Trusted treks, safer journeys, and meaningful mountain experiences
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
            We connect trekkers with verified guides and thoughtfully planned routes so every journey feels exciting, safe, and memorable.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-gray-900">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              We make mountain travel more accessible and more reliable by offering clear trek information, transparent pricing, and verified local professionals.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              From first-time hikers to experienced trekkers, our goal is the same: deliver safe, memorable journeys that respect nature and support mountain communities.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl shadow-xl border border-white/60">
            <img
              src="/Assets/Images/hero_image.webp"
              alt="Mountain trekking"
              className="w-full h-[380px] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">What We Value</h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            The principles that guide every trek, every guide partnership, and every traveler experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-7 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                Every trek is backed by verified guides, route planning, and practical risk awareness.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-7 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Experiences</h3>
              <p className="text-gray-600">
                Local expertise and trail knowledge ensure journeys that feel real, immersive, and personal.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-7 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsible Travel</h3>
              <p className="text-gray-600">
                We promote low-impact trekking that protects mountain ecosystems and local communities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}