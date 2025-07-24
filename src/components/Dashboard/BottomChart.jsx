import React from 'react';

export function BottomChart() {
  const data = [
    { label: 'Batches', value: 56, color: 'bg-black text-white', text: 'Batches' },
    { label: 'Pending', value: 14, color: 'bg-purple-200 text-black', text: 'Pending' },
    { label: 'Process', value: 30, color: 'bg-purple-500 text-white', text: 'Process' }
  ];

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Assign positions
  const center = sortedData[0];
  const left = sortedData[1];
  const right = sortedData[2];

  // Find max value for scaling reference
  const maxValue = center.value;

  // Define max bubble size in px
  const maxSize = 160;
  const minSize = 60;

  // Function to scale bubble sizes
  const scaleSize = (value) => {
    const size = (value / maxValue) * maxSize;
    return Math.max(size, minSize); // Ensure a minimum size
  };

  const centerSize = scaleSize(center.value);
  const leftSize = scaleSize(left.value);
  const rightSize = scaleSize(right.value);

  return (
    <div className="bg-white p-4 rounded-3xl shadow w-full h-68 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-medium">Top category</h3>
        </div>
        <select className="select select-sm select-bordered">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Quarterly</option>
        </select>
      </div>

      <div className="relative flex items-end justify-center h-[260px] overflow-hidden">
        {/* Center Bubble */}
        <div
          key={center.label}
          className={`absolute z-20 rounded-full flex items-center justify-center ${center.color} transition-all duration-500 ease-in-out`}
          style={{
            width: `${centerSize}px`,
            height: `${centerSize}px`,
            bottom: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">{center.value}%</div>
            <div className="text-xs">{center.text}</div>
          </div>
        </div>

        {/* Left Bubble */}
        <div
          key={left.label}
          className={`absolute z-20 rounded-full flex items-center justify-center ${left.color} transition-all duration-500 ease-in-out`}
          style={{
            width: `${leftSize}px`,
            height: `${leftSize}px`,
            bottom: '130px',
            left: '10%',
            transform: `translateY(${(centerSize - leftSize) / 2}px)`,
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold">{left.value}%</div>
            <div className="text-xs">{left.text}</div>
          </div>
        </div>

        {/* Right Bubble */}
        <div
          key={right.label}
          className={`absolute z-10 rounded-full flex items-center justify-center ${right.color} transition-all duration-500 ease-in-out`}
          style={{
            width: `${rightSize}px`,
            height: `${rightSize}px`,
            bottom: '130px',
            right: '13%',
            transform: `translateY(${(centerSize - rightSize) / 2}px)`,
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold">{right.value}%</div>
            <div className="text-xs">{right.text}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
