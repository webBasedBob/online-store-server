export interface Product {
  productInfo: ProductInfo;
  productSpecifications: ProductSpecifications;
  productImages: [ProductImage];
}

export interface ProductInfo {
  brand: string;
  model: string;
  description: string;
  old_price: number;
  current_price: number;
}

export interface ProductSpecifications {
  phone_type: string;
  sim_slots: string;
  sim_type: string;
  os: string;
  os_version: string;
  conectivity: string;
  bluetooth_vversion: string;
  cpu: string;
  cpu_cores: string;
  cpu_freq: string;
  physical_dimensions_w: number;
  physical_dimensions_l: number;
  physical_dimensions_h: number;
  weight: string;
  network_gen: string;
  display_size: string;
  display_type: string;
  display_res_w: string;
  display_res_l: string;
  display_refresh: string;
  charging_port: string;
  battery_size: string;
  charging_power: string;
  camera_number: string;
  camera_main: string;
  camera_secondary: string;
  color: string;
  storage: string;
  ram: string;
}

export interface ProductImage {
  url: string;
  type: string;
  size: string;
}
