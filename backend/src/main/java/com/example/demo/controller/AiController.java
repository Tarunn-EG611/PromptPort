package com.example.demo.controller;

import com.example.demo.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/generate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> generate(
            @RequestBody Map<String, String> request) {

        String response = aiService.generateResponse(request.get("prompt"));

        Map<String, String> body = new HashMap<>();
        body.put("response", response);

        return ResponseEntity.ok(body);
    }

    @PostMapping("/optimize")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> optimize(
            @RequestBody Map<String, String> request) {

        String response = aiService.optimizePrompt(request.get("prompt"));

        Map<String, String> body = new HashMap<>();
        body.put("response", response);

        return ResponseEntity.ok(body);
    }
}