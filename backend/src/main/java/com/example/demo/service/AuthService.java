package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final SystemUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDto register(RegisterDto dto) {

        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        SystemUser user = new SystemUser();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());

        user = userRepository.save(user);

        User userDetails = new User(
                user.getUsername(),
                "",
                Collections.singletonList(
                        new SimpleGrantedAuthority(user.getRole().name())
                )
        );

        String token = jwtService.generateToken(userDetails);

        return new AuthResponseDto(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }

    public AuthResponseDto login(AuthRequestDto dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getUsername(),
                        dto.getPassword()
                )
        );

        SystemUser user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User userDetails = new User(
                user.getUsername(),
                "",
                Collections.singletonList(
                        new SimpleGrantedAuthority(user.getRole().name())
                )
        );

        String token = jwtService.generateToken(userDetails);

        return new AuthResponseDto(
                token,
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }
}