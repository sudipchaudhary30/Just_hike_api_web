'use client';

import Card from '@/_components/ui/Card';
import ProtectedRoute from '@/_components/auth/ProtectedRoute';
import { 
  Mountain, 
  Map, 
  Trophy, 
  Award, 
  TrendingUp, 
  Compass, 
  Calendar,
  Users,
  Clock,
  Star,
  ChevronRight,
  MapPin,
  Activity,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

function DashboardContent() {
  const [activeFilter, setActiveFilter] = useState('month');

  const stats = [
    { 
      label: 'Total Hikes', 
      value: '24', 
      change: '+3 this month',
      icon: Mountain,
      color: 'from-emerald-500 to-green-500',
      trend: 'up'
    },
    { 
      label: 'Distance Covered', 
      value: '248 km', 
      change: '+38 km this month',
      icon: Map,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up'
    },
    { 
      label: 'Trails Completed', 
      value: '18', 
      change: '+4 this month',
      icon: Trophy,
      color: 'from-purple-500 to-pink-500',
      trend: 'up'
    },
    { 
      label: 'Badges Earned', 
      value: '12', 
      change: '3 more to go',
      icon: Award,
      color: 'from-amber-500 to-orange-500',
      trend: 'up'
    },
  ];

  const recentHikes = [
    { 
      trail: 'Sunrise Peak Summit', 
      date: 'Yesterday', 
      distance: '15.2km',
      elevation: '1,240m',
      difficulty: 'Expert',
      time: '4h 30m',
      rating: 4.8,
      completed: true
    },
    { 
      trail: 'Forest Loop Trail', 
      date: '3 days ago', 
      distance: '8.7km',
      elevation: '320m',
      difficulty: 'Beginner',
      time: '2h 15m',
      rating: 4.2,
      completed: true
    },
    { 
      trail: 'Mountain Ridge Challenge', 
      date: '1 week ago', 
      distance: '22.5km',
      elevation: '1,850m',
      difficulty: 'Advanced',
      time: '6h 45m',
      rating: 4.9,
      completed: true
    },
    { 
      trail: 'River Valley Expedition', 
      date: 'Upcoming', 
      distance: '12.8km',
      elevation: '560m',
      difficulty: 'Intermediate',
      time: '3h 30m',
      rating: null,
      completed: false
    },
  ];

  const achievements = [
    { title: 'Mountain Master', description: 'Completed 10+ mountain hikes', progress: 100, icon: Mountain },
    { title: 'Distance Warrior', description: 'Hiked over 200km', progress: 100, icon: Map },
    { title: 'Weekend Explorer', description: 'Hiked 4 weekends in a row', progress: 75, icon: Calendar },
    { title: 'Trail Blazer', description: 'First to complete new trail', progress: 100, icon: Trophy },
  ];

  const quickActions = [
    { label: 'Plan New Hike', icon: Compass, color: 'bg-gradient-to-r from-emerald-600 to-teal-600' },
    { label: 'Find Hiking Buddies', icon: Users, color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
    { label: 'Explore Trails', icon: MapPin, color: 'bg-gradient-to-r from-purple-600 to-pink-600' },
    { label: 'View Analytics', icon: Activity, color: 'bg-gradient-to-r from-amber-600 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
                <Mountain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Welcome back! Here's your hiking overview</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50 shadow-sm">
            {['week', 'month', 'year'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                      <TrendingUp className="h-4 w-4" />
                      {stat.trend === 'up' ? '+' : '-'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                  <div className="text-sm text-emerald-600 font-medium">{stat.change}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Hikes */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                    Recent Hikes
                  </h2>
                  <p className="text-gray-600">Your latest adventures</p>
                </div>
                <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-4">
                {recentHikes.map((hike, index) => (
                  <div 
                    key={index}
                    className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:shadow-lg ${
                      hike.completed 
                        ? 'bg-gradient-to-r from-white to-emerald-50/50 border border-emerald-100/50' 
                        : 'bg-gradient-to-r from-white to-blue-50/50 border border-blue-100/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{hike.trail}</h3>
                          {hike.rating && (
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                              <span className="text-sm font-medium text-amber-700">{hike.rating}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Map className="h-4 w-4 text-gray-400" />
                            {hike.distance}
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-gray-400" />
                            {hike.elevation}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            {hike.time}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              hike.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                              hike.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                              hike.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {hike.difficulty}
                            </div>
                            <span className={`text-sm ${
                              hike.completed ? 'text-emerald-600' : 'text-blue-600'
                            } font-medium`}>
                              {hike.date}
                            </span>
                          </div>
                          
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-emerald-600 hover:text-emerald-700">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievement Progress */}
            <div className="mt-8 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="h-6 w-6 text-amber-600" />
                    Achievements Progress
                  </h2>
                  <p className="text-gray-600">Track your hiking milestones</p>
                </div>
                <span className="text-sm text-emerald-600 font-medium">4 of 12 completed</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div key={index} className="bg-white/50 rounded-xl p-4 border border-white/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-emerald-600">{achievement.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              achievement.progress === 100 
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                                : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className={`w-full flex items-center justify-between p-4 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${action.color}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{action.label}</span>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Hikes */}
            <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Hike</h2>
                <p className="text-gray-600">River Valley Expedition</p>
              </div>
              
              <div className="relative rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-gray-900">12.8km</div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      Intermediate
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">Nov 28, 2024</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">3h 30m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Elevation</span>
                      <span className="font-medium">560m</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    Prepare for Hike
                  </button>
                </div>
              </div>
            </div>

            {/* Leaderboard Snapshot */}
            <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl border border-white/40 shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Hikers</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Alex Johnson', hikes: 32, rank: 1 },
                  { name: 'Sarah Miller', hikes: 28, rank: 2 },
                  { name: 'You', hikes: 24, rank: 3 },
                  { name: 'Mike Chen', hikes: 22, rank: 4 },
                  { name: 'Emma Wilson', hikes: 20, rank: 5 },
                ].map((hiker, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                        hiker.rank === 1 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
                        hiker.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white' :
                        hiker.rank === 3 ? 'bg-gradient-to-r from-amber-700 to-orange-700 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {hiker.rank}
                      </div>
                      <div>
                        <div className={`font-medium ${
                          hiker.name === 'You' ? 'text-emerald-700' : 'text-gray-900'
                        }`}>
                          {hiker.name}
                        </div>
                        <div className="text-sm text-gray-600">{hiker.hikes} hikes</div>
                      </div>
                    </div>
                    {hiker.name === 'You' && (
                      <div className="text-emerald-600 font-medium">You!</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 backdrop-blur-sm"></div>
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-3">Ready for your next adventure?</h2>
                <p className="text-white/90 text-lg">Explore breathtaking trails and challenge yourself!</p>
                <div className="flex items-center gap-4 mt-6">
                  <button className="px-6 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                    Browse Trails
                  </button>
                  <button className="px-6 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                    Join Community
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                  <Mountain className="h-24 w-24 text-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}