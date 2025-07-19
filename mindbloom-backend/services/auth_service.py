import os
import jwt
import requests
from typing import Optional, Dict
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

class Auth0Service:
    def __init__(self):
        self.domain = os.getenv("AUTH0_DOMAIN")
        self.audience = os.getenv("AUTH0_AUDIENCE")
        self.client_id = os.getenv("AUTH0_CLIENT_ID")
        self.client_secret = os.getenv("AUTH0_CLIENT_SECRET")
        
        if not all([self.domain, self.audience, self.client_id, self.client_secret]):
            raise ValueError("Missing Auth0 configuration. Please check your .env file.")
        
        self.jwks_url = f"https://{self.domain}/.well-known/jwks.json"
        self._jwks = None
    
    async def get_jwks(self) -> Dict:
        """Get JSON Web Key Set from Auth0"""
        if not self._jwks:
            try:
                response = requests.get(self.jwks_url)
                response.raise_for_status()
                self._jwks = response.json()
            except Exception as e:
                raise HTTPException(status_code=500, detail="Failed to fetch JWKS")
        return self._jwks
    
    async def verify_token(self, token: str) -> Dict:
        """Verify JWT token with Auth0"""
        try:
            # Get the JWKS
            jwks = await self.get_jwks()
            
            # Decode the token header to get the key ID
            unverified_header = jwt.get_unverified_header(token)
            key_id = unverified_header.get("kid")
            
            if not key_id:
                raise HTTPException(status_code=401, detail="Invalid token header")
            
            # Find the correct key
            key = None
            for jwk in jwks["keys"]:
                if jwk["kid"] == key_id:
                    key = jwt.algorithms.RSAAlgorithm.from_jwk(jwk)
                    break
            
            if not key:
                raise HTTPException(status_code=401, detail="Invalid token key")
            
            # Verify the token
            payload = jwt.decode(
                token,
                key,
                algorithms=["RS256"],
                audience=self.audience,
                issuer=f"https://{self.domain}/"
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.JWTError as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=401, detail="Token verification failed")
    
    async def get_user_info(self, token: str) -> Dict:
        """Get user information from Auth0"""
        try:
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(
                f"https://{self.domain}/userinfo",
                headers=headers
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=401, detail="Failed to get user info")
    
    async def get_management_token(self) -> str:
        """Get management API token for admin operations"""
        try:
            payload = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "audience": f"https://{self.domain}/api/v2/",
                "grant_type": "client_credentials"
            }
            
            response = requests.post(
                f"https://{self.domain}/oauth/token",
                json=payload
            )
            response.raise_for_status()
            
            return response.json()["access_token"]
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to get management token") 