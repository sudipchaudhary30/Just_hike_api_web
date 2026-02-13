export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600" />
              <span className="text-lg font-bold text-gray-900">Just Hike</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Your perfect hiking companion
            </p>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>© {currentYear} Just Hike. All rights reserved.</p>
            <p className="mt-1">Built with passion for hikers worldwide</p>
          </div>
        </div>
      </div>
    </footer>
  )
}