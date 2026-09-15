package com.example.projectmanagement.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.projectmanagement.entity.TopicCategory;
import com.example.projectmanagement.repository.TopicCategoryRepository;

@Configuration
public class TopicCategorySeedConfig {
    @Bean
    CommandLineRunner seedTopicCategories(TopicCategoryRepository repository) {
        return args -> {
            if (repository.count() != 0) return;
            repository.saveAll(List.of(
                    category("SE_ENTERPRISE", "Phát triển phần mềm doanh nghiệp"),
                    category("SE_DOMAIN", "Phát triển phần mềm chuyên ngành"),
                    category("AI_ML", "Trí tuệ nhân tạo và học máy"),
                    category("BIG_DATA", "Dữ liệu lớn và Phân tích dữ liệu"),
                    category("SECURITY", "An toàn thông tin và quản trị hệ thống"),
                    category("TESTING", "Kiểm thử phần mềm")
            ));
        };
    }
    private TopicCategory category(String code, String name) {
        return TopicCategory.builder().code(code).name(name).isActive(true).build();
    }
}
