package com.chatIdeas.chatServer.config;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private String SECRET_KEY = "prasannaUnique03"; // Use a secure secret key
    private long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email);
    }


    private String createToken(Map<String, Object> claims, String subject) {
        // Set system time in IST (or your local time zone)
        ZonedDateTime currentTime = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        ZonedDateTime expirationTime = currentTime.plusHours(1);

        System.out.println("System Time (IST): " + currentTime);
        System.out.println("Token Expiry (IST): " + expirationTime);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(Date.from(currentTime.toInstant()))  // Convert to Date
                .setExpiration(Date.from(expirationTime.toInstant()))  // Convert to Date
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }


    public Boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            boolean isExpired = isTokenExpired(token);

            if (isExpired) {
                System.out.println("🚫 Token has expired in IST timezone.");
            }

            return !isExpired;

        } catch (ExpiredJwtException e) {
            System.out.println("🚫 Token has expired!");
            return false;
        } catch (SignatureException | MalformedJwtException e) {
            System.out.println("🚫 Invalid token signature or structure.");
            return false;
        } catch (Exception e) {
            System.out.println("🚫 Token validation error.");
            return false;
        }
    }


    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        ZonedDateTime nowIST = ZonedDateTime.now(ZoneId.of("Asia/Kolkata")); // Current IST time
        ZonedDateTime tokenExpiry = extractAllClaims(token).getExpiration()
                .toInstant()
                .atZone(ZoneId.of("Asia/Kolkata")); // Convert Expiry Time to IST

        System.out.println("🔹 Current IST Time: " + nowIST);
        System.out.println("🔹 Token Expiry Time (IST): " + tokenExpiry);

        return tokenExpiry.isBefore(nowIST); // Check if token expiry is before current time
    }

}
