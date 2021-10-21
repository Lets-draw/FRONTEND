package edu.eci.arsw.letsdraw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"edu.eci.arsw.letsdraw"})
public class LetsDrawApplication {

	public static void main(String[] args) {
		SpringApplication.run(LetsDrawApplication.class, args);
	}
}
