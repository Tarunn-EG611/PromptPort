package com.example.demo.config;

import com.example.demo.entity.PromptCategory;
import com.example.demo.entity.Role;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.PromptCategoryRepository;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final PromptCategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository,
                      PromptCategoryRepository categoryRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        seedUser(
                "engineer",
                "engineer@promptport.com",
                "engineer123",
                Role.PROMPT_ENGINEER
        );

        seedUser(
                "lead",
                "lead@promptport.com",
                "lead123",
                Role.TEAM_LEAD
        );

        seedUser(
                "collector",
                "collector@promptport.com",
                "collector123",
                Role.PROMPT_COLLECTOR
        );

        seedCategories();
    }

    private void seedUser(String username,
                          String email,
                          String password,
                          Role role) {

        if (!userRepository.existsByUsername(username)) {

            SystemUser user = new SystemUser();

            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(
                    passwordEncoder.encode(password)
            );
            user.setRole(role);

            userRepository.save(user);
        }
    }

    private void seedCategories() {

        if (categoryRepository.count() == 0) {

            createCategory("Creative Writing");
            createCategory("Coding");
            createCategory("Marketing");
            createCategory("Data Analysis");
            createCategory("Chatbots");
        }
    }

    private void createCategory(String name) {

        PromptCategory category = new PromptCategory();

        category.setName(name);
        category.setSlug(
                name.toLowerCase(java.util.Locale.ROOT)
                        .replace(" ", "-")
        );
        category.setTemplateCount(0);

        categoryRepository.save(category);
    }
}