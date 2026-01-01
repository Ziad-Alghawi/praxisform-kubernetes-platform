package mohammad.development.praxis.modules.admin;

import lombok.RequiredArgsConstructor;
import mohammad.development.praxis.repos.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminRepository.count() > 0) return;

        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin")); // später per ENV/Secret
        admin.setRoles(Set.of("ADMIN"));
        admin.setEnabled(true);

        adminRepository.save(admin);
        System.out.println("✅ Seeded initial admin user: admin / admin");
    }
}
