import bcrypt from "bcrypt";
import BuyerModel from "../../models/users/buyer";
import UserModel from "../../models/users/user";
import VendorModel from "../../models/users/vendor";
import * as Interfaces from "../../util/interfaces";
import * as Database from "../mongodbMemoryServer";
import * as Data from "./addUsersData";

beforeAll(async () => {
  await Database.connect();
});

afterAll(async () => {
  await Database.close();
});

/** Test data. */
const emails = ["user001@test.com", "user002@test.com"];
let users: Interfaces.User[];
let buyers: Interfaces.Buyer[];
let vendors: Interfaces.Vendor[];

/** Tests for the addUsers function. */
it("should add users to the database", async () => {
  // Add users to the database
  users = await Data.addUsers(emails);

  // Check if users were added successfully
  expect(users).toHaveLength(emails.length);

  // Check if user objects have the expected properties
  const userAttributes = Object.keys(UserModel.schema.paths).filter((attributeName) => {
    return attributeName !== "__v";
  });
  users.forEach((user) => {
    userAttributes.forEach((attributeName) => {
      expect(user).toHaveProperty(attributeName);
    });
  });

  // Check if users exist in the database
  const usersInDatabase = await UserModel.find({ "identification.email": { $in: emails } }).select(
    "+password"
  );
  expect(usersInDatabase).toHaveLength(emails.length);

  // Check if the passwords are hashed
  usersInDatabase.forEach((user) => {
    if (!user.password) throw new Error("Password is not defined.");
    const isPasswordHashed = bcrypt.compareSync("test123", user.password);
    expect(isPasswordHashed).toBe(true);
  });
});

/** Tests for the addBuyers function. */
it("should add buyers to the database", async () => {
  // Add buyers to the database
  buyers = await Data.addBuyers(users);

  // Check if buyers were added successfully
  expect(buyers).toHaveLength(users.length);

  // Check if buyer objects have the expected properties
  const buyerAttributes = Object.keys(BuyerModel.schema.paths).filter((attributeName) => {
    return attributeName !== "__v";
  });
  buyers.forEach((buyer) => {
    buyerAttributes.forEach((attributeName) => {
      expect(buyer).toHaveProperty(attributeName);
    });
  });

  // Check if buyers exist in the database
  const buyersInDatabase = await BuyerModel.find();
  expect(buyersInDatabase).toHaveLength(users.length);

  // Check if each user's buyer profile has been updated
  const usersInDatabase = await UserModel.find();
  usersInDatabase.forEach((user) => {
    expect(user._buyer).toBeDefined();
  });
});

/** Tests for the addVendors function. */
it("should add vendors to the database", async () => {
  // Add vendors to the database
  vendors = await Data.addVendors(users);

  // Check if vendors were added successfully
  expect(vendors).toHaveLength(users.length);

  // Check if vendor objects have the expected properties
  const vendorAttributes = Object.keys(VendorModel.schema.paths).filter((attributeName) => {
    return attributeName !== "__v";
  });
  vendors.forEach((vendor) => {
    vendorAttributes.forEach((attributeName) => {
      expect(vendor).toHaveProperty(attributeName);
    });
  });

  // Check if vendors exist in the database
  const vendorsInDatabase = await VendorModel.find();
  expect(vendorsInDatabase).toHaveLength(users.length);

  // Check if each user's vendor profile has been updated
  const usersInDatabase = await UserModel.find();
  usersInDatabase.forEach((user) => {
    expect(user._vendor).toBeDefined();
  });
});
