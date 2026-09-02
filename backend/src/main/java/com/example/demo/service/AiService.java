package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private static final String GEMINI_PATH =
            "/v1beta/models/gemini-2.5-flash:generateContent";

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String googleApiKey;

    public AiService(WebClient.Builder builder) {

        this.webClient = builder
                .baseUrl("https://generativelanguage.googleapis.com")
                .codecs(configurer ->
                        configurer.defaultCodecs()
                                .maxInMemorySize(2 * 1024 * 1024))
                .build();
    }

    public String generateResponse(String prompt) {

        if (prompt == null || prompt.isBlank()) {
            return "Prompt must not be empty.";
        }

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        try {

            Map<String, Object> response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path(GEMINI_PATH)
                            .queryParam("key", googleApiKey)
                            .build())
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(
                            status -> status.value() == 429,
                            clientResponse -> Mono.error(
                                    new RuntimeException(
                                            "Rate limit exceeded (Quota Exhausted). Please wait a moment and try again."
                                    )
                            )
                    )
                    .onStatus(
                            HttpStatusCode::is4xxClientError,
                            clientResponse -> Mono.error(
                                    new RuntimeException("Client error")
                            )
                    )
                    .onStatus(
                            HttpStatusCode::is5xxServerError,
                            clientResponse -> Mono.error(
                                    new RuntimeException("Server error")
                            )
                    )
                    .bodyToMono(
                            new ParameterizedTypeReference<Map<String, Object>>() {
                            }
                    )
                    .timeout(Duration.ofSeconds(30))
                    .block();

            String text = extractText(response);

            return text == null ? "No response from AI." : text;

        } catch (Exception e) {
            return "Error calling AI: " + e.getMessage();
        }
    }


    public String optimizePrompt(String prompt) {

        String optimizationPrompt =
                "Optimize the following AI prompt for clarity and effectiveness. "
                        + "Return only the optimized prompt text:\n\n"
                        + prompt;

        return generateResponse(optimizationPrompt);
    }


    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {

        if (response == null) {
            return null;
        }

        try {

            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return null;
            }

            Map<String, Object> content =
                    (Map<String, Object>) candidates.get(0).get("content");

            if (content == null) {
                return null;
            }

            List<Map<String, Object>> parts =
                    (List<Map<String, Object>>) content.get("parts");

            if (parts == null || parts.isEmpty()) {
                return null;
            }

            Object text = parts.get(0).get("text");

            return text != null ? text.toString() : null;

        } catch (Exception e) {
            return null;
        }
    }
}