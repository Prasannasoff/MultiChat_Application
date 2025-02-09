package com.chatIdeas.chatServer;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatServerApplication {
	static {
		// Load environment variables from .env
		Dotenv dotenv = Dotenv.load();

		// Set system properties (Spring Boot reads these automatically)
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
	}

	public static void main(String[] args) {
		SpringApplication.run(ChatServerApplication.class, args);
	}

}
