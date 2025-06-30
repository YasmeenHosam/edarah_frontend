# **Authentication API Documentation**

This documentation provides a comprehensive guide for frontend developers on how to interact with the authentication API endpoints. It includes details on request/response formats, authentication requirements, and error handling.

The base URL for all authentication endpoints is `/api/auth`.

---

## **1. Register a New User**

Creates a new user account in the system.

*   **Endpoint**: `POST /api/auth/register`
*   **Authentication**: Not required.

### Request Body

| Field | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `firstName` | `String` | The user's first name. | Yes |
| `lastName` | `String` | The user's last name. | Yes |
| `email` | `String` | The user's email address. Must be unique. | Yes |
| `password` | `String` | The user's password. Must meet strength requirements (e.g., min 8 chars, uppercase, lowercase, number, special char). | Yes |
| `phoneNumber` | `String` | The user's phone number. | Yes |

**Example Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "phoneNumber": "1234567890"
}
```

### Responses

**✅ Success Response (201 Created):**
Returns a success message, the newly created user object (without the password), and a JWT for immediate login.

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "client",
    "phone_number": "1234567890",
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:00:00.000Z"
  },
  "token": "your.jwt.token"
}
```

**❌ Error Responses:**

*   **400 Bad Request (Validation Failed):**
    ```json
    {
      "error": "Validation failed",
      "message": "Please check your input",
      "details": ["Password must be at least 8 characters long"]
    }
    ```
*   **409 Conflict (User Already Exists):**
    ```json
    {
      "error": "User already exists",
      "message": "A user with this email already exists"
    }
    ```

---

## **2. Login User**

Authenticates a user and returns a JWT.

*   **Endpoint**: `POST /api/auth/login`
*   **Authentication**: Not required.

### Request Body

| Field | Type | Description | Required |
| :--- | :--- | :--- | :--- |
| `email` | `String` | The user's email address. | Yes |
| `password`| `String` | The user's password. | Yes |

**Example Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

### Responses

**✅ Success Response (200 OK):**
Returns a success message, the user object, and a JWT. This token must be stored on the client and sent in the `Authorization` header for protected routes.

```json
{
  "message": "Login successful",
  "user": {
    "id": "123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "client",
    "phone_number": "1234567890",
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:05:00.000Z"
  },
  "token": "your.jwt.token"
}
```

**❌ Error Responses:**

*   **401 Unauthorized (Invalid Credentials):**
    ```json
    {
      "error": "Invalid credentials",
      "message": "Email or password is incorrect"
    }
    ```

---

## **3. Get User Profile**

Fetches the profile of the currently authenticated user.

*   **Endpoint**: `GET /api/auth/me`
*   **Authentication**: **Required**. A valid JWT must be sent in the `Authorization` header as a Bearer token.
    *   Example Header: `Authorization: Bearer your.jwt.token`

### Responses

**✅ Success Response (200 OK):**
Returns the user's profile information.

```json
{
  "user": {
    "id": "123",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "role": "client",
    "phone_number": "1234567890",
    "created_at": "2023-10-27T10:00:00.000Z",
    "updated_at": "2023-10-27T10:05:00.000Z"
  }
}
```

**❌ Error Responses:**

*   **401 Unauthorized (No/Invalid Token):**
    ```json
    {
      "error": "Access denied",
      "message": "No token provided"
    }
    ```
*   **404 Not Found (User Not Found):**
    ```json
    {
      "error": "User not found",
      "message": "User profile not found"
    }
    ```

---

## **4. Logout User**

This is a conceptual endpoint. Since JWTs are stateless, logout is handled client-side by deleting the token.

*   **Endpoint**: `POST /api/auth/logout`
*   **Authentication**: **Required**.

### Responses

**✅ Success Response (200 OK):**
Confirms that the server has received the logout request. The client is responsible for clearing the token.

```json
{
  "message": "Logout successful",
  "note": "Please remove the token from client storage"
}
```

---

## **5. Refresh Token**

Generates a new JWT for an authenticated user. This is useful for extending a user's session without requiring them to log in again.

*   **Endpoint**: `POST /api/auth/refresh`
*   **Authentication**: **Required**. A valid (but potentially expired) JWT is needed to identify the user. Your token validation logic should handle this.

### Responses

**✅ Success Response (200 OK):**
Returns a new JWT. The client should replace the old token with this new one.

```json
{
  "message": "Token refreshed successfully",
  "token": "your.new.jwt.token"
}
```

**❌ Error Responses:**

*   **401 Unauthorized / 403 Forbidden (Invalid Token):** If the refresh token is invalid or the user is not found.
*   **404 Not Found (User Not Found):**
    ```json
    {
      "error": "User not found",
      "message": "User no longer exists"
    }
    ```

</rewritten_file> 