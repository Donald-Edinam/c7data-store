export type Network = "MTN" | "Telecel" | "AT";

export interface Bundle {
  id: string;
  network: Network;
  label: string;
  data: string;
  capacityGB: string; // DataMart API "capacity" field — GB as string e.g. "1", "5"
  price: number;      // Your retail price in GHS
  popular?: boolean;
}

export const NETWORKS: { id: Network; label: string; color: string; bg: string }[] = [
  { id: "MTN", label: "MTN", color: "#FFCC00", bg: "#FFF9E6" },
  { id: "Telecel", label: "Telecel", color: "#E30613", bg: "#FEE8E9" },
  { id: "AT", label: "AirtelTigo", color: "#0073BE", bg: "#E6F3FC" },
];

export const BUNDLES: Bundle[] = [
  // MTN — DataMart network: "YELLO"
  { id: "mtn-1gb",  network: "MTN", label: "1 GB",  data: "1GB",  capacityGB: "1",  price: 7 },
  { id: "mtn-2gb",  network: "MTN", label: "2 GB",  data: "2GB",  capacityGB: "2",  price: 13, popular: true },
  { id: "mtn-3gb",  network: "MTN", label: "3 GB",  data: "3GB",  capacityGB: "3",  price: 18.5 },
  { id: "mtn-5gb",  network: "MTN", label: "5 GB",  data: "5GB",  capacityGB: "5",  price: 30 },
  { id: "mtn-10gb", network: "MTN", label: "10 GB", data: "10GB", capacityGB: "10", price: 55 },
  { id: "mtn-20gb", network: "MTN", label: "20 GB", data: "20GB", capacityGB: "20", price: 95 },

  // Telecel — DataMart network: "TELECEL"
  { id: "tel-5gb",  network: "Telecel", label: "5 GB",  data: "5GB",  capacityGB: "5",  price: 25 },
  { id: "tel-10gb", network: "Telecel", label: "10 GB", data: "10GB", capacityGB: "10", price: 47, popular: true },
  { id: "tel-15gb", network: "Telecel", label: "15 GB", data: "15GB", capacityGB: "15", price: 68 },
  { id: "tel-20gb", network: "Telecel", label: "20 GB", data: "20GB", capacityGB: "20", price: 85 },

  // AirtelTigo — DataMart network: "AT_PREMIUM"
  { id: "at-1gb",  network: "AT", label: "1 GB",  data: "1GB",  capacityGB: "1",  price: 5 },
  { id: "at-2gb",  network: "AT", label: "2 GB",  data: "2GB",  capacityGB: "2",  price: 9.5 },
  { id: "at-3gb",  network: "AT", label: "3 GB",  data: "3GB",  capacityGB: "3",  price: 13.5, popular: true },
  { id: "at-20gb", network: "AT", label: "20 GB", data: "20GB", capacityGB: "20", price: 68 },
  { id: "at-30gb", network: "AT", label: "30 GB", data: "30GB", capacityGB: "30", price: 86 },
  { id: "at-40gb", network: "AT", label: "40 GB", data: "40GB", capacityGB: "40", price: 105 },
];
