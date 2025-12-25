import Card from '@/_components/ui/Card'

export default function DashboardPage() {
  const stats = [
    { label: 'Total Hikes', value: '18', change: '+3 this month' },
    { label: 'Distance Covered', value: '156 km', change: '+24 km this month' },
    { label: 'Trails Completed', value: '12', change: '+2 this month' },
    { label: 'Badges Earned', value: '8', change: '2 more to go' },
  ]

  const recentHikes = [
    { trail: 'Sunrise Peak', date: 'Yesterday', distance: '12km', difficulty: 'Hard' },
    { trail: 'Forest Loop', date: '3 days ago', distance: '8km', difficulty: 'Easy' },
    { trail: 'Mountain Ridge', date: '1 week ago', distance: '15km', difficulty: 'Medium' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your hiking overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <div className="text-gray-500 text-sm">{stat.label}</div>
              <div className="mt-2 text-2xl font-bold text-green-600">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-500">{stat.change}</div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="mb-6 text-xl font-bold text-gray-900">Recent Hikes</h2>
            <div className="space-y-4">
              {recentHikes.map((hike, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <h3 className="font-semibold">{hike.trail}</h3>
                    <p className="text-sm text-gray-500">{hike.date} • {hike.distance}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                    hike.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    hike.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {hike.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-6 text-xl font-bold text-gray-900">Quick Actions</h2>
            <div className="space-y-4">
              <button className="w-full rounded-lg bg-green-600 py-3 text-white hover:bg-green-700">
                Plan New Hike
              </button>
              <button className="w-full rounded-lg border border-green-600 py-3 text-green-600 hover:bg-green-50">
                Find Hiking Buddies
              </button>
              <button className="w-full rounded-lg border border-gray-300 py-3 text-gray-700 hover:bg-gray-50">
                View Your Badges
              </button>
            </div>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <h2 className="text-2xl font-bold">Ready for your next adventure?</h2>
          <p className="mt-2 opacity-90">Explore new trails and challenge yourself!</p>
          <button className="mt-4 rounded-lg bg-white px-6 py-2 font-semibold text-green-600 hover:bg-gray-100">
            Browse Trails
          </button>
        </Card>
      </div>
    </div>
  )
}