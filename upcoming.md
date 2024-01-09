# Upcoming Changes
*Last Updated: January 8th, 2024*

* * *

## Frontend

### General changes

- Change the terminology from *Vendor* to *Seller*
- Make the snackbar global, rather than individual elements creating it
- Change the custom components to allow additional sx styling

### Home Page

- Tabs to display the different sections of the page
- A button to conveniently scroll-up the page
- Submission form in the 'Contact Us' section

### Sign up Page

- Third-party sign-up (Google & Facebook) functionality
- Allow the user to choose either a buyer or seller role
- Allow the user to create a seller profile
- Require email verification upon account creation

### Log in Page

- Third-party log-in (Google & Facebook) functionality
- Allow the user to recover their password

### Profile Page

- Allow the user to update their email and password
- Create the functionality to add multiple addresses
- Change the tabs section to allow the user to see either buyer or seller profile

### Buy Page

- Allow buyers to see the review score for sellers and their menu items
- Allow buyers to filter the sellers list by distance between the selected address and the seller
- Implement pagination with a limit of 10 sellers per page

### Checkout Page

- Calculate tax depending on the user's selected address
- Allow users to make payments using with:
  - Credit card  
  - PayPal
  - Apple pay
  - Google pay

### Orders page

- View previous & current orders
- Allow the user to update the status of the order
  - For Buyers: cancelling their order
  - For Sellers: updating the status of the order
- Allow a buyer to create a review on completed orders

### Review Page

- Allow a buyer to create (and later modify) a review for a seller
- Allow a buyer to review menu items that ordered

### Sell page

- Allow sellers to view their menu
- Functionality to make changes to existing items
- Functionality for a seller to create new menu items and delete old ones
- Allow sellers to see statistics on their performance

* * *

## Backend

### User

- A user will now either be a buyer or seller
- The address and phone number fields will be moved to user model
- Multiple addresses for a user will be allowed
- Functionality to update a user's credentials
- A third party API for address suggestion/validation will be incorporated

### Buyer

- Endpoints for review functionality
- A buyer's reviews will be stored

### Vendor

- Change the terminology from *Vendor* to *Seller*
- Pagination for the allVendors endpoing
- Search for vendors within a certain distance
- An update review score

### Third Party API Integration

- Signup & Login with: Google, Facebook
- Payments with: Credit card, PayPal, Apple pay, Google pay

### Etc

- Functionality to contact the developer via email
- Jest testing for the items endpoints

* * *
