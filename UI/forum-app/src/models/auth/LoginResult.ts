import JwtToken from "../security/JwtToken";
import RefreshToken from '../security/RefreshToken';

export default class LoginResult {
    public message : string; 
    public jwtToken: JwtToken;
    public refreshToken: RefreshToken;
}