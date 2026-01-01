package mohammad.development.praxis.controllers;

import mohammad.development.praxis.DTOs.AdminSubmissionUpdateRequest;
import mohammad.development.praxis.DTOs.UpdateStatusRequest;
import mohammad.development.praxis.modules.patient.Submission;
import mohammad.development.praxis.modules.patient.SubmissionStatus;
import mohammad.development.praxis.repos.SubmissionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/submissions")
public class AdminSubmissionController {

    private final SubmissionRepository submissionRepository;

    public AdminSubmissionController(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    // GET /api/admin/submissions?status=NEW
    @GetMapping
    public List<Submission> list(@RequestParam(name = "status", required = false) SubmissionStatus status) {
        if (status == null) {
            // default: neueste zuerst
            return submissionRepository.findAll()
                    .stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .toList();
        }
        return submissionRepository.findAllByStatusOrderByCreatedAtDesc(status);
    }

    // GET /api/admin/submissions/{id}
    @GetMapping("/{id}")
    public Submission get(@PathVariable String id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
    }

    @PatchMapping("/{id}")
    public Submission update(@PathVariable String id,
                                    @RequestBody AdminSubmissionUpdateRequest req) {
        Submission s = submissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));
        s.setPatientData(req.getPatientData());
        s.setConsents(req.getConsents());
        s.setMedical(req.getMedical());
        return submissionRepository.save(s);
    }

    // PATCH /api/admin/submissions/{id}/status
    @PatchMapping("/{id}/status")
    public Submission updateStatus(@PathVariable String id, @RequestBody UpdateStatusRequest req) {
        if (req.getStatus() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        Submission s = submissionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Submission not found"));

        s.setStatus(req.getStatus());
        return submissionRepository.save(s);
    }
}
