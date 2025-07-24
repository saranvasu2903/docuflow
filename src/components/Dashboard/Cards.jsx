export function Cards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Batches */}
      <div className="bg-white p-4 rounded-3xl shadow w-full h-30">
        {/* <div className="text-xs text-gray-500 mb-1">Batches</div> */}
        
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">85%</div>
          <div className="text-green-500 text-xs font-medium">+8%</div>
        </div>
      </div>

      {/* Room Occupancy */}
      <div className="bg-white p-4 rounded-3xl shadow w-full h-30">
        {/* <div className="text-xs text-gray-500 mb-1">Room occupancy</div> */}
        
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">65%</div>
          <div className="text-red-500 text-xs font-medium">-5%</div>
        </div>
      </div>

      {/* Guest Satisfaction */}
      <div className="bg-white p-4 rounded-3xl shadow w-full h-30">
        {/* <div className="text-xs text-gray-500 mb-1">Guest satisfaction</div> */}
        
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">4.7/5</div>
          <div className="text-green-500 text-xs font-medium">+2%</div>
        </div>
      </div>
    </div>
  )
}
