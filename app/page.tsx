import Link from 'next/link'
import Button from '@/_components/ui/Button'
import Card from '@/_components/ui/Card'

export default function HomePage() {
  const stats = [
    { value: '10K+', label: 'Active Hikers' },
    { value: '5K+', label: 'Trails' },
    { value: '50+', label: 'Countries' },
    { value: '4.9★', label: 'Rating' },
  ]

  const features = [
    {
      icon: '🗺️',
      title: 'Discover Trails',
      description: 'Find hand-picked trails with detailed maps, photos, and reviews.',
    },
    {
      icon: '👥',
      title: 'Join Community',
      description: 'Connect with hikers, share experiences, and plan group hikes.',
    },
    {
      icon: '📈',
      title: 'Track Progress',
      description: 'Log hikes, earn badges, and watch your journey unfold.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4">
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
              🎯 Trusted by 10,000+ hikers
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Your Perfect{' '}
            <span className="text-green-600">Hiking Companion</span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Find amazing trails, connect with fellow adventurers, and track your hiking journey — all in one place.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button variant="primary" className="px-10 py-4 sm:px-12">
                Start Exploring Free
              </Button>
            </Link>
            
            <Link href="/login">
              <Button variant="secondary" className="px-10 py-4 sm:px-12">
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Everything You Need to Hike Better
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-shadow">
                <div className="mb-6 text-5xl">{feature.icon}</div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-12 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Start Your Hiking Adventure Today
          </h2>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg text-green-100">
            Join our community of passionate hikers. It's free to start!
          </p>
          
          <Link href="/register">
            <Button className="bg-white text-green-600 px-12 py-4 text-xl hover:bg-gray-100">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}