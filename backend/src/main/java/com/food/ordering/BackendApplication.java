package com.food.ordering;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.food.ordering.repository.CategoryRepository;
import com.food.ordering.model.Category;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category c1 = new Category();
                c1.setName("Fast Food");
                categoryRepository.save(c1);
                Category c2 = new Category();
                c2.setName("Desserts");
                categoryRepository.save(c2);
                Category c3 = new Category();
                c3.setName("Beverages");
                categoryRepository.save(c3);
                Category c4 = new Category();
                c4.setName("Main Course");
                categoryRepository.save(c4);
                System.out.println("Added 4 default categories for testing!");
            }
        };
    }
}
