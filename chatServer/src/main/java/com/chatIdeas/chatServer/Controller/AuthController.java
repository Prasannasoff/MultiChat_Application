package com.chatIdeas.chatServer.Controller;

import com.chatIdeas.chatServer.Entity.UserDetails;
import com.chatIdeas.chatServer.Repository.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.chatIdeas.chatServer.config.JwtUtil;
@RestController
@RequestMapping("/api")
public class AuthController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private Repo repo;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserDetails userDetails) throws Exception {
        UserDetails user = repo.findByEmail(userDetails.getEmail());
        System.out.print("Details" + user);
        if (user == null || !user.getPassword().equals(userDetails.getPassword())) {
            throw new Exception("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    public static class AuthResponse {
        private String token;

        public AuthResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer")) {
            return ResponseEntity.status(400).body("Invalid Authorization header");

        }
        String token = authorizationHeader.substring(7);
        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.extractEmail(token);
            return ResponseEntity.ok("Email extracted from token: " + email);

        } else {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}


