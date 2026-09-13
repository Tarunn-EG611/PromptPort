package com.example.demo.service;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import io.netty.resolver.DefaultAddressResolverGroup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private static final String GEMINI_PATH =
            "/v1beta/models/gemini-3.6-flash:generateContent";

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String googleApiKey;

    public AiService(WebClient.Builder builder) {

        HttpClient httpClient = HttpClient.create()
                .resolver(DefaultAddressResolverGroup.INSTANCE)
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 15000)
                .responseTimeout(Duration.ofSeconds(45))
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(45))
                        .addHandlerLast(new WriteTimeoutHandler(45)));

        this.webClient = builder
                .baseUrl("https://generativelanguage.googleapis.com")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
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
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> Mono.error(
                                            new RuntimeException("Client error: " + errorBody)
                                    ))
                    )
                    .onStatus(
                            HttpStatusCode::is5xxServerError,
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .flatMap(errorBody -> Mono.error(
                                            new RuntimeException("Server error: " + errorBody)
                                    ))
                    )
                    .bodyToMono(
                            new ParameterizedTypeReference<Map<String, Object>>() {
                            }
                    )
                    .timeout(Duration.ofSeconds(60))
                    .block();

            String text = extractText(response);

            return text == null ? "No response from AI." : text;

        } catch (RuntimeException e) {
            log.error("Error calling Gemini API", e);
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

        } catch (ClassCastException e) {
            log.error("Unexpected Gemini response structure", e);
            return null;
        }
    }
}