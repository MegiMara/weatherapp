// export interface User {
//   username: string;
//   email: string;
//   password: string;
// }


// src/app/core/models/user.model.ts
export interface User {
  id?: string;
  name: string;
  username: string;
  email: string;
  password?: string; // Vetëm për memorie, mos e ruaj në storage
  avatar?: string;
  favoriteCities: string[];
  joinDate: Date;
  firstName?: string;
  lastName?: string;
  subscribeNewsletter?: boolean;
}

// Interface për Register payload
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  subscribeNewsletter: boolean;
}

// Interface për Login payload
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Interface për Login response nga backend
export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  user?: Partial<User>;
  refreshToken?: string;
  expiresIn?: number;
}

// Interface për API Error Response
export interface ApiErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
  statusCode?: number;
}