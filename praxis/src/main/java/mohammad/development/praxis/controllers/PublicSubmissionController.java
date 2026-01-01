package mohammad.development.praxis.controllers;

import mohammad.development.praxis.DTOs.SubmissionCreateRequest;
import mohammad.development.praxis.modules.admin.SseHub;
import mohammad.development.praxis.modules.patient.Submission;
import mohammad.development.praxis.modules.patient.SubmissionStatus;
import mohammad.development.praxis.repos.SubmissionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
public class PublicSubmissionController {
    private SseHub hub;

    private final SubmissionRepository submissionRepository;

    public PublicSubmissionController(SseHub hub, SubmissionRepository submissionRepository) {
        this.hub = hub;
        this.submissionRepository = submissionRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Submission submit(@RequestBody SubmissionCreateRequest req) {
        Submission s = new Submission();
        s.setStatus(SubmissionStatus.NEW);
        s.setFormVersion(req.getFormVersion() != null ? req.getFormVersion() : "v1");
        s.setPatientData(req.getPatientData());
        s.setMedical(req.getMedical());
        s.setConsents(req.getConsents());
        s.setSignature(req.getSignature());
        s.setMeta(req.getMeta());

        Submission sAfterSave = submissionRepository.save(s);
        hub.sendCreated(sAfterSave);
        return sAfterSave;

    }
}
