package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;

class AiControllerTest {

    @Test
    void shouldCreateControllerWithAiService() {
        AiService aiService = mock(AiService.class);
        AiController controller = new AiController(aiService);
        assertNotNull(controller);
    }
}
