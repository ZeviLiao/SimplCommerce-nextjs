# Test Accounts

This document contains test accounts for development and testing purposes.

## Admin Account

**Email:** `admin@example.com`
**Password:** `admin123`
**Role:** `admin`

- Full access to admin panel
- Can manage all resources (products, categories, orders, users, etc.)

## Customer Account

**Email:** `customer@example.com`
**Password:** `customer123`
**Role:** `customer`

- Standard customer access
- Can browse products, manage cart, place orders
- Can view and edit own profile

## Quick Links

- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Home:** http://localhost:3000

## Notes

- These accounts are automatically created when you run the seed script
- Passwords are hashed using bcrypt with cost factor 10
- For production, make sure to change these credentials
