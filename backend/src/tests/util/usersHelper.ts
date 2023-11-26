import bcrypt from "bcrypt";
import { Types } from "mongoose";
import * as Interfaces from "../../util/interfaces";

/** Interface for the details of a user profile. */
interface UserDetails extends Omit<Interfaces.User, "_id"> {}
/** Interface for the details of a buyer profile. */
interface BuyerDetails extends Omit<Interfaces.Buyer, "_id"> {}
/** Interface for the details of a vendor profile. */
interface VendorDetails extends Omit<Interfaces.Vendor, "_id"> {}
/** Expected types of the details of any user object. */
type DetailType = UserDetails | BuyerDetails | VendorDetails;
/** Expected types of properties within any users object. */
type ExpectedType = Types.ObjectId | string | number | boolean | Types.ObjectId[] | string[] | null;

/****************************************************************************************
 * Note: The following functions are used to prepare the details of a user, buyer, or   *
 * vendor profile, and to compare the details of a new object with the expected details.*
 *
 * The functions are used in the following tests:
 * - backend/src/tests/mockDB/addUsersData.test.ts
 * - backend/src/tests/users/user.test.ts
 * - backend/src/tests/users/buyer.test.ts
 * - backend/src/tests/users/vendor.test.ts
 *
 * Regarding the prepare details functions:
 * - Pass includeSelected as true to additionally prepare the 'select' fields in the object.
 * - Pass includeSelected as false to prepare only the required details.
 * - The value of includeSelected depends on whether the details will be used for creating a new
 *   object in the database or for comparing an object to the details.
 ****/

/**
 * Function to prepare the details of a user profile.
 * @param email The email of the user.
 * @returns The prepared user details.
 *
 * Note: There is no includeSelected parameter because user does not have any 'select' fields.
 */
export function prepareUserDetails(email: string): UserDetails {
  return {
    email: email,
    password: "test123",
    _buyer: null,
    _vendor: null,
  } as UserDetails;
}

/**
 * Function to prepare the details of a buyer profile.
 * @param buyerName The name of the buyer.
 * @param includeSelected Whether to additionally prepare the 'select' fields of the buyer, or only
 * the required ones.
 * @returns The prepared buyer details.
 */
export function prepareBuyerDetails(buyerName: string, includeSelected: boolean): BuyerDetails {
  let buyerDetails: BuyerDetails;
  includeSelected
    ? (buyerDetails = {
        buyerName: buyerName,
        address: "123 Main Street",
        phoneNumber: "1234567890",
        carts: [],
        savedVendors: [],
        orders: [],
      } as BuyerDetails)
    : (buyerDetails = {
        buyerName: buyerName,
        address: "123 Main Street",
        phoneNumber: "1234567890",
      } as BuyerDetails);
  return buyerDetails;
}

/**
 * Function to prepare the details of a vendor profile.
 * @param vendorName The name of the buyer.
 * @param includeSelected Whether to additionally prepare the 'select' fields of the vendor, or only
 * the required ones.
 * @returns The prepared vendor details.
 */
export function prepareVendorDetails(vendorName: string, includeSelected: boolean): VendorDetails {
  let vendorDetails: VendorDetails;
  includeSelected
    ? (vendorDetails = {
        vendorName: vendorName,
        address: "123 Main Street",
        priceRange: "$$",
        phoneNumber: "1234567890",
        description: `This is ${vendorName}'s vendor description.`,
        cuisineTypes: [],
        menu: [],
        orders: [],
      } as VendorDetails)
    : (vendorDetails = {
        vendorName: vendorName,
        address: "123 Main Street",
        priceRange: "$$",
        phoneNumber: "1234567890",
        description: `This is ${vendorName}'s vendor description.`,
      } as VendorDetails);
  return vendorDetails;
}

/**
 * Function to test the creation of a new object.
 * @param newObject The new object.
 * @param expectedDetails The expected details of the object.
 * @returns Nothing.
 */
export function testNew<T extends Record<string, ExpectedType>>(
  newObject: T,
  expectedDetails: DetailType
): void {
  // ObjectId check
  expect(newObject).toHaveProperty("_id");
  expect(newObject._id).not.toBeNull();

  // Other properties check
  const properties = Object.keys(expectedDetails);
  properties.forEach((property) => {
    // Check if the property is in the new object
    expect(newObject).toHaveProperty(property);

    // Retrieve the property values
    const expectedValue = Object.getOwnPropertyDescriptor(expectedDetails, property)?.value;
    const actualValue = Object.getOwnPropertyDescriptor(newObject, property)?.value;

    // Comparing ObjectIds
    if (expectedValue instanceof Types.ObjectId)
      expect(expectedValue.equals(actualValue)).toBe(true);
    // Comparing arrays
    else if (Array.isArray(expectedValue))
      expect(arrayEqual(expectedValue, actualValue)).toBe(true);
    // Comparing password
    else if (property === "password")
      expect(bcrypt.compareSync(expectedValue, actualValue)).toBe(true);
    // Comparing other types
    else expect(actualValue).toEqual(expectedValue);
  });
}

/**
 * Function to assert the equality of two objects.
 * @param actualObject The object to be tested.
 * @param expectedObject The expected object.
 * @returns Nothing.
 */
export function compareExisting<T extends Record<string, ExpectedType>>(
  actualObject: T,
  expectedObject: T
): void {
  const properties = Object.keys(expectedObject);

  // Filter out the version property from both properties
  const expectedProperties = properties.filter((property) => {
    return property !== "__v";
  });

  // Compare the values of each property
  expectedProperties.forEach((property) => {
    // Retrieve the property values
    const expectedValue = Object.getOwnPropertyDescriptor(expectedObject, property)?.value;
    const actualValue = Object.getOwnPropertyDescriptor(actualObject, property)?.value;

    // Comparing ObjectIds
    if (expectedValue instanceof Types.ObjectId)
      expect(expectedValue.equals(actualValue)).toBe(true);
    // Comapring arrays
    else if (Array.isArray(expectedValue))
      expect(arrayEqual(expectedValue, actualValue)).toBe(true);
    // Comparing other types
    else expect(actualValue).toEqual(expectedValue);
  });
}

/**
 * Function to compare two arrays of the same type for equality.
 * @param arr1 The first array.
 * @param arr2 The second array.
 * @returns True if the arrays are equal, false otherwise.
 */
function arrayEqual<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}
