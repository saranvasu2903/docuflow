"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  { name: "January", value: 455, fill: "#0A0A0A" },
  { name: "February", value: 409, fill: "#F72585", drop: "-10%" },
  { name: "March", value: 222, fill: "url(#striped)" },
];

export function TopChart() {
  return (
    <div className="bg-white p-6 rounded-3xl shadow w-full h-68">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold">Batch Chart</h3>
        </div>
        <select className="select select-sm select-bordered">
          <option>Quantity</option>
          <option>Revenue</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          barCategoryGap={50}
        >
          <defs>
            {/* Pattern for striped March bar */}
            <pattern
              id="striped"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
              patternTransform="rotate(45)"
            >
              <rect width="3" height="6" fill="#B197FC" />
            </pattern>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis hide />
          <Tooltip />

          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
            isAnimationActive
            barSize={50}
          >
            <LabelList
              dataKey="value"
              position="top"
              style={{ fontWeight: "bold", fontSize: 14 }}
            />
            <LabelList
              dataKey="drop"
              position="insideTop"
              offset={12}
              fill="#fff"
              formatter={(value) => value || ""}
              style={{ fontWeight: "bold", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
