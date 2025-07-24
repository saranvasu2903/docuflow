import Image from "next/image";

export function Table() {
  const reservations = [
    {
      id: "1223",
      guest: {
        name: "Alex Tee",
        email: "AlexT@gmail.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      room: { number: "S-01", type: "Single" },
      checkIn: "Jan 21, 2025",
      checkOut: "Jan 26, 2025",
      status: "New",
    },
    {
      id: "1224",
      guest: {
        name: "Annette Black",
        email: "Ann23@gmail.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      room: { number: "S-22", type: "Single" },
      checkIn: "Jan 8, 2025",
      checkOut: "Jan 20, 2025",
      status: "Checked In",
    },
    {
      id: "1225",
      guest: {
        name: "Jennie Bell",
        email: "JBell22@gmail.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      room: { number: "D-08", type: "Double" },
      checkIn: "Jan 13, 2025",
      checkOut: "Jan 23, 2025",
      status: "Confirmed",
    },
    {
      id: "1226",
      guest: {
        name: "Jenny Wilson",
        email: "WilsonJ77@gmail.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      room: { number: "D-05", type: "Double" },
      checkIn: "Jan 27, 2025",
      checkOut: "Jan 28, 2025",
      status: "Checked Out",
    },
    {
      id: "1227",
      guest: {
        name: "Kristin Watson",
        email: "Kris01@gmail.com",
        image: "/placeholder.svg?height=32&width=32",
      },
      room: { number: "De-02", type: "Deluxe" },
      checkIn: "Jan 7, 2025",
      checkOut: "Jan 20, 2025",
      status: "Canceled",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Checked In":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Checked Out":
        return "bg-blue-100 text-blue-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">New booking</h3>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">Guest name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Room number</th>
              <th className="px-4 py-3">Room type</th>
              <th className="px-4 py-3">Check In</th>
              <th className="px-4 py-3">Checked Out</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className=" hover:bg-gray-50">
                <td className="px-4 py-3">#{reservation.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={reservation.guest.image || "/placeholder.svg"}
                        alt={reservation.guest.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span>{reservation.guest.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {reservation.guest.email}
                </td>
                <td className="px-4 py-3">{reservation.room.number}</td>
                <td className="px-4 py-3">{reservation.room.type}</td>
                <td className="px-4 py-3">{reservation.checkIn}</td>
                <td className="px-4 py-3">{reservation.checkOut}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
