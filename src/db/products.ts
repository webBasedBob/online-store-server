import { Model, DataTypes, Sequelize, Op } from "sequelize";
import sequelizeDB from "./config";
import {
  Product,
  ProductInfo,
  ProductSpecifications,
} from "../../types/products";
import { getPhotoURL, uploadPicture } from "./storage";
import sharp from "sharp";

const Product = sequelizeDB.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    description: DataTypes.STRING,
    old_price: DataTypes.FLOAT,
    current_price: DataTypes.FLOAT,
  },
  {
    modelName: "products",
    createdAt: "inserted_at",
    updatedAt: "updated_at",
  }
);

const ProductSpecifications = sequelizeDB.define("ProductSpecifications", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phone_type: DataTypes.STRING,
  sim_slots: DataTypes.STRING,
  sim_type: DataTypes.STRING,
  os: DataTypes.STRING,
  os_version: DataTypes.STRING,
  conectivity: DataTypes.STRING,
  bluetooth_vversion: DataTypes.STRING,
  cpu: DataTypes.STRING,
  cpu_cores: DataTypes.STRING,
  cpu_freq: DataTypes.STRING,
  physical_dimensions_w: DataTypes.INTEGER,
  physical_dimensions_l: DataTypes.INTEGER,
  physical_dimensions_h: DataTypes.INTEGER,
  weight: DataTypes.STRING,
  network_gen: DataTypes.STRING,
  display_size: DataTypes.STRING,
  display_type: DataTypes.STRING,
  display_res_w: DataTypes.STRING,
  display_res_l: DataTypes.STRING,
  display_refresh: DataTypes.STRING,
  charging_port: DataTypes.STRING,
  battery_size: DataTypes.STRING,
  charging_power: DataTypes.STRING,
  camera_number: DataTypes.STRING,
  camera_main: DataTypes.STRING,
  camera_secondary: DataTypes.STRING,
  color: DataTypes.STRING,
  storage: DataTypes.STRING,
  ram: DataTypes.STRING,
});

const ProductImage = sequelizeDB.define("ProductImage", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  path: DataTypes.STRING,
  type: DataTypes.STRING,
  size: DataTypes.STRING,
  public_url: DataTypes.STRING,
});

Product.hasOne(ProductSpecifications, {
  foreignKey: "productId",
  as: "specifications",
});

ProductSpecifications.belongsTo(Product, {
  foreignKey: "productId",
});

Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
});

ProductImage.belongsTo(Product, {
  foreignKey: "productId",
});

interface PrefixAndName {
  prefix: string;
  name: string;
}

const splitPrefixAndName = (key: string): PrefixAndName => {
  const separatorIndex = key.indexOf("-");
  if (separatorIndex === -1) {
    throw new Error("Invalid key format: " + key);
  }

  const prefix = key.slice(0, separatorIndex);
  const name = key.slice(separatorIndex + 1);

  return { prefix, name };
};

const addWidthToName = (name: string, width: string): string => {
  const preExtensionName = name.slice(0, name.indexOf("."));
  const extension = name.slice(name.indexOf("."));
  return preExtensionName + "-" + width + ".avif";
};

interface ProductTextData {
  productInfo: ProductInfo;
  productSpecifications: ProductSpecifications;
}

const extractData = (formData: FormData): ProductTextData => {
  let productGeneralInfo = {} as ProductInfo;
  let productSpecifications = {} as ProductSpecifications;
  for (let key in formData) {
    const { prefix, name: keyName } = splitPrefixAndName(key);
    if (prefix === "info") {
      // productGeneralInfo[keyName] = formData[key];
      (productGeneralInfo as any)[keyName] = (formData as any)[key];
    }
    if (prefix === "spec") {
      (productSpecifications as any)[keyName] = (formData as any)[key];
    }
  }
  return {
    productInfo: productGeneralInfo,
    productSpecifications: productSpecifications,
  };
};

export const addProductInDB = async (
  reqBody: FormData,
  reqFiles: Record<string, Express.Multer.File[]>
) => {
  // uploadPicture(req.files[0]);
  let productData = extractData(reqBody);
  let transaction;
  try {
    transaction = await sequelizeDB.transaction();

    const newProduct = await Product.create(
      {
        inserted_at: new Date(),
        updated_at: new Date(),
        ...productData.productInfo,
      },
      {
        transaction,
      }
    );

    const productSpecificationsData = {
      ...productData.productSpecifications,
      productId: newProduct.id,
    };
    await ProductSpecifications.create(productSpecificationsData, {
      transaction,
    });

    //images
    let imageNumber = 1;
    const imagesArr = [];
    const widths = { preview: 500, micro: 100, normal: 1000 };
    for (let image of reqFiles) {
      for (let width in widths) {
        if (imageNumber !== 1 && width === "preview") {
          continue;
        }
        const resizedImage = await sharp(image.buffer)
          .resize(widths[width])
          .toFormat("avif") // Change the format to AVIF
          .toBuffer();
        const imageUploadData = await uploadPicture(
          {
            ...image,
            originalname: addWidthToName(image.originalname, width),
            buffer: resizedImage,
          },
          newProduct.id
        );
        const imagePath = imageUploadData.path;
        const imageUrl = getPhotoURL(imagePath);
        const imageType = imageNumber === 1 ? "main" : "secondary";
        const imageData = {
          path: imagePath,
          type: imageType,
          size: width,
          productId: newProduct.id,
          public_url: imageUrl,
        };
        imagesArr.push(imageData);
      }
      imageNumber++;
    }

    await ProductImage.bulkCreate(imagesArr, {
      transaction,
    });

    await transaction.commit();

    console.log("Product added successfully.");
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding product:", error);
  }
};
