export interface RefreshToken {
  refreshToken: string;
  expireAt: number;
  addressIP: string;
}

export interface JwtToken {
  accessToken: string;
  expireAt: number;
}

export interface LoginResult {
  message: string;
  jwtToken: JwtToken;
  refreshToken: RefreshToken;
}
